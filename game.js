var argv = require("optimist")
        .default("port", 8080)
        .default("game", "./game")
        .argv,
    http = require("http"),
    io = require("socket.io"),
    node_static = require("node-static"),
    path = require("path"),
    State = require("./lib/state"),
    Player = require("./lib/player"),
    glob = require("glob"),
    fs = require("fs");

// Load State
glob(argv.game + "/**/*.entity.js", function(err, types) {
    glob(argv.game + "/**/*.entity.html", function(err, components) {
        fs.readFile(argv.game + "/state.json", function(err, json) {
            var data = {
                entities: err ? [] : JSON.parse(json).entities,
                types: types ? types : [],
                state: argv.game + "/state.json",
                components: components ? components : []
            };

            ready(State(data));
        });
    });
}); 

// Start Server
function ready(state) {

    
    var static_game = new node_static.Server(path.join(__dirname, argv.game)),
        static_client = new node_static.Server(path.join(__dirname, "client"));
        
    var server = http.createServer();
    
    server.addListener('request', function(req, res) {
        static_client.serve(req, res, function(e) {
           if(e && e.status === 404) {
               static_game.serve(req, res, function(e) {
                    if(e && e.status === 404) {
                        var types = state.components();
                        
                        res.end(types.reduce(function(prev, component) {
                            var url = component.replace(argv.game, "");
                            return prev += "<link rel=\"import\" href=\""+url+"\">\r\n";
                        }, ""));
                    }
               });;
           } 
        });
    });
    
    var game = require("socket.io").listen(server, {log:false}),
        players = [];
    
    game.on("connection", function(conn) {
        if(conn) {
            players.push(
                Player({conn: conn, state: state}).join()
            );
        }
    });
    
    
    console.log("Listening on 0.0.0.0:", argv.port);
    server.listen(argv.port);
}
