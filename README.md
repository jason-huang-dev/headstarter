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