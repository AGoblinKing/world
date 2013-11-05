// Global Login Scope

module.exports = function(login) {
    // Local Login Scope
    // Inheritance -> login.state.types.viewable(login)
    
    // Only put serializable data in data.    
    login
        .on("player:connect", function(data, player) {
            player.send("view", [data]);
             
            player.once("login", function(ply, params) {
                // create character and log them in
                
                // TODO: add in type checking/error reporting for exposed player interfaces
                var character = this.state.create("character", {name: params.name});
                player.send("view", [character.data()]);
            });
        });
    
    return login;
};