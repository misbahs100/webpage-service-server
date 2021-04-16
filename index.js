const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('bson');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lqubf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express()
app.use(cors())
app.use(bodyParser.json())

client.connect(err => {
  const serviceCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION1}`);
  const adminCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION2}`);

  // create an admin
  app.post('/addAnAdmin', (req, res) => {
    const admin = req.body;
    console.log("admin: ",admin);
    adminCollection.insertOne(admin)
        .then(result => {
          console.log(result.insertedCount)
            res.send(result.insertedCount > 0);
        })
})

// create a service
app.post('/addService', (req, res) => {
  const service = req.body;
  console.log("admin: ",service);
  serviceCollection.insertOne(service)
      .then(result => {
        console.log(result.insertedCount)
          res.send(result.insertedCount > 0);
      })
})

 // read all services
 app.get('/services', (req, res) => {
  serviceCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
})

});


app.get('/', (req, res) => {
    res.send('Welcome to Webpage Service Database!')
  })
  
  const port = process.env.PORT || 5000;
  app.listen(port)