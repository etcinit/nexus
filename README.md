# [Nexus](https://github.com/etcinit/nexus)

API server for distributing deployment configuration across servers

---

## About

The purpose of Nexus comes mainly from the need to setup a great number of
configuration files for an application running inside a Docker container.
It is a common practice to use environment variables to achieve this, but as
the number of settings to change grows this is not a viable option.

Nexus is a very simple key-value store, while keys are referred as Files they
can really contain any string you want. Each key can be attached to one or more
Applications.

In order for an application to be able to access it's configuration files, you
create an access token for it. Once you have a token, the only environment
variables you should need to pass to the application should be the token and
the host address of the Nexus server instance (assuming you are using a client
capable of reading environment variables).

### The basic idea:
- Apps being deployed (eg. Docker containers) do not have configuration files 
in them; They have a Nexus client and are provided with a token and a server
address.
- Apps use the client to contact the server API and provide their key
- The server validates the key and checks for access grants
- The server responds with a list of configuration files that the application 
has been given access to in a JSON format, which is generally trivial to parse.

### The current version:
- Uses SQLite and MySQL
- Has a pretty web interface
- Has a built-in editor for modifying configuration files from the browser
- Generally very stable, but untested on production environments

## Clients

Here are some client libraries built for Nexus:

- Node.js client library: 
[nexus-client-js](https://github.com/etcinit/nexus-client-js)

## Requirements

Launching an instance:

- Docker 1.3.0 or higher

Building from source:

- Node.js (v0.10.x or higher)
- Grunt (`npm install -g grunt-cli`)
- Bower (`npm install -g bower`)

## Environment Variables

While it is possible to setup Nexus using configuration files, it is easier to
leave the Docker image untouched and just pass everything through environment
variables:

### Database configuration:

- __DB_NAME__: Database name
- __DB_USERNAME__: Database username
- __DB_PASSWORD__: Database password
- __DB_HOST__: Database host
- __DB_PORT__: Database port
- __DB_DIALECT__: Database dialect (mysql or sqlite)

### Server configuration:

- __PORT__: Port the server should listen on (make sure to expose the right 
port), defaults to 5000
- __SESSION_SECRET__: Random stirng to use as a session secret

### Setup configuration:

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

## API Documentation

### `GET` /v1/

Displays version information and simple welcome message. No parameters are
required.

#### Sample response:

```js
{
    "status":"success",
    "messages":[
        "This is the Nexus Configuration Server API"
    ],
    "version":{
        "major":0,
        "minor":5,
        "revision":0
    }
}
```

### `GET` /v1/fetch

### `POST` /v1/ping

### `POST` /v1/logs

## License

Copyright (c) 2015 Eduardo Trujillo <ed@chromabits.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
