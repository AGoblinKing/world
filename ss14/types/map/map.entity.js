function generateMap() {
    var rawData = "\
**********************************\n\
* **************************** * *\n\
* * *  * * *  * * * * * ** * *  * \n\
* *  * * * *  * * **  ** * * ** * \n\
* * *  *  ** *  * * * * * ** **  *\n\
*  * * * *  ** ** **** ** *** ** *\n\
*  * * * *  ** * *** * * * * *** *\n\
**********************************",
        mapData = {};
    
    rawData.split("\n").forEach(function(row, y) {
        row.split("").forEach(function(char, x) {
            mapData[[x, y]] = char;
        });
    });
    
    return mapData;
}

module.exports = function(map) { 
    map
        .bind(function(data) {
            data.map = generateMap();
            
            return this;
        })
        .onState("map", function(data, sender) {
            this.emitTo(sender, "map", this.data());
        });
    
    return map;
};