const express =require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express();
const port=3000;

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

//midleware
app.use(cors());
app.use(express.json())

const uri = "mongodb+srv://smartdbUser:k9ZTrTLYMEC5UAkJ@cluster0.es0wofs.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


app.get('/',(req,res)=>{
    res.send('Smart server is running')
})

async function run() {
  try {
    await client.connect();
    const myDB = client.db("myDB");
    const productscollection = myDB.collection("products");

    app.post('/products',async(req,res)=>{
        const newProduct=req.body;
        const result=await productscollection.insertOne(newProduct);
        res.send(result)
    })

    app.get('/products',async(req,res)=>{
       const cursor = productscollection.find({});
       const result = await cursor.toArray();
       res.send(result)

    })

    app.get('/products/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await productscollection.findOne(query);
      res.send(result)
    })

    app.patch('/products/:id',async(req,res)=>{
      const id=req.params.id;
      const updatedProduct=req.body;
      const query={_id:new ObjectId(id)};
      const update={
        $set:{
          name:updatedProduct.name,
          price:updatedProduct.price
        }
      }
      const result=await productscollection.updateOne(query,update);
      res.send(result)
    }) 

    app.delete('/products/:id',async (req,res)=>{
        const id=req.params.id;
        const query={_id:new ObjectId(id)}
        const result=await productscollection.deleteOne(query)
        res.send(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);

app.listen(port,()=>{
    console.log(`Smart server is running on port: ${port}`)
})