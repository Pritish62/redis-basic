import express from 'express';
import { emailQueue } from './queue.js';



const app = express();
app.use(express.json());

app.post("/sendemail", async (req, res) => {
    const job = await emailQueue.add("send-email-queue",
        {
            to: req.body.to,

            subject: req.body.subject || "Welcome to our service!",
            body: req.body.body || "Thank you for signing up. We're excited to have you on board!",
        },
        {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000, // Initial delay in milliseconds
            },
        }
    );
    res.status(200).json({ message: "Email job added to the queue", jobId: job.id });
});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});