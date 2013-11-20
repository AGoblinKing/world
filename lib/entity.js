var MONAD = require("./monad"),
    _ = require("underscore");

var Entity = MONAD(function(monad, data) {
        monad.state = data.state;
        monad.listeners = [];
        return data.entity;
    })
        .lift_value("id", function(data) {
            return data.id; 
        })
        .lift_value("namespace", function(data) {
            return data.namespace ? data.namespace + ":": "";
        })
        .method("destroy", function(data) {
            this.emit("destroyed");
            
            this.listeners.forEach(function(listener) {
                this.state.off(listener.event, listener.callback);
            }.bind(this));
        })
        .method("sets", function(data, map) {
            Object.keys(map).forEach(function(key) {
              this.set(key, map[key]);
            }.bind(this));
        })
        .method("is", function(data, type) {
            this.state.mix(this, type);
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
        .method("method", function(data, name, func) {
            this[name] = this.bound(func);
        })

        // Emit Events
        .method("emit", function(data, event) {
            var args = Array.prototype.slice.call(arguments, 2);
            this.state.emit.apply(this.state, ["@"+this.id()+":"+event, this.id()].concat(args));
        })
        .method("emitTo", function(data, id, event) {
            var args = Array.prototype.slice.call(arguments, 3);
            console.log("calling", id, event);
            this.state.emit.apply(this.state, ["@"+id+":"+event, this.id()].concat(args));
        })
        .method("emitState", function(data, event) {
            var args = Array.prototype.slice.call(arguments, 2);
            this.state.emit.apply(this.state, [this.namespace()+event, this.id()].concat(args));
        })
        // On Listeners
        .method("on", function(data, event, func) { 
            console.log("listen", this.id()+":"+event);
            var listener = {
                event: "@"+this.id()+":"+event,
                callback: this.bound(func)
            };
            
            this.listeners.push(listener);
            this.state.on(listener.event, listener.callback);
        })
        .method("onOther", function(data, id, event, func) {
            var listener = {
                event: "@"+id+":"+event,
                callback: this.bound(func)
            };
            this.listeners.push(listener);
            this.state.on(listener.event, listener.callback);
        })
        .method("onState", function(data, event, func) { 
            var listener = {
                event: this.namespace()+event,
                callback: this.bound(func)
            };
            this.listeners.push(listener);
            
            this.state.on(listener.event, listener.callback);
        });
        

module.exports = Entity;