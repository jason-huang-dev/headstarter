# Headstarter Track-A Project 2024

## Quick rundown

<img width="706" alt="timemesh" src="https://github.com/user-attachments/assets/57c473d3-8cce-4c7e-8c2f-e655695207b7">

TimeMesh is a user-friendly calendar application to simplify scheduling and event management. TimeMesh was selected in the top 3 out of 60,000 engineers in the Headstarter Fellowship 2024; 500+ users on waitlist.

Features
- [X] Unified Calendar Management 🗓️: Keep track of work, study, and personal schedules with a clear separation between different calendar types.
- [X] Simplicity and Ease of Use ✨: Clean, intuitive interface that streamlines the scheduling process.
- [X] Real-Time Updates 🔔: Instant notifications and updates on events.
- [X] AI Support 🤖: AI capabilities for enhanced scheduling and organization.
- [X] Beta Traction 🚀: Over 500 users on our waitlist, 90+ calendars, and 100+ events created during beta testing.

## Project Setup and Dependencies

This is a Tailwind CSS, React, and Vite project. Follow the steps below to set up your development environment and install the necessary dependencies.

### Quick Setup Guide

#### Install Tailwind CSS and Related Packages

To set up Tailwind CSS and its related packages, run:

```bash
npm install -D tailwindcss postcss autoprefixer` 

### Install Routing and Icon Packages

For routing and icons, install:

npm install react-router-dom lucide-react

### Install Animation and Utility Packages

For animations and utility functions, install:

npm install react-just-parallax scroll-lock react-intersection-observer framer-motion

### Install Google OAuth

For Google OAuth authentication, install:

npm install @react-oauth/google

### Install Calendar for Dashboard
 npm install --save react-big-calendar
       
```

# Getting started
1. First you would need to have docker desktop [downloaded](https://www.docker.com/products/docker-desktop/) and opened.

2. Set your .env file using the .env.sample with your own values

3. Run the below commands in the root working directory

    i. ```python -m venv .venv``` for python virtual environment

    ii. ```source .venv/bin/activate```  for Mac

        ```source .venv/Scripts/activate``` for Windows

        to activate the python virtual environment
    
    iii. ```docker compose up --build -d``` to build all the containers necessary for the application

4. ```docker-compose exec backend python manage.py createsuperuser``` will create a admin account for the backend database 
    it will ask you for email and password, (please remember the email and password)
    *ONLY NEEDS TO BE DONE ONCE

5. To access the web app go to docker desktop and click on the 5173:80 port or [localhost](http://localhost:5173)


** Before closing out be sure to run ```docker-compose down``` to stop the docker containers

# Docker Commands
- ```docker compose up -d``` will build all the containers necessary for the application
- ```docker-compose down``` will stop the containers
- ```docker-compose down -v``` stops containers and removes the volume
- ```docker ps``` lists all the docker containers


# Creating Admin user
- ```docker-compose exec backend python manage.py makemigrations users```
- ```docker-compose exec backend python manage.py migrate```
- ```docker compose exec backend python manage.py createsuperuser``` will ask for email and password
- when entering password it wont appear in terminal but it is taking the input, be sure to remember the password

# Know Docker issues

"Error: Cannot find module @rollup/rollup-linux-arm64-gnu. npm has a bug related to optional dependencies (git repo url link). Please try npm i again after removing both package-lock.json and node_modules directory."

Fix:
1. Go into frontend/Dockerfile and change:
CMD [ "npm", "run", "dev" ] ------------> CMD [ "sleep", "infinity" ]

2. Go into docker desktop and obtain the screen attached to this message

3. Click the EXEC tab below 5173:5173 under the container info

4. Run ```ls``` after the # in the cml an make sure you have the same cml output as the attached image

5. If you see "node_modules" and "package-lock.json" remove these files by running 
```rm -rf node_modules```
```rm -rf package-lock.json```

6. The reinstall all ReactJS libaries and dependencies with
```npm i```

7. Click on 5173:5173 and make sure that the web app is not accessible and the react_frontend container is in the running state

8. In local terminal run ```docker-compose down``` and then ```docker-compose up -d --build```


https://vitejs.dev/
