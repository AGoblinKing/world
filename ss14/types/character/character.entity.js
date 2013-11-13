module.exports = function(character) { 

    character
        .on("viewed", function(data, sender, saw) {
            // Consider batching these?
            this.player.send("view", [saw]);
        })
        .on("map", function(data, sender, mapData) {
            this.player.send("view", [mapData, this.data()]);
        })
        .bind(function(data) {
            // this == character, I wonder which is the better form
            this.player = data.player; 
            this.emitState("map");
            
            // Create an editor and look at it
            this.editorId = this.id()+"-editor";
            character.state.create("editor", {id: this.editorId});
            character.emitTo("@"+this.editorId, "view");
            
            return this;
        });
    
    return character;
};