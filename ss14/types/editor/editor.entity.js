module.exports = function(editor) {

    //Expecting id and character id
    editor
        .is("watchable")
        .is("player-owned")
        .on("types", function(data, sender, types ) {
            data.types = types;
            this.emitPlayer("view", this.data());
        })
        .onPlayer("editor.delete", function(data, sender, entity) {
            this.emitTo("map", "editor.delete", entity);
        })
        .onPlayer("editor.create", function(data, sender, entity) {
            this.emitTo("map", "editor.create", entity);
        })
        .bind(function(data) {
            data.lookers = {};
            // lets let map send this data
            this.emitTo("map", "types");
        });

    return editor;
}
