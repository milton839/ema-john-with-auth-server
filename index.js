const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cf5ms.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const port = 5000

const app = express()
app.use(bodyParser.json());
app.use(cors())



client.connect(err => {
  const productsCollection = client.db(`${process.env.DB_Name}`).collection("products");
  const ordersCollection = client.db(`${process.env.DB_Name}`).collection("orders");
  
  app.post('/addProduct/', (req, res) => {
    const products = req.body;
    productsCollection.insertOne(products)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })

  app.get('/products',(req, res) => {
      productsCollection.find({})
      .toArray((err, documents) => {
          res.send(documents)
      })
  })

  app.get('/singleProduct/:key',(req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err, documents) => {
        res.send(documents[0])
    })
  })

  app.post('/manyProductsByKeys',(req, res) => {
    const productKeys = req.body;
    productsCollection.find({key:{$in:productKeys}})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.post('/addOrder/', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })

});


app.listen(port)