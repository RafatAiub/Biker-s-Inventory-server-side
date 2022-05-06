const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = "mongodb://dbuser70:xDJRDr0RMLQeUXXD@cluster0-shard-00-00.p9dxu.mongodb.net:27017,cluster0-shard-00-01.p9dxu.mongodb.net:27017,cluster0-shard-00-02.p9dxu.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-ldkzjq-shard-0&authSource=admin&retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const userCollection = client.db("foodExpress").collection("user");
        //get user 
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        })
        //post user: add   new user 
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            console.log('Adding New User', newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        });
        //update user
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);

        })
        //delete a user
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
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