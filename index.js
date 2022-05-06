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
    const inventoryItemsCollection = client .db("car-sale").collection("inventory-items")
   

    app.get('/inventoryItems/:id', async(req,res)=>{

        const id = req.params.id
        const query= {_id: ObjectId (id)}
        const inventoryItem = await inventoryItemsCollection.findOne(query)
        res.send(inventoryItem)
    })

    //post
    app.post('/inventoryItems', async (req, res)=>{

      const newItem =req.body;
      const result = await inventoryItemsCollection.insertOne(newItem)
      res.send(result);
    })
 
    // data load
    app.get('/inventoryItems', async (req, res) => {
      const query = {};
      const cursor = inventoryItemsCollection.find(query);
      const inventoryItems = await cursor.toArray();
      res.send(inventoryItems)
    });

    // stock items collections
    app.get('/inventoryItems'), async (req, res )=>{
      const email = req.query.email ;
      const query ={email:email}
      const cursor = inventoryItemsCollection.find(query)
      const  stockItem = await cursor.toArray()
      res.send(stockItem)

    }

    
    



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

    //Auth
    app.post('/login' ,  async (req,res)=>{
      const user =req.body
      const accessToken= jwt.sign(user, process.env.ACCESS_TOKEN_SEC, {

        expiresIn: '1d'
      });
      res.send(accessToken);
    })



  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("assignment project is running");
});

app.get("/hero", (req, res) => {
  res.send("assignment project is running");
});

app.listen(port, () => {
  console.log("assignmetn server work to port ", port);
})
