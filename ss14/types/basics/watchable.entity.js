module.exports = function(watchable) {
    var viewers = {};

    return watchable
        .on("watch.stop", function(data, sender) {
            delete viewers[sender];  
        })
        .on("watch", function(data, sender, persist) {
            if(persist) {
                viewers[sender] = true;
            }

            this.emitTo(sender, "watch.update", this.data());
        })
        // obedient suicide
        .on("destroy", function() {
            this.destroy();  
        })
        .on("destroyed", function(data) {
            Object.keys(viewers).forEach(function(key) {
                this.emitTo(key, "watch.destroy");
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
