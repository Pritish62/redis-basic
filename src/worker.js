import { Worker } from "bullmq";
import { connection } from "./queue.js";

const worker = new Worker(
    "emailQueue",
    async (job) => {
        // Process the job here
        console.log(`Processing job ${job.id} with data:`, job.data);
        // Simulate email sending
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(`Email sent for job ${job.id}`);
    },
    { connection }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed successfully.`);
});

worker.on("failed", (job, err) => {
    console.error(`Job ${job.id} failed with error:`, err);
});

export default worker;
