## capstone-project-3900-t14a-guiltydawgs

capstone-project-3900-t14a-guiltydawgs created by GitHub Classroom

# MongoDB Setup:
1. Create file called auth.py within flask-api directory
2. Fill in and save the following into a file named 'auth.py'
```
MONGODB_API_KEY = "<API_KEY>"
SECRET_KEY = "<SECRET>"
MAILGUN_API_KEY = "<API_KEY>"

NOTE: In the final submission, the auth.py file will be included for ease of use.
```
4. The .gitignore has been setup to not push this file.

# How to Run the Project (Tested on Lubuntu LTS 20.04.4)

Download and extract the project into the desired directory.

## Installing Dependencies

1. Navigate to the ```flask-api``` directory and execute:
```
pip3 install -r requirements.txt
```
If pip3 is not already installed, please install using ```sudo apt install python3-pip```

2. Navigate to the ```frontend``` directory and execute:
```
sudo apt install npm
```
```
sudo npm install -g n
```
```
sudo n stable
```
Restart the shell and check that your version of ```node``` is >= v16.14.2 with ```node --version``` and execute:
```
npm install
```

## Running the Project

Open two shells simultaneously, one for the backend and one for the frontend.

From the project root directory (ie. guiltydawgs/ ), execute in one shell:
```
cd flask-api/ source venv/bin/activate/ && python3 app.py
```
and in the other shell, execute:
```
cd frontend/ && npm start
```

# NOTE

Reset password only works for the ```comp3900t1@gmail.com``` user due to restrictions placed by MailGun themselves where recipients must be manually added in order to prevent spam. The Gmail credentials for this user will be provided in the final submission.
