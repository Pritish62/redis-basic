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


function otpKey (phoneNumber) { 
    return`otp:${phoneNumber}`;
}


app.post("/send-otp", async (req, res) => {
    const { phoneNumber } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.set(otpKey(phoneNumber), otp, "EX", 30); // Set OTP with 30 second expiration
    res.json({ message: "OTP sent successfully!" , otp});
});


app.post("/verify-otp", async (req, res) => {
    const { phoneNumber, otp } = req.body;
    const storedOtp = await redis.get(otpKey(phoneNumber));

    if(!storedOtp) {
        return res.status(400).json({ message: "OTP has expired or does not exist." });
    }

    if(storedOtp !== otp) {
        return res.status(400).json({ message: "Invalid OTP." });
    }

    await redis.del(otpKey(phoneNumber)); // Delete OTP after successful verification
    res.json({ message: "OTP verified successfully!" });
});


app.get("/otp/:phoneNumber/ttl", async (req, res) => {
    const ttl = await redis.ttl(otpKey(req.params.phoneNumber));
    res.json({ ttl });
});





const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {   
    console.log(`Server is running on port ${PORT}`);
});