const http = require("http");
const PORT = 3000;

// Constants for response messages
const RESPONSE_MESSAGES = {
  SUCCESS: "Hello, World!",
  NOT_FOUND: "Page Not Found",
};

const sendResponse = (res, statusCode, message) => {
  res.writeHead(statusCode, { "Content-Type": "text/plain" });
  res.end(message);
};

// Create an HTTP server
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    // Respond with "Hello, World!" on root path
    sendResponse(res, 200, RESPONSE_MESSAGES.SUCCESS);
  } else {
    // Respond with "Page Not Found" for other paths
    sendResponse(res, 404, RESPONSE_MESSAGES.NOT_FOUND);
  }
});

// Start the server and listen on the specified port
server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
