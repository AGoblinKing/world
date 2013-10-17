var MONAD = require("./monad");


var Player = MONAD(function(monad, data) {
    monad.state = data.state;

    return data.conn;
})
    .lift("on", function(conn, event, callback) {
        conn.on(event, this.bound(callback));
    })
    .lift("send", function(conn, event, data) {
        conn.send({event: event, data: data});
    })
    .lift("join", function(conn, namespace) {
        var ns = namespace ? namespace + ":" : "";
        
        this.state.trigger(ns+"player:connect", player);
        
        conn.on("close", function() {
            this.state.trigger(ns+"player:disconnect", player);
        }.bind(this);
    });

module.exports = Player;