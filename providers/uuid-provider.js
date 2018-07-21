const uuidv4 = require('uuid/v4');


module.exports = {
    getUuid4 : function () {
        const uuid = uuidv4();
        return uuid;
    }
}