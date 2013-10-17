var MONAD = require("./monad");

// data = { entity: {}, state: {} }; 
var Entity = MONAD(function(monad, data) {
        monad.state = data.state;
        return data.entity;
    })
        .lift_value("namespace", function(data) {
            return data.namespace ? data.namespace + ":": "";
        })
        .lift("on", function(data, event, func) { 
            this.state.on(this.namespace()+event, this.bound(func));
        })
        .lift("trigger", function(data, event) {
            var args = arguments ? arguments.slice(2) : []; 
            this.state.trigger.apply(this.state, [this.namespace()+event].concat(args));
        });

module.exports = Entity;