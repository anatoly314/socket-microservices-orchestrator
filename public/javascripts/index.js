var app = new Vue({
    el: '#app',
    data: {
        connected: false,
        clients: []
    },
    created: function () {
        // `this` points to the vm instance
        const vueInstance = this;
        var socket = io('http://localhost:8080', {query: {
                type: 'GUI'
            }});
        socket.on('connect', function(){
            vueInstance.connected = true;
        });
        socket.on('updatedClientsList', function(clients){
            vueInstance.clients = clients;
            console.log("updatedClientsList", clients);
        });
        socket.on('disconnect', function(){
            console.log("disconnect");
            vueInstance.connected = false;
        });
    }
})