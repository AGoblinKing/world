
module.exports = function(map) { 
    // name, attribute, default(also informs type)
    // maybe move this to data
    map.types = [{name: "wall", params: { color: 0xFFFFFF }}, {name: "floor", params:{}}];
    
    map
        .is("corporeal")
        .bind(function(data) {
            !data.map && (data.map = {});
            return this;
        })
        .on("create", function(data, sender, entity) {
            var entityId = this.state.create(entity);
            
            this.emitTo(entityId, "view", true);
        })
        .on("viewed", function(data, sender, entity) {
            data.map[entity.id] = entity;
            this.updateViewers();
        })
        .on("delete", function(data, sender, entity) {
            delete data.map[entity.x+":"+entity.z];  
        })
        .on("types", function(data, sender) {
            this.emitTo(sender, "types", this.types);
        })
        .onState("map", function(data, sender) {
            this.emitTo(sender, "map", this.data());
        });
    
    return map;
};