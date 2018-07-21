const queue = {};

const requestCallbacksQueueProvider = {

    addToQueue : function (key, callbackObject) {
        queue[key] = callbackObject;
    },
    
    getFromQueueByKey : function (key) {
        let callbackObject = queue[key];
        return callbackObject;
    }

}

module.exports = requestCallbacksQueueProvider;