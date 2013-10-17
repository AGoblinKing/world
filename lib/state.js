var MONAD = require("./monad"),
    Type = require("./type"),
    EventEmitter = require("events").EventEmitter;

var typename = /\/([0-9a-zA-Z\.\_\-]*)\.entity\.js/;

// State Monad
var State = MONAD(function(monad, data) {
        var state = {
            data: data,
            entities: {},
            types: {},
            events: new EventEmitter()
        };
        
        state.events.setMaxListeners(0);
    
        data.types.forEach(function(type) {;
            state.types[typename.exec(type)[1]] = Type(type);
        });
    
        data.entities.forEach(function(entity) {
            var params = {entity: entity, state: monad};
            state.entities[entity.id] = state.types[entity.type](params);
        });
        console.log(state);
        return state;
    })
        .lift("on", function(state, event, callback) {
             state.events.on(event, this.bound(callback));
        });


module.exports = State;

