const http = require('http');
const { setupWebsocket } = require('./socket');

const app = require('./app');
const server = http.createServer(app);

// Setup WebSocket
setupWebsocket(server);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});