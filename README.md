# Headstarter Track-A Project 2024

## Quick rundown

We have Body.jsx as the main of the landing page (path '/')

All the routings are located in App.jsx

index.css will contain main constrains for the whole website (font/width/dark/light mode/color variables)

App.jsx will contain the wrappers and all the reusable common styles (buttons/common margins patterns etc...)


# Getting started
1. First you would need to have docker desktop [downloaded](https://www.docker.com/products/docker-desktop/) and open.

## Docker Desktop
The eveything is containerized in these docker containers so that you will not need to worry about downloading dependencies.
You need to trust the third party application, and signing in is optional.

2. Set your .env file using the .env.sample with your own values

# Docker Commands
- ```docker compose up -d``` will build all the containers necessary for the application
- ```docker-compose down``` will stop the containers
- ```docker-compose down -v``` stops containers and removes the volume
- ```docker ps``` lists all the docker containers

https://vitejs.dev/