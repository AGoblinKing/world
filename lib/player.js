var MONAD = require("./monad"),
    EventEmitter = require("eventemitter2").EventEmitter2;



var Player = MONAD(function(monad, data) {
    monad.state = data.state;
    
    return data.conn;
})
    .method("on", function(conn, event, callback) {
        conn.on(event, this.bound(callback));
    })
    .method("clear", function(conn, listener) {
        conn.removeListener(listener);
    })
    .method("once", function(conn, event, callback) {
        conn.once(event, this.bound(callback));
    })
    .method("send", function(conn, event, data) {
        conn.emit(event, data);
    })
    .method("join", function(conn, namespace) {
        var ns = namespace ? namespace + ":" : "";
 
        this.state.emit(ns+"player:connect", undefined, this);
        
        conn.on("disconnect", function() {
            this.state.emit(ns+"player:disconnect", undefined,  this);
        }.bind(this));
    });

module.exports = Player;