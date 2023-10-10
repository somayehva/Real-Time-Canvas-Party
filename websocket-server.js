// const WebSocket = require('ws');
// const http = require('http');
// let lastId;

// const assignClientId = function (lastId, clientsLength) {
//     let newId;
//     if (!clientsLength || clientsLength == 1) {
//         newId = 1;
//     } else if (clientsLength > 1) {
//         newId = lastId + 1;
//     }
//     return newId;
// }

// // Create an HTTP server
// const server = http.createServer((req, res) => {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.end('WebSocket server is running');
// });

// // Create a WebSocket server by passing the HTTP server
// const wss = new WebSocket.Server({ server });

// // app.use(express.static('public'))
// // wss.static()


// // WebSocket event handling
// wss.on('connection', (ws) => {
//     console.log('Client connected');
//     clientsLength = wss.clients.size;
//     lastId = assignClientId(lastId, clientsLength);;
//     ws.id = lastId;
//     wss.clients.forEach((client) => {
//         if (client !== ws && client.readyState === WebSocket.OPEN) {
//             client.send(JSON.stringify({ id: ws.id, eventType: 'connection' }));
//         }
//     });
//     // Handle incoming messages from clients
//     ws.on('message', (message) => {
//         wss.clients.forEach((client) => {
//             if (client !== ws && client.readyState === WebSocket.OPEN) {
//                 const ObjMessage = JSON.parse(message.toString());
//                 ObjMessage.id = ws.id;
//                 client.send(JSON.stringify(ObjMessage));
//             }
//         });
//     });
//     // Handle client disconnections
//     ws.on('close', () => {
//         console.log('Client disconnected', ws.id);
//         wss.clients.forEach((client) => {
//             if (client !== ws && client.readyState === WebSocket.OPEN) {
//                 client.send(JSON.stringify({ id: ws.id, eventType: 'disconnect' }));
//                 console.log(`{ id: ${ws.id}, eventType: 'disconnect' }`);
//             }
//         });
//     });
// });


// // Start the server on a specified port
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     console.log(`WebSocket server is running on port ${PORT}`);
// });






const WebSocket = require('ws');
const express = require('express');
const http = require('http');

let lastId;

const assignClientId = function (lastId, clientsLength) {
    let newId;
    if (!clientsLength || clientsLength == 1) {
        newId = 1;
    } else if (clientsLength > 1) {
        newId = lastId + 1;
    }
    return newId;
}

// Create an Express application
const app = express();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Create an HTTP server using Express app
const server = http.createServer(app);

// Create a WebSocket server by passing the HTTP server
const wss = new WebSocket.Server({ server });

// WebSocket event handling
wss.on('connection', (ws) => {
    console.log('Client connected');
    clientsLength = wss.clients.size;
    lastId = assignClientId(lastId, clientsLength);;
    ws.id = lastId;
    wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ id: ws.id, eventType: 'connection' }));
        }
    });
    // Handle incoming messages from clients
    ws.on('message', (message) => {
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                const ObjMessage = JSON.parse(message.toString());
                ObjMessage.id = ws.id;
                client.send(JSON.stringify(ObjMessage));
            }
        });
    });
    // Handle client disconnections
    ws.on('close', () => {
        console.log('Client disconnected', ws.id);
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ id: ws.id, eventType: 'disconnect' }));
                console.log(`{ id: ${ws.id}, eventType: 'disconnect' }`);
            }
        });
    });
});

// // WebSocket event handling
// wss.on('connection', (ws) => {
//     // Your WebSocket code remains unchanged
//     console.log('Client connected');
//     // ...
//     // ...
// });

// Start the server on a specified port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`WebSocket server is running on port ${PORT}`);
});
