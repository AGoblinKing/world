module.exports = function(floor) {

    floor
        .is("watchable")
        .bind(function(data) {
           data.color !== undefined && (data.color = 0xFFFFFF);
        });

    return floor;
};
