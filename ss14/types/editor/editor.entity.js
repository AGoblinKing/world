module.exports = function(editor) {
    
    //Expecting id and character id
    editor
        // This seems super common and I should abstract this out
        .on("view", function(data, sender, persist) {
            if(persist) { 
                data.lookers[sender] = true;
            }
            this.emitTo(sender, "viewed", this.data()); 
        })
        // Seems common as well.
        .method("emitPlayer", function(data, event) {
            var args = Array.prototype.slice.call(arguments, 2);
            this.emitTo.apply(this, [data.character, "emitPlayer", event].concat(args)); 
        })
        .method("onPlayer", function(data, event, callback) {
            var callbackEvent = "player-" + event;
            
            this.on(callbackEvent, callback);
            this.emitTo(data.character, "onPlayer", event, callbackEvent);
        })
        .on("types", function(data, sender, types ) {
            data.types = types;
            this.emitPlayer("view", this.data());
        })
        .onPlayer("editor:delete", function(data, sender, entity) {
            this.emitTo("map", "delete", entity);
        })
        .onPlayer("editor:create", function(data, sender, entity) {
            this.emitTo("map", "create", entity);    
        })
        .bind(function(data) {
            data.lookers = {};
            // lets let map send this data
            this.emitTo("map", "types");
        });

    return editor;
}