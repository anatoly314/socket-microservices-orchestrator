const uuidProvider = require("../providers/uuid-provider");
let apiMiddleware = {};

apiMiddleware.uuid4 = function(req, res, next){
    let uuid4 = uuidProvider.getUuid4();
    req.uuid4 = uuid4;
    return next();
}

module.exports = apiMiddleware;