module.exports = function(ss14) { 
    ss14
        // things going over the event emitter cannot be objects w/ methods or methods, refactor
        .onState("player:connect", function(data, sender, player) {            
            // tell the player to instance a new SS14
            player.send("view", [this.data()]);
            
            player.on("ready", function() {
                ss14.emit("player:ready", player);
            });
        })
        .on("player:ready", function(data, sender, player) {
            console.log("hit?");
            ss14.state.create("character", {player: player});
        });
    
    return ss14;
};