var MONAD = require("./monad"),
    Entity = require("./entity"),
    EventEmitter = require("eventemitter2").EventEmitter2,
    fs = require("fs"),
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
        state.types[typename.exec(type)[1]] =  require("../"+type);
        state.typesCache[typename.exec(type)[1]] = typeDir.join("/");
    });
    
    // Defer this until after state returns
    setTimeout(function() {
        Object.keys(data.entities).forEach(function(id) {
            var target = data.entities[id];
            target.id = id;
            monad.create(target);
        });
    }, 0);
    
    return state;
})
    // Create an entity of {type} with {data}. Return the {id}.
    .lift_value("create", function(state, type, data) {
        if(typeof type === "object") {
            data = type;
            type = data.type;
        } else {
            !data && (data = {});
            data.type = type;
        }
        
        var entity = state.entities[data.id ? data.id : data.id = uuid.v4()] = state.types[data.type](Entity({entity: data, state: this}));
        entity.emit("created");
        return data.id;
    })
    .method("destroy", function(state, data) {
        typeof data === "string" && (data = {id: data});

        state.entities[data.id].emit("destroyed");
        delete state.entities[data.id];
    })
    .method("save", function(state, data) {
        state.data.entities[data.id] = data;
        //move reading/writing of state.json into this
        fs.writeFile(state.data.state, JSON.stringify(state.data.entities));
    })
    .method("on", function(state, event, callback) {
        state.events.on(event, callback);
    })
    .method("off", function(state, event, callback) {
        state.events.off(event, callback);       
    })
    .method("emit", function(state, event) {
        state.events.emit.apply(state.events, [event].concat( Array.prototype.slice.call(arguments, 2)));
    })
    .lift_value("mix", function(state, entity, type) {
        return state.types[type](entity);
    })
    .lift_value("types", function(state) {
       return state.typesCache; 
    })
    .lift_value("components", function(state) {
       return state.data.components;
    });


module.exports = State;

