var Game = {
        target: null,
        state: {},
        remote: null
    };

(function() {
    var client = io.connect(undefined, {reconnect: false});

    client.on("view", function(elements) {
        elements.forEach(function(data) {
            if(!Game.state[data.id]) {
                Game.state[data.id] = data;
                if(!Game.target) Game.target = document.body;
                Game.target.innerHTML += "<game-"+data.type+" uuid=\""+data.id+"\" />";
            } else {
                _.extend(Game.state[data.id], data);
            }
        });
    });
    
    client.on("destroy", function(elements) {
        elements.forEach(function(uuid) {
            Game.target.removeChild(document.body.querySelector("[uuid="+uuid+"]"));
        });
    });    
    
    Game.remote = {
        send: function(name, data) {
            client.emit(name, data ? data : {}); 
        }
    };
} ());