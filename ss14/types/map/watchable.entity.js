module.exports = function(watchable) {
    var viewers = {};

    return watchable
        .on("view", function(data, sender, persist) {
            if(persist) {
                viewers[sender] = true;
            }

            this.emitTo(sender, "watch.update", this.data());
        })
        .on("destroyed", function(data) {
            var pdata = this.data();
            Object.keys(viewers).forEach(function(key) {
                this.emitTo(key, "watch.destroy", pdata);
            }.bind(this));
        })
        .method("informWatchers", function(data) {
            //should really break up this data into updated... added... deleted..
            var pdata = this.data();
            Object.keys(viewers).forEach(function(key) {
                this.emitTo(key, "watch.update", pdata);
            }.bind(this));

            this.emit("watchers.update");
        });
}
