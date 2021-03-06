const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bvvu1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const inventoryItemsCollection = client.db("car-sale").collection("inventory-items");
    const blogsCollection = client.db("car-sale").collection("blogs");
      //single items by id 
    app.get("/inventoryItems/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const inventoryItem = await inventoryItemsCollection.findOne(query);
      res.send(inventoryItem);
    });

    //post
    app.post("/inventoryItems", async (req, res) => {
      const newItem = req.body;
      const result = await inventoryItemsCollection.insertOne(newItem);
      res.send(result);
    });

    // data load
    app.get("/inventoryItems", async (req, res) => {
      
      const page= parseInt(req.query.page);
      const size =  parseInt(req.query.size);
      const email = req.query.email
      const query = {}; 
      const cursor = inventoryItemsCollection.find(query);    
      let inventoryItems ;
      if( page || size ){

        inventoryItems = await cursor.skip(page*size).limit(size).toArray();
        
        
      }else{

        inventoryItems = await cursor.toArray();
      }
      res.send(inventoryItems);
    });

    // stock items collections
    // app.get("/inventoryItems"),async (req, res) => {
    //     const email = req.query.email
    //     const query = {email: email};
    //     const cursor = inventoryItemsCollection.find(query);
    //     const stockItem = await cursor.toArray();
    //     res.send(stockItem);
    //   };

    // Update Inventory items
    app.put("/inventoryItems/:id", async (req, res) => {
      const id = req.params.id;
      const updateItem = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };

      const updateItemFieldsDoc = {
        $set: {
          quantity: updateItem.quantity,
          price: updateItem.price,
        },
      };

      const result = await inventoryItemsCollection.updateOne(
        filter,
        updateItemFieldsDoc,
        options
      );

      res.send(result);
    });

    //Delete

    app.delete("/inventoryItems/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await inventoryItemsCollection.deleteOne(query);
      res.send(result);
    });

    //Auth
    app.post("/login", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SEC, {
        expiresIn: "1d",
      });
      res.send(accessToken);
    });

    //All blogs
    app.get("/blogs", async (req, res) => {
      const query = {};
      const cursor = blogsCollection.find(query);
      const blogs = await cursor.toArray();
      res.send(blogs);
    });

    // for 1 single blog
    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const blog = await blogsCollection.findOne(query);
      res.send(blog);
    });

    /// for pagination
    app.get("/inventoryImtesCount", async (req, res) => {
    
      const count = await inventoryItemsCollection.estimatedDocumentCount();
      res.send({ count });

    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("assignment project is running");
});




app.listen(port, () => {
  console.log("server work to port ", port);
});
