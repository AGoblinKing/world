var remote,
    state = {};

(function() {
    var client = new SockJS("/remote");
    
    client.onopen = function() {};
    
    client.onmessage = function(e) {   
        var message = JSON.parse(e.data);
        
        switch(message.event) {
            case "view":
                var elements = message.data;
                elements.forEach(function(data) {
                    if(!state[data.id]) {
                        state[data.id] = data;
                        document.body.innerHTML += "<game-"+data.type+" uuid=\""+data.id+"\" />";
                    } else {
                        _.extend(state[data.id], data);
                    }
                });
                break;
            case "destroy":
                var elements = message.data;
                elements.forEach(function(uuid) {
                    document.body.removeChild(document.body.querySelector("[uuid="+uuid+"]"));
                });
        }
    };
    
    client.onclose = function() {};
    
    remote = {
        send: function(name, data) {
            client.send(JSON.stringify({name: name, data: data}));   
        }
    };
} ());