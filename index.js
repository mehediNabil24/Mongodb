const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

// pass: lV2hLKk7WLASIv6x
// user: mehedinabil13

// const uri = "mongodb://localhost:27017"


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const uri = "mongodb+srv://mehedinabil13:lV2hLKk7WLASIv6x@cluster0.yitxt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";  // Connect the client to the server	(optional starting in v4.7)
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
    const database = client.db("UserDB");
    const userCollection = database.collection("users");

    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.get('/',(req,res)=>{
        res.send('simple card is running')
      })


      app.get('/users', async(req,res)=>{
        const cursor = userCollection.find()
        const result = await cursor.toArray();
        res.send(result);

      })

      app.get('/users/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id:new ObjectId(id)}
        const user = await userCollection.findOne(query)
        res.send(user)
      })

      

    app.post('/users',async(req,res)=>{
      const user= req.body;
      console.log('new user',user)
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.put('/users/:id', async(req,res)=>{
      const id = req.params.id;

      const user = req.body;

      console.log(id,user);
      const filter ={_id: new ObjectId(id)}
      const options ={upsert: true}
      const updateUser ={
        $set:{
          name: user.name,
          email: user.email
        }
      }
      const result = await userCollection.updateOne(filter, updateUser, options)
      res.send(result)
    })

    app.delete('/users/:id', async(req,res)=>{
      const id = req.params.id;
      console.log('please delete from database', id)
      const query ={_id: new ObjectId(id)}

      const result = await userCollection.deleteOne(query)
      res.send(result)
    })

    app.listen(port, ()=>{
        console.log(`simple crud is running ${port}`)
      });
   
    
  } 
  catch(err){
    console.log(err)
  };
  
  
  
}
run();








