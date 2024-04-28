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

    const tourSpotCollection = client.db("tourTangoDB").collection("tour-spot");

    // add tour spots to db
    app.post("/api/spots/add", async (req, res) => {
      try {
        const result = await tourSpotCollection.insertOne(req.body);
        console.log(result);
        res.status(201).send({ message: "Tour spot added successfully" });
      } catch (error) {
        console.error("Error adding tour spot:", error);
        res.status(500).send({ message: "Failed to add tour spot" });
      }
    });

    // Get all tour spots from db
    app.get("/api/spots", async (req, res) => {
      const result = await tourSpotCollection.find().toArray();
      res.send(result);
    });

    // Get User's tour spots from db filtered by UID
    app.get("/api/spots/:uid", async (req, res) => {
      try {
        const result = await tourSpotCollection
          .find({ uid: req.params.uid })
          .toArray();
        res.status(200).send(result);
      } catch (error) {
        console.error("Error fetching user's tour spots:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Delete Single tour spot from db filtered by id
    app.delete("/api/spot/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      try {
        const result = await tourSpotCollection.deleteOne(query);
        res.status(200).send(result);
      } catch (error) {
        console.error("Error deleting this tour spot:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Update Single tour spot from db filtered by id
    app.patch("/api/spot/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const updateData = req.body; // Assuming the request body contains the updated data
      try {
        const result = await tourSpotCollection.updateOne(query, {
          $set: updateData,
        });
        res.status(200).send(result);
      } catch (error) {
        console.error("Error updating this tour spot:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // End of the all API
  } catch (err) {
    console.log(err.message);
  }
}

run().catch(console.error);

app.get("/", (req, res) => {
  res.send("TourTango server is running!");
});

app.listen(serverPort, () => {
  console.log(`TourTango server is listening on port ${serverPort}`);
});
