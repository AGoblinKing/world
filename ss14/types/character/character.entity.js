var _ = require("underscore");

module.exports = function(character) { 

    character
        .is("watchable")
        .call(function(data) {
            // need to abstract player out a bit more
            this.player = data.player;
            data.player = this.id();  
        })
        
        .on("watch.update", function(data, sender, saw) {
            // Consider batching these?
            this.player.send("view", [saw]);
        })
        .on("emitPlayer", function(data, sender, event) {
            var args = Array.prototype.slice.call(arguments).splice(3);
            this.player.send.apply(this.player, [event].concat(args));
        })
        .on("onPlayer", function(data, sender, event, callbackEvent) {
            //console.log("Binding player Event", event, callbackEvent);
            this.player.on(event, function(player) {
                var args = Array.prototype.slice.call(arguments).splice(1);
                this.emitTo.apply(this, [sender, callbackEvent].concat(args));
            }.bind(this));
        })
        .is("player-owned")
        .bind(function(data) {
            data.url = "lady.png";
            
            var pdata = this.data();
            pdata.self = true;
            
            this.player.send("view", pdata);
            // Create an editor
            this.editorId = this.id()+"-editor";
            this.state.create("editor", {id: this.editorId, player: this.id()});
            this.emitTo(this.editorId, "view");
            
            
            // watch the map
            this.emitTo("map", "add.me");
            this.emitTo("map", "watch", true);
            
            return this;
        })
        .onPlayer("character.update", function(data, sender, entity) {
            _.extend(data, entity);
            this.informWatchers();
        });
    
    return character;
};
