module.exports = function(corporeal) {
    var viewers = {};
    
    return corporeal
        .on("view", function(data, sender, persist) {
            if(persist) { 
                viewers[sender] = true;
            }
            
            this.emitTo(sender, "viewed", this.data()); 
        })
        .method("updateViewers", function(data) {
            var pdata = this.data();
            Object.keys(viewers).forEach(function(key) {
                corporeal.emitTo(key, "viewed", pdata);
            }.bind(this));
        });
}