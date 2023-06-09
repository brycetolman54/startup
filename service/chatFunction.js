// Get the Websocket from the modules
const {WebSocketServer} = require('ws');

// This is the function that will deal with all that our websocket does
// It will take the server that we host all on and upgrade it
function chatFunction(httpServer) {
     
    // First we need to create a WebSocket object
    // We include noserver because we want it to work on the same http server that everything else is hosted on
    const wss = new WebSocketServer({noServer: true});

    // Now we upgrade the server we already have
    httpServer.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit('connection', ws, request);
        });
    });

    // Store all the connections of people with the server
    let connections = [];

    // This is what we can do when we are connected
    wss.on('connection', (ws, request) => {
        // Get the URL so we can get the user and thus set the connection right
        // the request.url gets the whole url, the split('?') splits it into before the ? and after, the [1] gets the after, the new URLSear... converts that string from the split into an object with what is before '=' as the identifier and what is after as the value
        const urlParam = new URLSearchParams(request.url.split('?')[1]);
        const user = urlParam.get('user');
        // Create the connection for this user with the server
        const connection = {id: user, alive: true, ws: ws};
        // Send out a message to everybody that you are here adn to yourself that everybody else is here
        connections.forEach((c) => {
            // To them
            c.ws.send(JSON.stringify({which: 'notification', status: 'on', who: user}));
            // To you
            connection.ws.send(JSON.stringify({which: 'notification', status: 'on', who: c.id}));
        });
        // Send yourself a message that everybody else is here
        // Push that connection into our array
        connections.push(connection);

        // We want to send a message to either a specific person or all people
        ws.on('message', (event)  => {
            // Get the data out of the thing  
            const msg = JSON.parse(event.toString());

            // If it's a message, send it to the one person
            if(msg.which === 'message') {
                const c = connections.find(obj => obj.id === msg.to);
                if(c) {
                    c.ws.send(JSON.stringify(msg));
                }
            }
            // If it is not, send the notification to all
            else if(msg.which === 'notification') {
                connections.forEach((c) => {
                    // We don't need to send it to ourselves
                    if(c.id !== connection.id) {
                        c.ws.send(event);
                    }
                });
            }
            // What if you have started a new chat
            else if(msg.which === 'startNew') {
                const c = connections.find(obj => obj.id === msg.to);
                if(c) {
                    c.ws.send(JSON.stringify(msg));
                }
            }
        });

        // We need to remove the user from the connections array when they close the connection
        // o is what we are looking for, i is the index of that
        ws.on('close', () => {
            // Send out a message that the person has left the chat
            connections.forEach((c) => {
                if(c.id !== connection.id) {
                    // To them
                    c.ws.send(JSON.stringify({which: 'notification', status: 'off', who: user}));
                }
            });
            connections.findIndex((o, i) => {
                if(o.id === connection.id) {
                    connections.splice(i, 1);
                    // This return makes the function stop 
                    return true;
                }
            });
        });

        // This will keep the connections alive when they receive a pong
        ws.on('pong', () => {
            connection.alive = true;
        });
    });

    // Make sure the connections are still good every 10 seconds
    setInterval(() => {
        connections.forEach((c) => {
            // Kill it if it is not active
            if(!c.alive) {
                c.ws.terminate();
            }
            // If it is active, set it as not active and send it a ping, it wil become active if a pong is received as above
            else {
                c.alive = false;
                c.ws.ping();
            }
        });
    }, 10000);
}   

module.exports = {chatFunction};