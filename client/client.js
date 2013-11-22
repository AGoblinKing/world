var Game = {
        target: null,
        state: {},
        client: null,
        nodes: {},
    };

(function() {
    var lastTime = (new Date()).getTime();
    
    Game.client = io.connect(undefined, {reconnect: false});
    
    Game.create = function(data, target) {
        Game.state[data.id] = data;
        if(!Game.target) Game.target = document.body;
                
        var ugh = document.createElement("div");
        target = target ? target : Game.target;
        
        ugh.innerHTML = "<game-"+data.type+" uuid=\""+data.id+"\" />";  
        var obj = target.appendChild(ugh.children[0]);
        Game.nodes[data.id] = obj;
        
        return obj;
    };
    
    Game.destroy = function(data) {
        typeof data === "string" && (data = {id:data});
        
        // this should be moved to the three.js specific code.
        var threeCtx = Game.nodes[data.id].three;
        if(threeCtx) threeCtx.parent.remove(threeCtx);
        Game.nodes[data.id].remove();
        
        delete Game.nodes[data.id];
        delete Game.state[data.id];
    };
    
    Game.view = function(elements) {
        elements.length === undefined && (elements = [elements]);
        
        elements.forEach(function(data) {
            if(!Game.state[data.id]) {
                Game.create(data);
            } else {
                _.extend(Game.state[data.id], data);
            }
        });
    };
    Game.tickers = {};
    
    Game.tick = function tick() {
        var newTime = (new Date()).getTime(),
            delta = newTime - lastTime;
            
            Object.keys(Game.tickers).forEach(function(id) {
                Game.nodes[id].tick(delta); 
            });
        
        lastTime = newTime;
        requestAnimationFrame(tick);  
    };
    
    Game.client.on("view", function(elements) {
        Game.view(elements);
    });
    
    Game.client.on("destroy", function(elements) {
        elements.forEach(function(uuid) {
            Game.target.removeChild(document.body.querySelector("[uuid="+uuid+"]"));
        });
    });    
    
    Game.tick();
} ());
