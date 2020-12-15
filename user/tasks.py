from celery import shared_task
from django.core.mail import EmailMessage

@shared_task
def send_email_task(data):
    email = EmailMessage(subject=data['subject'], body=data['body'], to=data['to'])
    email.send()

