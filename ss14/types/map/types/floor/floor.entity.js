module.exports = function(floor) {
    
    floor
        .is("corporeal")
        .bind(function(data) {
           data.color !== undefined && (data.color = 0xFFFFFF); 
        });
    
    return floor;
};