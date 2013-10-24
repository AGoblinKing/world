var MONAD = require("./monad");

// data = { entity: {}, state: {} }; 
var Entity = MONAD(function(monad, data) {
        monad.state = data.state;
        return data.entity;
    })
        .lift_value("namespace", function(data) {
            return data.namespace ? data.namespace + ":": "";
        })
        .lift_value("properties", function(data) {
            return data;  
        })
        .method("on", function(data, event, func) { 
            this.state.on(this.namespace()+event, this.bound(func));
        })
        .method("emit", function(data, event) {
            var args = arguments ? arguments.slice(2) : []; 
            this.state.emit.apply(this.state, [this.namespace()+event].concat(args));
        });

module.exports = Entity;