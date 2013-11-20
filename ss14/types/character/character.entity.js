module.exports = function(character) { 

    character
        .on("viewed", function(data, sender, saw) {
            // Consider batching these?
            this.player.send("view", [saw]);
        })
        .on("emitPlayer", function(data, sender, event) {
            var args = Array.prototype.slice.call(arguments).splice(3);
            this.player.send.apply(this.player, [event].concat(args));
        })
        .on("onPlayer", function(data, sender, event, callbackEvent) {
            console.log("Binding player Event", event, callbackEvent);
            this.player.on(event, function(player) {
                var args = Array.prototype.slice.call(arguments).splice(1);
                this.emitTo.apply(this, [sender, callbackEvent].concat(args));
            }.bind(this));
        })
        .bind(function(data) {
            // need to abstract player out a bit more
            this.player = data.player; 
            
            this.player.send("view", this.data());
            this.emitTo("map", "view", true);
            // Create an editor
            this.editorId = this.id()+"-editor";
            this.state.create("editor", {id: this.editorId, character: this.id()});
            this.emitTo(this.editorId, "view");
            
            return this;
        });
    
    return character;
};