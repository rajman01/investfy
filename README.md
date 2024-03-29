# Investfy

## About:
Investfy is a financial tech application built with Django Rest Framework (backend) and React Js (frontend) which supports some of financial tech features like E-Wallet, Investments, Saving and making payments. This application is mainly for Nigeria because of the Bank Verification Number (BVN) which the application will need to verify your account and get your real data.  
NB: This application does not deal with real money yet, and only deals with dummy money to make all its transaction, but all its verification process are real and valid. They would be some sort of external api like paystack, flutterwave e.t.c to make real money transactions.  

This project is totaly different from all the other projects in cs50 web programming with python and javascript course and no part of this project got its content from the other projects. its complexity level is also higher then the other projects taken in this course. 

This appication offers some unique features out of the box:
- Fast and secure way to transfer  money from one E-Wallet to another.
- Saving has never been more easy with investfy varities of savings account with varities of  features which is easy and secure to use.  
- With investfy Investment program, users can now easily apply for investments and invest in other investment with assured profit.

## what is inside this project ?
There are quite a number of apps(folders) and files inside this project, so i'm going to list them and explain what is inside and what each app does.  

- ### user app:  
    This is a django app that takes care of authentications and anything that deals with the user like changing of password, email verification, BVN verification e.t.c  

- ### wallet app:
    Also a django app that deals maily  with the wallet model, its takes care of setting up your wallet, wallet transaction, just anything that has to do with the E-Wallet feature.  

- ### savings app:
    This is a lengthy one, this comprises of all the savings features i.e Quicksave, Jointsave, Targetsave and Joint Targetsave. It takes care of all the transactions performed and soo many other things that these features require.  

- ### payment app:  
    The payment app takes care of cash going out of Your wallet to bank account.  
    NB: Note that its not real money and you will not recieve any alert or cash in your bank account.   

- ### investment app:  
    The deals mainly with investment, where users can apply for investments and invest in other peoples investments.  

- ### frontend app:  
    This contains all the static files, templates and the main.js, the compiled javascript file used for the frontend.  
    NB: This is also a django app not just a regular folder.  

- ### investfy: 
    This is the main project folder that deals with how the application runs. There is an additional celery.py files with makes asynchronous and scheduled tasks possible to run. with celery, we can make asynchronous and scheduled tasks possible, these are some of the requirements some features of the app requires.

- ### requirements.txt:
    contains all the python modules needed to run this application.

- ### package.json:
    This holds various metadata relevant to this project. it handles the project dependencies(node packages).

- ### webpack.config.js: 
    Contains configuration related to the project frontend(react) build.

- ### .babelrc:
    Also contains configurations related to the project.  

## Features:  
Here are the features this application offers.  

- ### E-Wallet:
    The E-Wallet is like the money bank of the application, all transactions in this application are related to the E-Wallet.  
    The E-Wallet support few features which are:  
    1. #### Funding of wallet:
        Users are able to  fund their E-wallet with any amount they wish.  
        NB: Note that this does not deal with real cash. Normaly, this would be connected to an external API like flutterwave e.t.c to make real life transactions.
    2. #### Transfer cash to other wallets:
        Users are able to send cash to another user's wallet by providing the beneficiary's wallet-id.  

- ### Quick Save:
    The Quick Save account is created imidiately a user registers. A user can only have one quick save accoount.  
    Features of the quick save account includes:  
    1. #### Auto Save faeture:
        The Quick save account supports the autosave feature in which users can switch it on by providing the day-interval and the amount to save every day-interval provided. When the autosave feature is on, the server will save the given amount every day-interval provided with the help of celery that gives the server the ability to perform scheduled tasks.  
    2. #### Save To Quick Save:
        Users can save to investfy through their quick save account. The money users are saving to investfy through any savings account comes from their respective E-wallet.  

    3. #### Withdraw from Quick Save:
        users can withdraw the total amount they have saved in their quick save account to their respective E-Wallet.  

- ### JointSave:
    Users can create multiple joint save accounts in which they have to invite at least two members when creating a joint save accont and set an amount to contribute every week. Invitation links are sent to the invited members in which they can accept the invitation or just ignore it. Every member is to contribute a particular amount every week then and a random member recieves the total amount at the end of the month. This cycle continues every month until every member has recieved its total amount, Then an email is sent to the admin to reactivate the jointsave if the admin wishes. If a member does not make its weekly contribution, the server transfer the amount from the member's wallet to the jointsave account at the end of the week.  
    Features of a joint save account includes:

    1. #### Save to Joint Save:
        Users are able to save the specified jointsave amount every week, failure to do so, the server will make that transaction at the end of the week.  
        NB: Users can only save to a jointsave account once a week.
    2. #### Disband Joint Save:
        Only Admin(owner of the joint save account) can disband a jointsave account. Disbanding of a joint save account can only be done during the first month of the jointsave account and all members will be refunded.

    3. #### Inviting New Mebers: 
        After the creation of the joint save account, admins still have the grace of one week to invite new members to the joint save account. Invitation links will be sent to the new members.

    4. #### Leaving Joint Save:
        Any member in a joint save account has the grace of one month after the creation of the joint save to leave the joint save.
        The member will be refunded.  

