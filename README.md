# Demo Orchestrator

It's a POC project to demonstrate a possibility of using sockets with microservices.

Right now the project consists of two part:
- [Orchestrator](https://github.com/demo-orchestrator/orchestrator)
- [Service](https://github.com/demo-orchestrator/service)

### Orchestrator description:
- used as a gateway for all incoming connection
- all clients connecting to it by using sockets, right now it's implemented by [Socket.IO](https://socket.io)
    - Right now clients can be of two types: GUI and Service
- It contains a simple [VueJS](https://vuejs.org/) based GUI to monitor all connected clients

### Service description:
- used to perform a single (atomic) task, and returns a response

### Workflow:
- Orchestrator receives an HTTP request
- It creates UUID v4 identifier and assigns it to request object
- Request being redirected to one or multiple connected services using sockets
- A deferred object being created with UUID key and stored
- When Orchestrator receive a response from one of the connected services it
find the deferred object by UUID
- The deferred object being resolved and the response returned to the client


>Of course, the initial connection to Orchestrator can be done using sockets too,
but not always it's possible, for example when we're using mobile clients.