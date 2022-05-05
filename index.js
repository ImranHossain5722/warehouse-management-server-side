const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware
app.use(cors());
app.use(express.json());

// user name: carSaleUser password: dTHGlX2ejwjbzWUP

// mongodb database

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bvvu1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const inventoryItemsCollection = client .db("car-sale").collection("inventory-items");
    const stockItemCollection = client.db("car-sale").collection("stock-items");
    
    // data load
      app.get("/inventoryItems", async (req, res) => {
      const query = {};
      const cursor = inventoryItemsCollection.find(query);
      const inventoryItems = await cursor.toArray();
      res.send(inventoryItems)
    });

    app.get('/inventoryItems/:id', async(req,res)=>{

        const id = req.params.id
        const query= {_id: ObjectId (id)}
        const inventoryItem = await inventoryItemsCollection.findOne(query)
        res.send(inventoryItem)
    })



    //post
    app.post('/inventoryItems', async (req, res)=>{
      const email =req.query.email ;
      const newItem =req.body;
      const result = await inventoryItemsCollection.insertOne(newItem)
      res.send(result);
    })

    // Update Inventory items 
    app.put('/inventoryItems/:id', async (req, res) =>{

      const id = req.params.id;
      const updateItem = req.body
      const filter = {_id: ObjectId(id)}
      const options = {upsert: true}

      const updateItemFieldsDoc = {

        $set:{
          quantity:updateItem.quantity ,
          price: updateItem.price,
          
        }
      }

      const result = await inventoryItemsCollection.updateOne(filter, updateItemFieldsDoc, options)

      res.send(result)


    })

    //Delete

    app.delete('/inventoryItems/:id', async(req, res)=>{
      const id = req.params.id;
      const  query = {_id: ObjectId(id)  };
      const result = await inventoryItemsCollection.deleteOne(query);
      res.send(result)

    });


    // stock items collection 

    app.get('/inventoryItems'), async (req, res )=>{

      const query = {}
      const cursor = inventoryItemsCollection.find(query)
      const  stockItem = await cursor.toArray();
      res.send(stockItem)


    }


  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("assignment project is running");
});

app.get("/hero", (req, res) => {
  res.send("heroku check ");
});

app.listen(port, () => {
  console.log("assignmetn server work to port ", port);
})
