const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); 

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:3000" })); 
app.use(express.json());

const logFilePath = path.join(__dirname, 'access_log.json');

if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, '');
}

app.post('/api/logAccess', (req, res) => {
  if (!req.body.file || !req.body.user) {
    return res.status(400).send("Missing file or user in request");
  }

  const logEntry = {
    file: req.body.file,
    user: req.body.user,
    timestamp: new Date().toISOString(),
  };

  console.log("Received log request:", logEntry);

  fs.appendFile(logFilePath, JSON.stringify(logEntry) + "\n", (err) => {
    if (err) {
      console.error("Error writing log:", err);
      return res.status(500).send("Error logging access");
    }
    res.send("Logged successfully");
  });
});
// API endpoint to fetch logs
app.get('/api/getLogs', (req, res) => {
    fs.readFile(logFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error("Error reading log file:", err);
        return res.status(500).send("Error retrieving logs");
      }
      const logs = data.trim().split("\n").map(line => JSON.parse(line)); // Convert logs into JSON array
      res.json(logs);
    });
  });
  
  
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
