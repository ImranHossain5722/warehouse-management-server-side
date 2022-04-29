const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.Port || 5000
const app = express ()
const { MongoClient, ServerApiVersion } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json())

// user name: carSaleUser password: dTHGlX2ejwjbzWUP

// mongodb database 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bvvu1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
  const collection = client.db("carSale").collection("product");
  console.log('mongo is connected ');
  // perform actions on the collection object
  client.close();
});



app.get ('/', (req,res)=>{

    res.send('assignment project is running')
})









app.listen(port,()=>{
    console.log('assignmetn server work to port ', port);
})