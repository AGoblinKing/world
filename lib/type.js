var Entity = require("./entity");

var Type = function(typeFile) {
    var EntityType = require("../"+typeFile);
        
    return function(data) {
        return EntityType(Entity(data));
    }
};

module.exports = Type;