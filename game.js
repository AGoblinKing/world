var argv = require("optimist")
        .default("port", 8080)
        .default("game", "./game")
        .argv,
    http = require("http"),
    sockjs = require("sockjs"),
    node_static = require("node-static"),
    path = require("path"),
    State = require("./lib/state"),
    Player = require("./lib/player"),
    glob = require("glob"),
    fs = require("fs");

// Load State
glob(argv.game + "/**/*.entity.js", function(err, files) {
    fs.readFile(argv.game + "/state.json", function(err, json) {
        var data = {
            entities: err ? [] : JSON.parse(json).entities,
            types: files ? files : []
        };
        
        ready(State(data));
    });
}); 

// Start Server
function ready(state) {
    var game = sockjs.createServer(), 
        players = [];
    
    game.on("connection", function(conn) {
        if(conn) {
            players.push(
                Player({conn: conn, state: state}).join()
            );
        }
    });
    
    var static_game = new node_static.Server(path.join(__dirname, "game")),
        static_client = new node_static.Server(path.join(__dirname, "client"));
        
    var server = http.createServer();
    
    server.addListener('request', function(req, res) {
        static_client.serve(req, res, function(e) {
           if(e && e.status === 404) {
               static_game.serve(req, res, function(e) {
                    var types = state.types(),
                        out = "";
                    Object.keys(types).forEach(function(key) {
                        out += "<link rel=\"import\" href=\""+types[key]+"/"+key+".html"+"\">"; 
                    });
                    res.end(out); 
               });;
           } 
        });
    });
    
    game.installHandlers(server, {prefix: "/remote"});
    
    console.log("Listening on 0.0.0.0:", argv.port);
    server.listen(argv.port);
}
