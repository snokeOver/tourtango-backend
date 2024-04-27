import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

// Initialize the express app
const app = express();
dotenv.config();

const serverPort = process.env.PORT || 5000;
const user = process.env.USER;
const pass = process.env.PASS;

// Middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${user}:${pass}@cluster0.urukmdc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const result = await client.connect();
    if (result.topology.client.topology.s.state === "connected") {
      console.log("MongoDB connection successful!");
    }
  } catch (err) {
    console.log(err.message);
  }
}

run().catch(console.error);

app.get("/", (req, res) => {
  res.send("Coffee server is running!");
});

app.listen(serverPort, () => {
  console.log(`Coffee server is listening on port ${serverPort}`);
});
