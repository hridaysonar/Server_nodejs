const express = require('express');
const cors = require('cors');  
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8j2b4rj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const coffeeCollection = client.db("coffeeDB").collection("coffees");

    // POST route to add coffee
    app.get('/coffees',async(req,res)=>{
      // const cursor =coffeeCollection.find()
      // const result 
      const result = await coffeeCollection.find().toArray()
      res.send(result);
    })

    app.get('/coffees/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result =await coffeeCollection.findOne(query);
      res.send(result);
    })
    //  update 
    // app.put('/coffees/:id',async(req,res)=>{
    //   const id = req.params.id;
    //   const filter = {_id:new ObjectId(id)}
    //   const options ={upsert:true};
    //   const updatedcoffee = req.body;
    //   const updatedDoc ={
    //     $set: updatedcoffee
    //   }
    //   const result = await coffeeCollection.updateOne(filter,updatedDoc,options);
    //   res.send(result);
    // })
    // Update Coffee
app.put('/coffees/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updateData = req.body;

  try {
    const result = await coffeeCollection.updateOne(filter, { $set: updateData });

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Coffee updated successfully", modifiedCount: result.modifiedCount });
    } else {
      res.status(200).json({ message: "No changes made", modifiedCount: 0 });
    }

  } catch (error) {
    console.error("Error updating coffee:", error);
    res.status(500).json({ error: "Failed to update coffee" });
  }
});


      app.delete('/coffees/:id',async(req,res)=>{
        
        const id = req.params.id;
        const query = {_id:new ObjectId(id)}
        const result = await coffeeCollection.deleteOne(query);
        res.send(result);
      })
    app.post('/coffees', async (req, res) => {
      const newCoffee = req.body;
      console.log("Received Coffee Data:", newCoffee);
        // delet
    

      try {
        const result = await coffeeCollection.insertOne(newCoffee);
        res.status(201).json({ message: "Coffee added successfully", data: result });
      } catch (error) {
        console.error('Error inserting coffee:', error);
        res.status(500).json({ error: "Failed to add coffee" });
      }
    });

    console.log("Connected to MongoDB");
  } catch (err) {
    console.error('Connection error:', err);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});