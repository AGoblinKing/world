
module.exports = function(map) { 
    // name, attribute, default(also informs type)
    map.types = {"wall": { color: "white" } };
    
    
    map.bind(function(data) {
        !data.map && (data.map = {});
        
        return this;
    })
    .on("types", function(data, sender) {
        this.emitTo(sender, "types", this.types);
    })
    .onState("map", function(data, sender) {
        this.emitTo(sender, "map", this.data());
    });
    
    return map;
};