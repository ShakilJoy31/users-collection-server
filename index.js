const express = require('express');
const app = express(); 
const port = process.env.PORT || 4000; 
const cors = require('cors');
require('dotenv').config(); 
app.use(cors()); 
app.use(express.json()); 


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USERS}:${process.env.PASSWORD}@cluster0.vvmdl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();
        const usersCollection = client.db('users').collection('user');
        console.log('Database is connected'); 
        // Adding users to the database. 
        app.post('/users', async (req, res)=>{
            const info = req.body; 
            const result = await usersCollection.insertOne(info); 
            console.log(result); 
            res.send(result); 
        })
        app.get('/getuser', async (req, res) =>{
            const query = {}; 
            const gettingUsers = usersCollection.find(query); 
            const results = await gettingUsers.toArray(); 
            res.send(results); 
        })
        app.delete('/deleteUser/:id', async (req, res)=>{
            const id = req.params.id; 
            const query = {_id:ObjectId(id)}; 
            const result = await usersCollection.deleteOne(query); 
            res.send(result); 
        })
    }
    finally{
        
    }
}
run().catch(console.dir); 


app.get('/', (req, res)=>{
    res.send('This server is running'); 
}); 


app.listen(port, ()=>{
    console.log('Listening to the port ',port); 
})