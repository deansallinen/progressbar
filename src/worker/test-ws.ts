

// IMPORTANT: Replace with your actual API key from your .env file
const API_KEY = "deza@duck.com"; 
const url = `wss://cloud.jazz.tools/?key=${API_KEY}`;

console.log(`Attempting to connect to: ${url}`);

const ws = new WebSocket(url);

ws.addEventListener('open', function open() {
  console.log('✅✅✅ SUCCESS: WebSocket connection opened successfully!');
  ws.close();
});

ws.addEventListener('error', function error(err) {
  console.error('❌❌❌ FAILURE: WebSocket error:', err.message);
});

ws.addEventListener('close', function close() {
  console.log('Connection closed.');
});
