from .models import User
from random import randint
from django.core.mail import EmailMessage

def generate_username(name):
    """
    generate a non existing username from the name given
    """
    username = ''.join(name.split(' ')).lower()
    if not User.objects.filter(username=username).exists():
        return username
    else:
        random_username = username + str(randint(0, 1000))
        return generate_username(random_username)

def send_email(data):
    email = EmailMessage(subject=data['subject'], body=data['body'], to=[data['to']])
    email.send()