const express=require('express')
const cors=require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');

const app=express()
const port=process.env.PORT || 5000
require('dotenv').config()
const jwt= require('jsonwebtoken')
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DATA_USER}:${process.env.DATA_PASS}@cluster0.0xqymst.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    const db=client.db("musicClass");
    const userCollectionUser=db.collection('CUN-user')
    const productCollection=db.collection('CUN-products')
    const cartsCollections=db.collection('CUN-carts')



    app.post('/jwt', async (req,res)=>{
      const  email=req.body;
      console.log(email);
      const token=jwt.sign( email, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '1h',
    })
    console.log(token)
      res.send({token})
    })

    // middle ware verify jwt

    const verifyJWT=(req,res,next  )=>{
      const authorization=req.headers.authorization
      if(!authorization){
        return res.status(401).send({error: true , message: "Unauthorized Access"})
      }
      console.log(authorization)
      // /token verify
      const token=authorization.split(' ')[1]
      console.log(token)
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=>{
        if(err){
          return res.status(401).send({error: true , message: "Unauthorized Access"})
        }
        req.decoded =decoded
        next()  
      })


    //go forward

    }

    app.put('/users',async(req,res)=>{
      const email=req.params.email // receiving the email from the client request
      console.log(email)
      const user =req.body 
      const query={email : email} //check if the email is there
      const options={upsert: true} //if there is no data then add the new data
      const updateDoc={
          $set: user
      }
      const result=await userCollectionUser.updateOne(query,updateDoc,options)
      console.log(result)
      res.send(result)

  })

  // get alluser
  app.get("/allUser",async(req,res)=>{
     
    const result=await userCollectionUser.find().toArray()
    res.send(result)

    
  
})

app.get("/allcarts",async(req,res)=>{
   
  const result=await cartsCollections.find().toArray()
  res.send(result)

  

})
app.get("/allprodcuts",async(req,res)=>{
   
  const result=await productCollection.find().toArray()
  res.send(result)

  

})
// category
app.get('/watch',async(req,res)=>{

  const query={category :'watch'}
  const cursor=productCollection.find(query)
  const result=await cursor.toArray()
  res.send(result)
})

app.get('/laptop',async(req,res)=>{

  const query={category :'laptop'}
  const cursor=productCollection.find(query)
  const result=await cursor.toArray()
  res.send(result)
})
app.get('/monitor',async(req,res)=>{

  const query={category :'monitor'}
  const cursor=productCollection.find(query)
  const result=await cursor.toArray()
  res.send(result)
})
app.get('/phone',async(req,res)=>{

  const query={category :'phone'}
  const cursor=productCollection.find(query)
  const result=await cursor.toArray()
  res.send(result)
})
app.get('/pc',async(req,res)=>{

  const query={category :'pc'}
  const cursor=productCollection.find(query)
  const result=await cursor.toArray()
  res.send(result)
})
app.get('/female',async(req,res)=>{

  const query={category :'Female Fashion'}
  const cursor=productCollection.find(query)
  const result=await cursor.toArray()
  res.send(result)
})
app.get('/male',async(req,res)=>{

  const query={category :'Male Fashion'}
  const cursor=productCollection.find(query)
  const result=await cursor.toArray()
  res.send(result)
})
app.get('/Virtual',async(req,res)=>{

  const query={category :'Virtual reality'}
  const cursor=productCollection.find(query)
  const result=await cursor.toArray()
  res.send(result)
})
app.get('/Camera',async(req,res)=>{

  const query={category :'Camera'}
  const cursor=productCollection.find(query)
  const result=await cursor.toArray()
  res.send(result)
})
app.get('/beauty',async(req,res)=>{

  const query={category :'Beauty Products'}
  const cursor=productCollection.find(query)
  const result=await cursor.toArray()
  res.send(result)
})
app.get('/baby',async(req,res)=>{

  const query={category :'Baby products'}
  const cursor=productCollection.find(query)
  const result=await cursor.toArray()
  res.send(result)
})
//specific product by email 

// app.get("/data/:email", async (req, res) => {
//   const email = req.params.email;


//     const data = await productCollection.find({ email: email }).toArray();
//     res.json(data);

// });
app.get('/specific/:email',verifyJWT,async(req,res)=>{
  const decodedEmail=req.decoded.email
  console.log(decodedEmail)
  const email = req.params.email;
  if(email !== decodedEmail){
    return res.status(403)
    .send({error: true, message: 'Forbidden Access'})
  }
  const query={selleremail: email}
  const cursor=productCollection.find(query)
  const result=await cursor.toArray()
  res.send(result)
})

app.get('/favs/:email',verifyJWT,async(req,res)=>{
  const decodedEmail=req.decoded.email
  console.log(decodedEmail)
  const email = req.params.email;
  if(email !== decodedEmail){
    return res.status(403)
    .send({error: true, message: 'Forbidden Access'})
  }
  const query={userID: email}
  const cursor=cartsCollections.find(query)
  const result=await cursor.toArray()
  res.send(result)
})

// app.get('/alldata/:category',async(req,res)=>{
//   const category = req.params.category;
//   const query={category: category}
//   const cursor=productCollection.find(query)
//   const result=await cursor.toArray()
//   res.send(result)
// })

app.post('/carts', async (req,res)=>{
const item=req.body
console.log(item)
const result=await cartsCollections.insertOne(item)
res.send(result)
})
app.delete('/deleteCart/:id',async (req,res)=>{
  const id=req.params.id
  const query={_id: new ObjectId(id) }
  const result =await cartsCollections.deleteOne(query);
  res.send(result)
})

app.put("/updatedoc", async (req, res) => {
  const email = req.body.email;
  const { shopName, request } = req.body;

  const filter = { email: email };
  const updateDoc = {
    $set: {
      shopName: shopName,
      request: request
    },
  };

  const result = await userCollectionUser.updateOne(filter, updateDoc);
  res.send(result);
});
// Delete an product
app.delete('/deleteProduct/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await productCollection.deleteOne(query);
  res.send(result);
})

// post a new products
app.post("/postProducts",async(req,res)=>{
  const body=req.body
  const result=await productCollection.insertOne(body)
  res.send(result)

  
  console.log(body)
})


// Deny


app.put('/allproducts/deny/:id', async (req,res)=>{
  const id=req.params.id;
  const filterApprove={_id: new ObjectId(id)};
  const updateDoc={
    $set :{
      status :'Rejected'
    },

  }
  const result =await productCollection.updateOne(filterApprove,updateDoc)
  res.send(result)
})
app.put('/allproducts/approve/:id', async (req,res)=>{
  const id=req.params.id;
  const filterApprove={_id: new ObjectId(id)};
  const updateDoc={
    $set :{
      status :'approved '
    },

  }
  const result =await productCollection.updateOne(filterApprove,updateDoc)
  res.send(result)
})
    









    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('cart is running')

})

app.listen(port,()=>{
    console.log(`cart is running on ${port}`)
})