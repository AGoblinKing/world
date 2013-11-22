module.exports = function(playerOwned) {
    return playerOwned
        .method("emitPlayer", function(data, event) {
            var args = Array.prototype.slice.call(arguments, 2);
            this.emitTo.apply(this, [data.player, "emitPlayer", event].concat(args));
        })
        .method("onPlayer", function(data, event, callback) {
            var callbackEvent = "player-" + event;

            this.on(callbackEvent, callback);
            this.emitTo(data.player, "onPlayer", event, callbackEvent);
        })
        .onPlayer("disconnect", function(data, sender) {
            console.log("player disconnect", this.id());
            this.destroy(); 
        });
};