- ### Target Save:
    Just like the joint save account, users can also craete multiple target save account. craete a target save account is just like setting a goal and reaching that goal. When creating a target save account, you need to set the targeted amount and the user will save to reach that target.  
    Features of target save accounts include: 

    1. #### Save To Taget save:  
        Users are able to save desired amount to investfy through target save.

    2. #### Withdraw Target save balance:
        users are able to withdraw the progress in a targetsave account only when they have saved up to 0.5% of the targeted amount.
        The money is transfered to the user's E-wallet.
    3. #### Autosave:
        Just like the quick save autosave feature, targetsave also supports autosave feature.
    4. #### Delete targetsave:
        users are able to delete there targetsave accounts if they are no longer intrested in saving. They will be refunded all the amount they have saved through that target save account.

- ### Joint Target Save:
    This is just like the Joint version of target save. Where many users can save together to achieve a certain goal.  
    unlike the joint save where invited members are sent invitation links, invited members are added imidiately a Joint Taget Save is created.
    Features of a joint target save account includes.

    1. #### Save to Joint Target Save:
        Members of a joint target save can save any amount at any time.

    2. #### Withdraw from Joint Target Save:
        The admin of a joint target save can withdraw the progress only if it has reached at least 0.5% of the targeted save.
    3. #### Invite New Mebers: 
        After a joint target save is created, the admin can invite new members at any time.
        Invited members are added immidiately.

    4. #### Leave Joint Target Save:
        Any member of a joint target save can leave at any time. A member will not be refunded of the amount the member has saved to the account.
        If an admin shoud leave, the admin position will be asigned to another member in the joint target save.

    5. #### Delete Joint Trget Save:
        Admin can only delete a joint target save only when the progress of the joint target save is less than 0.25 of the targeted amount. Members will be refunded if a joint target save is deleted.  

-  ### Investments:
    Users are able to apply for Investment program provided they must give very detailed and convincing description on why they need the investment program and other needed fields. When an investment is created, The investment is not yet approved, only the admin or organisers of investfy can approve investments. Only approved investments are available for investing.
    Features of investment.

    1. #### Apply for Investment Progeram:
        Users are able to apply for investment program by providing details about the investment the user is applying for.

    2. #### Invest in an  Investment:
        Users can invest in an investment program by buying any amount of units available in the investment program.

    3. #### Withdram from Investment:
        Owners of investment can withdraw the amount available their investment program(i.e money investors have invested in the program).

    4. #### Investment Yearly Round up:
        At the end of every year investment program, investors will recieve their profits from the investments which will be provided by the owner of the investment. 

- ### Payments:
    Users can make payments to external bank accounts.  
    Nb: note that this payments are not real and the user will not recieve any money.  
    Features include:

    1. #### Making Payments:
        Users can transfer money from their E-wallets to real bank accounts.

    2. #### Adding Bank Accounts:
        Users can save beneficiaries so when next making payment to that account, the user doesn't have to put the full details of the beneficiary.

- ### Other features includes:
    1. Users can edit details of there account e.g, username, phone_number, email e.t.c. When a account is verified with bvn, the user will not be able to edit some detais.

    2. Users will need to verify their email account and BVN befor they can access some features on the application.

    3. Users can Change there account and wallet passwords.

    4. users can also add and delete beneficiarys bank accounts.

## How To Run The Application
1. #### Install Python:  
    Make sure python and pip are installed on your machine. pip comes with the latest versions of python released nowadays. If not, you can visit the [python website](https://www.python.org/) to download python on your machine.

2. #### Install python packages:  
    Open a terminal and change your directory to the application root forlder and run 'pip install -r requirements.txt' 

3. #### Make migrations: 
    Also from the root folder, run 'python manage.py migrate' to make migrations.

4. #### Add List of Banks:
    From the root folder, run 'python add_banks.py' to add the list of banks to the database.

5. #### Set up envirenment variables:
    Firsty, create a .env file in the root folder.
    There is a .env.example file in the root folder which holds the type of variables that wil be set in the .env file.  

    Secondly, set up your EMAIL and PASSWORD which will be used to by the app to send emails.  

    Thirdly, go to [Flutterwave](https://flutterwave.com),  
    create an account,  
    you are to login into your dashboard. Make sure your accout is in live mode,  
    open your settings tab, 
    move to the api section then copy the secret key and public key. 

    In your .env file, paste both keys in their respective variables.

    Lastly, for the CELERY_BROKER_URL you can set up redis on [Heroku](https://heroku.com) by create an app on heroku, go to addons, search for Heroku Redis, click provision, it might take a while to set up, after setting up, click on the redis and view credentials. Copy the URI and paste it in the .env file.

6. #### Set Up Celery Worker:
    Open a new terminal, if you installed all python packages in a virtual environment, dont forget to connect to the virtual environment when opeing a new terminal.

    cd into the application root folder, 
    run 'celery -A investfy worker -l info'

7. #### Set Up Celery beat:
    Open a new terminal, cd into the application root directory, run 'celery -A investfy beat -l info'.

8. #### Run Server: 
    Open a new terminal, cd into the application root directory, run 'python manage.py runserver', opern your browser and go to [localhost:8000](http://localhost:8000).
    The application should be running live.
