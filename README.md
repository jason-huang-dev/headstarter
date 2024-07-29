# Headstarter Track-A Project 2024

## Quick rundown


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
- ```docker-compose exec backend python manage.py createsuperuser``` will ask for email and password
- when entering password it wont appear in terminal but it is taking the input, be sure to remember the password


https://vitejs.dev/