# Headstarter Track-A Project 2024

## Quick rundown

We have Body.jsx as the main of the landing page (path '/')

All the routings are located in App.jsx

index.css will contain main constrains for the whole website (font/width/dark/light mode/color variables)

App.jsx will contain the wrappers and all the reusable common styles (buttons/common margins patterns etc...)

# Getting started
1. First you would need to have docker desktop [downloaded](https://www.docker.com/products/docker-desktop/) and opened.

2. Set your .env file using the .env.sample with your own values

3. Run the below commands in the root working directory
    i. ```python -m venv .venv``` for python virtual environment

    ii. ```source .venv/bin/activate```  for Mac
        ```source .venv/Scripts/activate``` for Windows
        to activate the python virtual environment
    
    iii. ```docker compose up --build -d``` to build all the containers necessary for the application

4. To access the web app go to docker desktop and click on the 5173:80 port or [localhost](http://localhost:5173)

** Before closing out be sure to run ```docker-compose down``` to stop the docker containers

# Docker Commands
- ```docker compose up -d``` will build all the containers necessary for the application
- ```docker-compose down``` will stop the containers
- ```docker-compose down -v``` stops containers and removes the volume
- ```docker ps``` lists all the docker containers

https://vitejs.dev/