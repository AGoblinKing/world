module.exports = function(wall) {
    
    wall
        .is("corporeal")
        .bind(function(data) {
           data.color !== undefined && (data.color = 0xFFFFFF); 
        });
    
    return wall;
};