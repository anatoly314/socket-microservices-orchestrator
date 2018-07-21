const express = require('express');
const router = express.Router();
const requestCallbacksQueueProvider = require("../providers/request-callbacks-queue");
const socketServerApi = require("../socket-server-api");

/* GET */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/hello', function(req, res, next) {
    var promise = new Promise(function(resolve, reject) {
        let key = req.uuid4;
        let callbackObject = {
            resolve: resolve,
            reject: reject
        }

        requestCallbacksQueueProvider.addToQueue(key, callbackObject);
        socketServerApi.sendRequestToService(req);
    });

    promise.then(response => {
        res.json(response);
    }, next);
});


module.exports = router;
