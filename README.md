# Nexus Config Server

API server for distributing deployment configuration across servers

The basic idea:
- Apps being deployed (eg. Docker containers) do not have configuration files in them.
They only have a token and a API url.
- Apps contact the server API and provide their key
- The server validates the key and checks for access grants
- The server responds with a list of configuration files in JSON that the application has been given access to

This current version:
- Uses SQLite
- Is not ready for production

__This is a work in progress__

## Requirements

- Node.js v0.10
- Grunt (`npm install -g grunt-cli`)
- Bower (`npm install -g bower`)

## Setup

First, check the configuration file in `/config`
After the application is configured, you can run the following commands to get the server running:

1.- Clone the git repository: `git clone git@github.com:eduard44/nexus.git`

2.- `cd nexus`

3.- Install Node.js dependencies: `npm install`

4.- Install Bower dependencies: `bower install` or `bower update`

5.- Build JS and SCSS files: `grunt build`

6.- Run the server: `node app --rebuild` or `node app` if the database is already created

Now, you can head to `http://localhost:5000` an login with user `root` and password `root`