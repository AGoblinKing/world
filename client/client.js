var client;

(function() {
    client = new SockJS("/remote");
    
    client.onopen = function() {};
    
    client.onmessage = function(e) {
        document.body.innerHTML += e.data + "<br/>";
    };
    
    client.onclose = function() {};
    
} ());