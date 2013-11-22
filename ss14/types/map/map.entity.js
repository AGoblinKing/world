
module.exports = function(map) { 
    // name, attribute, default(also informs type)
    // maybe move this to data
    map.types = [{name: "wall", params: { color: 0xFFFFFF }}, {name: "floor", params:{}}];
    
    map
        .is("watchable")
        .bind(function(data) {
            !data.map && (data.map = {});
            !data.add && (data.add = []);
            !data.remove && (data.remove = []);
            // if map exists, go create all them.
            return this;
        })
        .on("watchers.update", function(data) {
            data.add = [];
            data.remove = [];
        })
        .on("editor.create", function(data, sender, entity) {
            var entityId = this.state.create(entity);
            data.add.push(entityId);
            this.emitTo(entityId, "view", true);
        })
        .on("watch.destroy", function(data, sender, entity) {
            if(data.map[entity.id]) {
                delete data.map[entity.id];
                data.remove.push(entity.id);
                this.informWatchers();
            }
        })
        .on("watch.update", function(data, sender, entity) {
            data.map[entity.id] = entity;
            this.informWatchers();
        })
        .on("editor.delete", function(data, sender, entity) {
            Object.keys(data.map).forEach(function(key) {
                var realEntity = data.map[key];
                if(data.map[key].x == entity.x && data.map[key].z == entity.z) {
                    this.state.destroy(realEntity);
                    delete data.map[key];
                    data.remove.push(realEntity.id);
                    this.informWatchers();
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
