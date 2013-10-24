var remote,
    state = {};

(function() {
    var client = new SockJS("/remote");
    
    client.onopen = function() {};
    
    client.onmessage = function(e) {   
        var message = JSON.parse(e.data);
        
        switch(message.event) {
            case "view":
                var data = message.data;
                state[data.id] = data;
                document.body.innerHTML += "<game-"+data.type+" uuid=\""+data.id+"\" />";
                break;
        }
    };
    
    client.onclose = function() {};
    
    remote = {
        send: function(name, data) {
            client.send(JSON.stringify({name: name, data: data}));   
        }
    };
} ());