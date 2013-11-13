module.exports = function(editor) {
    
    editor
        // This seems super common and I should abstract this out
        .on("view", function(data, sender) {
            this.emitTo(sender, "viewed", this.data()); 
        })
        .bind(function(data) {
            // lets let map send this data?
            data.types = Object.keys(this.state.types());
        });

    return editor;
}