const socket_io = require('socket.io');
const io = socket_io();
const socketServerApi = {};
const CLIENTS_TYPES = require("./enums/client-types");
const requestCallbacksQueueProvider = require("./providers/request-callbacks-queue");
const config = require("./config");

socketServerApi.io = io;


function _emitUpdateClientsListEvent(){
    let guiSockets = [];
    let clientSockets = io.sockets.clients();
    let connectedClients = Object.keys(clientSockets.connected).reduce((clientsArray, clientUid) => {
        let clientSocket = clientSockets.connected[clientUid];
        let handshake = clientSocket.handshake;
        let query = handshake.query;
        let clientAddress = handshake.address;
        let connectedAt = new Date(handshake.time);
        let type = query.type;
        let name = query.name;
        let clientObject = {
            id: clientUid,
            type: type,
            name: name,
            address : clientAddress,
            connectedAt: connectedAt
        }

        if(type === CLIENTS_TYPES.GUI){
            guiSockets.push(clientSocket);
        }

        clientsArray.push(clientObject);
        return clientsArray;
    }, []);

    guiSockets.forEach(guiSocket => {
        guiSocket.emit("updatedClientsList", connectedClients);
    })
}

function _resolveResponseCallback(response) {
    let key = response.uuid;
    let callbackObject = requestCallbacksQueueProvider.getFromQueueByKey(key);
    callbackObject.resolve(response);
}

function _bindEventsToConnectedSocket(socket){
    socket.on('disconnect', function() {
        console.log('Got disconnect!');
        _emitUpdateClientsListEvent();
    });

    let clientType = socket.handshake.query.type;
    if(clientType === CLIENTS_TYPES.SERVICE){
        socket.on("serviceResponse", function (response) {
            console.log("serviceResponse", response);
            _resolveResponseCallback(response);
        })
    }
}

io.on('connection', function (socket) {
    console.log('A user connected');
    _bindEventsToConnectedSocket(socket);
    _emitUpdateClientsListEvent();
});


socketServerApi.sendRequestToService = function (req) {
    let requestType = req.body.type;
    let requestBody = req.body;
    let uuid = req.uuid4;
    let serviceToUse = config.request_service_map[requestType];
    let clientSockets = io.sockets.clients();

    let requiredServices = Object.keys(clientSockets.connected).reduce((servicesArray, clientUid) => {
        let clientSocket = clientSockets.connected[clientUid];
        let handshake = clientSocket.handshake;
        let query = handshake.query;
        let type = query.type;
        let name = query.name;

        if(type === CLIENTS_TYPES.SERVICE && name === serviceToUse){
            servicesArray.push(clientSocket);
        }

        return servicesArray;
    }, []);

    if(requiredServices.length){
        let socket = requiredServices[0];
        socket.emit(requestType, {
            uuid: uuid,
            body: requestBody
        });
    }

}



module.exports = socketServerApi;