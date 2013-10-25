var MONAD = require("./monad"),
    EventEmitter = require("eventemitter2").EventEmitter2;



var Player = MONAD(function(monad, data) {
    monad.state = data.state;
    monad.events = new EventEmitter({maxListeners:0});
    
    data.conn.on("data", function(raw) {
        // client could send invalid json
        try {
            var data = JSON.parse(raw);
        } catch(exception) {
            console.log("Unable to parse json: " + raw);
        }
        
        if(data) monad.events.emit(data.name, data.data);
    });
    
    return data.conn;
})
    .method("on", function(conn, event, callback) {
        this.events.on(event, this.bound(callback));
    })
.method("clear", function(conn, listener) {
    this.events.removeListener(listener);
})
    .method("once", function(conn, event, callback) {
        this.events.once(event, this.bound(callback));
    })
    .method("send", function(conn, event, data) {
        conn.write(JSON.stringify({event: event, data: data}));
    })
    .method("join", function(conn, namespace) {
        var ns = namespace ? namespace + ":" : "";
 
        this.state.emit(ns+"player:connect", this);
        
        conn.on("close", function() {
            this.state.emit(ns+"player:disconnect", this);
        }.bind(this));
    });

module.exports = Player;