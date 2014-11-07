# Nexus Config Server

API server for distributing deployment configuration across servers

The basic idea:
- Apps being deployed (eg. Docker containers) do not have configuration files in them.
They only have a token and a API url.
- Apps contact the server API and provide their key
- The server validates the key and checks for access grants
- The server responds with a list of configuration files in JSON that the application has been given access to

This current version:
- Uses SQLite and MySQL
- Is not recommended for production

__This is a work in progress__

## Clients

- Node.js client library: [nexus-client-js](https://github.com/eduard44/nexus-client-js)

## Requirements

- Node.js v0.10
- Grunt (`npm install -g grunt-cli`)
- Bower (`npm install -g bower`)

or 

- Docker

## Environment Variables

Database configuration:

- __DB_NAME__: Database name
- __DB_USERNAME__: Database username
- __DB_PASSWORD__: Database password
- __DB_HOST__: Database host
- __DB_DIALECT__: Database dialect (mysql or sqlite)

Server configuration:

- __PORT__: Port the server should listen on (make sure to expose the right port), defaults to 5000
- __SESSION_SECRET__: Random stirng to use as a session secret

Setup configuration:

- __MIGRATE__: Run migrations on startup
- __SETUP__: Create initial root user

## Setup from Docker

1.- Export any configuration environment variables mentioned above

2.- Run the image using Docker:
`docker run -e "MIGRATE=true" -e "SETUP=true" -p 5000:5000 eduard44/nexus`

3.- CTRL+C to interrupt the server

4.- Relaunch without migrations:
`docker run -p 5000:5000 eduard44/nexus`

Now, you can head to `http://localhost:5000` and login with user `root` and password `root`

## Setup from source

First, check the configuration file in `/config`
After the application is configured, you can run the following commands to get the server running:

1.- Clone the git repository: `git clone git@github.com:eduard44/nexus.git`

2.- `cd nexus`

3.- Install Node.js dependencies: `npm install`

4.- Install Bower dependencies: `bower install` or `bower update`

5.- Build JS and SCSS files: `grunt build`

6.- Run the server: `node app --rebuild` or `node app` if the database is already created

Now, you can head to `http://localhost:5000` and login with user `root` and password `root`