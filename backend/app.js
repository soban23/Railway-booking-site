
const cors = require('cors')
const express = require("express");
const sql = require("msnodesqlv8");
const connectionString = require("./config/connectdb");
const userRouter = require("./routes/tasks");
const app = express();
app.use(express.json()); 
app.use(cors());
const serverPort = 4000;

const testConnection = () => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error("Database connection failed:", err);
    } else {
      console.log("Connected to database successfully!");
      console.log(`Server is running at: http://localhost:${serverPort}`);
    }
  });
};

app.use("/api", userRouter);
app.get("/", (req, res) => {
  return res.send("Hello I am runing"); 
});

app.listen(serverPort, () => {
  testConnection();
});