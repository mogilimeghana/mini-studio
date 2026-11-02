
const pool = require("../config/db");
const generateImage = require("./imageGenerator");

const fs = require("fs");
const path = require("path");

const mockImageGeneration = async (jobId, prompt) => {
    try {
        // Generate image
        const imageBuffer = await generateImage(prompt);

        if (!imageBuffer) {
            throw new Error("Image generation failed.");
        }

        // Create uploads folder if it doesn't exist
        const uploadDir = path.join(__dirname, "..", "uploads");

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Save generated image
        const fileName = `generated-${jobId}.png`;
        const filePath = path.join(uploadDir, fileName);

        fs.writeFileSync(filePath, imageBuffer);

        const imageUrl = `/uploads/${fileName}`;

        // Update job in MySQL
        await pool.query(
            `UPDATE jobs
             SET status = ?, image_url = ?
             WHERE id = ?`,
            ["completed", imageUrl, jobId]
        );

        console.log(`✅ Job ${jobId} completed`);

    } catch (error) {
        console.error("Image generation failed:", error.message);

        // Mark job as failed instead of leaving it processing
        try {
            await pool.query(
                "UPDATE jobs SET status = ? WHERE id = ?",
                ["failed", jobId]
            );
        } catch (dbError) {
            console.error("Failed to update job status:", dbError.message);
        }
    }
};

module.exports = {
    mockImageGeneration
};
