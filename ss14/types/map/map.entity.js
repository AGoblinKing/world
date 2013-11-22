
module.exports = function(map) { 
    // name, attribute, default(also informs type)
    // maybe move this to data
    map.types = [{name: "wall", params: { color: 0xFFFFFF }}, {name: "floor", params:{}}];
    
    var view = {};
    
    map
        .is("watchable")
        .bind(function(data) {
            !data.remove && (data.remove = []);
            !data.updates && (data.updates = []);
            // if map exists, go create all them.
            return this;
        })
        .on("add.me", function(data, sender) {
            this.emit("add", {id: sender});  
        })
        .on("add", function(data, sender, entity) {
            this.emitTo(entity.id, "watch", true);
        })
        .on("watch", function(data, sender) {
            var pdata = this.data();
            pdata.updates = Object.keys(view).map(function(key) {
               return view[key]; 
            });
            this.emitTo(sender, "watch.update", pdata, true);  
        })
        .on("watchers.update", function(data) {
            data.remove = [];
            data.updates = [];
        })
        .on("editor.create", function(data, sender, entity) {
            var entityId = this.state.create(entity);
            this.emitTo(entityId, "watch", true);
        })
        .on("watch.destroy", function(data, sender) {
            if(view[sender]) {
                delete view[sender];
                data.remove.push(sender);
                this.informWatchers();
            }
        })
        .on("watch.update", function(data, sender, entity) {
            view[entity.id] = entity;
            data.updates.push(entity);
            this.informWatchers();
        })
        .on("editor.delete", function(data, sender, entity) {
            Object.keys(view).forEach(function(key) {
                var realEntity = view[key];
                if(view[key].x === entity.x && view[key].z === entity.z) {
                    this.emitTo(realEntity.id, "destroy");
                }
            }.bind(this));
        })
        .on("types", function(data, sender) {
            this.emitTo(sender, "types", this.types);
        })
        .onState("map", function(data, sender) {
            this.emitTo(sender, "map", this.data());
        });
    
    return map;
};
