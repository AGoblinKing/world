module.exports = function(character) { 

    character
        .on("map", function(data, sender, mapData) {
            this.player.send("view", [mapData]);
        })
        .bind(function(data) {
            this.player = data.player; 
            this.emitState("map");
            
            return this;
        })
    
    return character;
};