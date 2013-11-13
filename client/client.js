var Game = {
        target: null,
        state: {},
        remote: null
    };

(function() {
    window.client = io.connect(undefined, {reconnect: false});

    client.on("view", function(elements) {
        elements.forEach(function(data) {
            if(!Game.state[data.id]) {
                Game.state[data.id] = data;
                if(!Game.target) Game.target = document.body;
                var ugh = document.createElement("div");
                ugh.innerHTML = "<game-"+data.type+" uuid=\""+data.id+"\" />";
                Game.target.appendChild(ugh.children[0]);
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