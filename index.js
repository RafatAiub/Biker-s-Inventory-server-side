const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = `mongodb://${process.env.DB_BIKE}:${process.env.DB_PASS}@cluster0-shard-00-00.spmf5.mongodb.net:27017,cluster0-shard-00-01.spmf5.mongodb.net:27017,cluster0-shard-00-02.spmf5.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-f0zpwi-shard-0&authSource=admin&retryWrites=true&w=majority`;;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const bikeCollection = client.db("ware-house").collection("Bikes");
        //get bike 
        app.get('/bikes', async (req, res) => {
            const query = {};
            const cursor = bikeCollection.find(query);
            const bikes = await cursor.toArray();
            res.send(bikes);
        })

        app.get('/bike/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bikeCollection.findOne(query);
            res.send(result);
        })
        //post bike: add   new bike 
        app.post('/bike', async (req, res) => {
            const newBike = req.body;
            console.log('Adding New bike', newBike);
            const result = await bikeCollection.insertOne(newBike);
            res.send(result);
        });
        //update bike
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const updatedBike = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedBike.name,
                    email: updatedBike.email
                }
            };
            const result = await bikeCollection.updateOne(filter, updateDoc, options);
            res.send(result);

        })
        //delete a bike
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bikeCollection.deleteOne(query);
            res.send(result);

        })
    }
    finally {
        // await client.close();
    }

}

// console.log(object);
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running my node crud server apply mongobd');
})

app.listen(port, () => {
    console.log('Do not disturb CRUD server is running');
})