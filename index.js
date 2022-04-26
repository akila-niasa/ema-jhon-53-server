const express=require('express')
const app=express()
const cors=require('cors')
require('dotenv').config()
const port=process.env.PORT||5000

app.use(cors())
app.use(express.json())

// dbUser1


const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.26ozi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("ema-jhon").collection("product");
//   // perform actions on the collection object
//   client.close();
// });

async function run(){
    try{
        await client.connect()
        const productCollection = client.db("ema-jhon").collection("product");

        app.get('/product',async(req,res)=>{
            const query={}
            const data=req.query
            const page=parseInt(req.query.page)
            const size=parseInt(req.query.size)
            const cursor=productCollection.find(query)

            let newProduct
            if(page||size){
                newProduct=await cursor.skip(page*size).limit(size).toArray()
            }else{
                 newProduct=await cursor.toArray()
            }

          
           
            res.send(newProduct)
        })

        app.get('/productCount',async(req,res)=>{
            // const query={}
            // const cursor=productCollection.find(query)
            const count=await productCollection.estimatedDocumentCount()
            res.send({count})
        })

        app.post('/productByKeys', async(req, res) =>{
            const keys = req.body;
            const ids = keys.map(id => ObjectId(id));
            const query = {_id: {$in: ids}}
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            console.log(keys);
            res.send(products);
        })

    }finally{

    }
}
run().catch(console.dir)
 
app.get('/',async(req,res)=>{
    res.send('CURD is running.....')
})

app.listen(port,()=>{console.log('CURD is running')})