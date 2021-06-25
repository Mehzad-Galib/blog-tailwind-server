const express = require("express");
const cors = require("cors");
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tqgoj.mongodb.net/blogs?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  console.log('db connected')
  const blogsCollection = client.db("blogs").collection("allBlogs");
  // perform actions on the collection object
  app.get("/blogs", (req, res) => {
    blogsCollection.find({}).toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.get('/singleBlog/:id', (req, res) => {
    blogsCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, result)=>{
      res.send(result[0]);
      
    })
  })

  // creating data and send it to database, show on home page
  app.post("/addBlog", (req, res) => {
    const newBlog = req.body;
    blogsCollection.insertOne(newBlog)
    .then(result=> {
      res.send(result.insertCount > 0)
    }) 
  });

  // deleting data from database and UI
  app.delete('/delete/:id', (req, res)=>{
    blogsCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then((err, result)=>{    
      // console.log(result || err); 
    })
  })  
});

app.get("/", (req, res) => {
  res.send("Database is Working");
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
