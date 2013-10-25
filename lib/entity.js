var MONAD = require("./monad"),
    _ = require("underscore");

// data = { entity: {}, state: {} }; 
var Entity = MONAD(function(monad, data) {
        monad.state = data.state;
        return data.entity;
    })
        .lift_value("namespace", function(data) {
            return data.namespace ? data.namespace + ":": "";
        })
        .method("sets", function(data, map) {
          Object.keys(map).forEach(function(key) {
              this.set(key, map[key]);
          }.bind(this));
        })
        .method("set", function(data, namespace, properties) {
            if(typeof namespace === "object") {
                properties = namespace;
                namespace = "";
            }
                
            _.extend(namespace.split(".").reduce(function(cv, ns) {
                var target = ns && ns !== "" ? cv[ns] : cv;
                !target && (target = {});
                
                return target;
            }, data), properties);
        })
        .lift_value("data", function(data) {
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