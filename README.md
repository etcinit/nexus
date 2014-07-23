# Nexus Config Server

API server for distributing deployment configuration across servers

The basic idea:
- Apps being deployed (eg. Docker containers) do not have configuration files in them.
They only have a token and a API url.
- Apps contact the server API and provide their key
- The server validates the key and checks for access grants
- The server responds with a list of configuration files in JSON that the application has been given access to

__This is a work in progress__