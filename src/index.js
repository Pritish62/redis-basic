import express from "express";
import Redis from "ioredis";
import  mongoose  from "mongoose";

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// app.get("/redis", async (req, res) => {
//     const reply = await redis.ping();
//     res.json({ message: `Redis is working! Reply: ${reply}` });
// });

// app.get("/mongo", async (req, res) => {
//    const url = process.env.MONGO_URL || "mongodb://localhost:27017/redis-basic";
//    if (!mongoose.connection.readyState) {
//     await mongoose.connect(url);
//    }
//    res.json ({ message: "MongoDB is working!" });
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {   
    console.log(`Server is running on port ${PORT}`);
});