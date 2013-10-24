// Global Login Scope

module.exports = function(login) {
    // Local Login Scope
    // Inheritance -> login.state.types.viewable(login)
    
    // Only put serializable data in data.    
    login
        .on("player:connect", function(data, player) {
            player.send("view", this.properties());
            
            player.once("login", function() {
                console.log(arguments);
            });
        });
    
    return login;
}