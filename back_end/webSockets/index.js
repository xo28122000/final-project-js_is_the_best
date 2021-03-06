const WebSocket = require("ws");
const redis = require("redis");
const redisClient = redis.createClient({host: 'redis'});

const wss = new WebSocket.Server({ port: 5004 });

const broadcast = data => {
  const sendData = JSON.stringify(data);
  wss.clients.forEach(client => {
    client.send(sendData);
  });
};

redisClient.on("message", (channel, message) => {
  console.log(channel, message);
  switch (channel) {
    case "newInquiryMessage":
      broadcast({ type: "newInquiryMessage", inquiry: JSON.parse(message) });
      break;
    case "newListing":
      broadcast({ type: "newListing", listing: JSON.parse(message) });
      break;
    case "ImageProcessDone":
      broadcast({ type: "ImageProcessDone", listing: JSON.parse(message) });
      break;
    default:
      break;
  }
  // console.log("came here", message);
});

redisClient.subscribe(["newInquiryMessage", "newListing", "ImageProcessDone"]);

// wss.on("connection", ws => {
//   console.log("client connected");

//   ws.on("close", () => {
//     console.log("client disconnected");
//   });

//   ws.on("message", rawData => {
//     const data = JSON.parse(rawData);
//   });
// });
