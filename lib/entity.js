var MONAD = require("./monad"),
    _ = require("underscore");

// data = { entity: {}, state: {} }; 
var Entity = MONAD(function(monad, data) {
        monad.state = data.state;
        return data.entity;
    })
        .lift_value("id", function(data) {
            return "@"+ data.id; 
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
        .method("save", function(data) {
            this.state.save(this.data());
        })
        .method("on", function(data, event, func) { 
            console.log("listen", this.id()+":"+event);
            this.state.on(this.id()+":"+event, this.bound(func));
        })
        .method("emit", function(data, event) {
            var args = Array.prototype.slice.call(arguments, 2);
            this.state.emit.apply(this.state, [this.id()+":"+event, this.id()].concat(args));
        })
        .method("emitTo", function(data, id, event) {
            var args = Array.prototype.slice.call(arguments, 3);
            console.log("calling", id, event);
            this.state.emit.apply(this.state, [id+":"+event, this.id()].concat(args));
        })
        .method("onState", function(data, event, func) { 
            this.state.on(this.namespace()+event, this.bound(func));
        })
        .method("emitState", function(data, event) {
            var args = Array.prototype.slice.call(arguments, 2);
            this.state.emit.apply(this.state, [this.namespace()+event, this.id()].concat(args));
        });

module.exports = Entity;