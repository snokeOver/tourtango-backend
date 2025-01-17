import express, { response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

// Initialize the express app
const app = express();
dotenv.config();

const serverPort = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGOURL);

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // const result = await client.connect();
    // if (result.topology.client.topology.s.state === "connected") {
    //   console.log("MongoDB connection successful!");
    // }

    // tourist spot collection
    const tourSpotCollection = client.db("tourTangoDB").collection("tour-spot");

    // Country collection
    const countryCollection = client.db("tourTangoDB").collection("countries");

    // Cusomer collection
    const customerCollection = client.db("tourTangoDB").collection("customers");

    // how-we-help collection
    const howWeHelpCollection = client
      .db("tourTangoDB")
      .collection("how-we-help");

    // Tourist spot collection for login and register page slidder
    const tourSpotColForLogin = client
      .db("tourTangoDB")
      .collection("loginSliderImageUrl");

    // User Preference collection
    const userPreferenceCollection = client
      .db("tourTangoDB")
      .collection("user-preference");

    // add Tourist spots to db
    app.post("/api/spots/add", async (req, res) => {
      try {
        const result = await tourSpotCollection.insertOne(req.body);
        console.log(result);
        res.status(201).send({ message: "Tourist spot added successfully" });
      } catch (error) {
        console.error("Error adding Tourist spot:", error);
        res.status(500).send({ message: "Failed to add Tourist spot" });
      }
    });

    // Add user preference to db
    app.post("/api/user-preference", async (req, res) => {
      try {
        const existingPreference = await userPreferenceCollection.findOne({
          uid: req.body.uid,
        });
        if (existingPreference) {
          const query = { uid: req.body.uid };
          const updateData = req.body;
          const updatedResult = await userPreferenceCollection.updateOne(
            query,
            {
              $set: updateData,
            }
          );
          res.status(200).send(updatedResult);
        } else {
          const insertResult = await userPreferenceCollection.insertOne(
            req.body
          );
          res.send({ message: "Insert Success" });
        }
      } catch (error) {
        console.error("Error adding user preference:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Get user preference from db based on the uid
    app.get("/api/user-preference/:id", async (req, res) => {
      try {
        const result = await userPreferenceCollection.findOne({
          uid: req.params.id,
        });
        if (result) {
          res.send(result);
        } else {
          res.status(404).send({ message: "Tourist spot not found" });
        }
      } catch (error) {
        console.error("Error fetching Tourist spot:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Get all tourist spots from db
    app.get("/api/spots", async (req, res) => {
      try {
        const result = await tourSpotCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching Tourist spots:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Get all how-we-help data from db
    app.get("/api/how-we-help", async (req, res) => {
      try {
        const result = await howWeHelpCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching how-we-help collection:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Get all customer testimonials from db
    app.get("/api/customers", async (req, res) => {
      try {
        const result = await customerCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching Customer reviews:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Get all tourist spots from db for login and register page
    app.get("/api/spots/login", async (req, res) => {
      try {
        const result = await tourSpotColForLogin.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching Tourist spots for login page:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Get all country information from db for banner and country section
    app.get("/api/spots/country", async (req, res) => {
      try {
        const result = await countryCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching country collection:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Get one tourist spot from db based on the id
    app.get("/api/spot/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      try {
        const result = await tourSpotCollection.findOne(query);
        if (result) {
          res.send(result);
        } else {
          res.status(404).send({ message: "Tourist spot not found" });
        }
      } catch (error) {
        console.error("Error fetching Tourist spot:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Get User's Tourist spots from db filtered by UID
    app.get("/api/spots/:uid", async (req, res) => {
      try {
        const result = await tourSpotCollection
          .find({ uid: req.params.uid })
          .toArray();
        res.status(200).send(result);
      } catch (error) {
        console.error("Error fetching user's Tourist spots:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Delete Single Tourist spot from db filtered by id
    app.delete("/api/spot/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      try {
        const result = await tourSpotCollection.deleteOne(query);
        res.status(200).send(result);
      } catch (error) {
        console.error("Error deleting this Tourist spot:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Update Single Tourist spot from db filtered by id
    app.patch("/api/spot/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const updateData = req.body; // Assuming the request body contains the updated data
      try {
        const result = await tourSpotCollection.updateOne(query, {
          $set: updateData,
        });
        res.status(200).send(result);
      } catch (error) {
        console.error("Error updating this Tourist spot:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // End of the all API
  } catch (err) {
    console.log(err.message);
  }
}

run().catch(console.error);

// For testing the API
app.get("/", (req, res) => {
  res.send("Tour Tango is going on");
});

// Open the server port for listening
app.listen(serverPort, () => {
  console.log(`TourTango server is listening on port ${serverPort}`);
});
