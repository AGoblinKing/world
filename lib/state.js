var MONAD = require("./monad"),
    Type = require("./type"),
    EventEmitter = require("eventemitter2").EventEmitter2,
    uuid = require("node-uuid");

var typename = /\/([0-9a-zA-Z\.\_\-]*)\.entity\.js/;

// State Monad
var State = MONAD(function(monad, data) {
    var state = {
        data: data,
        entities: {},
        types: {},
        typesCache: {},
        events: new EventEmitter({wildcard: true, delimiter: ".", maxListeners: 0})
    };
    
    data.types.forEach(function(type) {
        var typeDir = type.split("/");
            typeDir.pop();
            typeDir.shift();
            typeDir.shift();
        state.types[typename.exec(type)[1]] = Type(type);
        state.typesCache[typename.exec(type)[1]] = typeDir.join("/");
    });
    
    // Defer this until after state returns
    setTimeout(function() {
        data.entities.forEach(function(entity) {
            monad.create(entity);
        });
    }, 0);
    
    return state;
})
    .lift_value("create", function(state, type, data) {
        if(typeof type === "object") {
            data = type;
            type = data.type;
        } else {
            !data && (data = {});
            data.type = type;
        }
        return state.entities[data.id ? data.id : data.id = uuid.v1()] = state.types[data.type]({entity: data, state: this});
    })
    .method("on", function(state, event, callback) {
        state.events.on(event, callback);
    })
    .method("emit", function(state, event) {
        state.events.emit.apply(state.events, [event].concat( Array.prototype.slice.call(arguments, 2)));
    })
    .lift_value("types", function(state) {
       return state.typesCache; 
    });


module.exports = State;

