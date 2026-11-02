const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function generatePrompt(productName, description) {
    try {
        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content: "You are an expert AI product photography prompt engineer. Return only the final image generation prompt. Do not include reasoning or explanations."
                },
                {
                    role: "user",
                    content: `Create a detailed image generation prompt for this product:

Product Name: ${productName}
Description: ${description}

Include the product's appearance, background, lighting, composition and photography style. Return the final prompt only.`
                }
            ],
            max_completion_tokens: 1000
        });

        const result = completion.choices[0].message.content;

        if (!result || !result.trim()) {
            throw new Error("Groq returned an empty response");
        }

        return result.trim();

    } catch (error) {
        console.error("Groq Error:", error.message);
        throw error;
    }
}

module.exports = generatePrompt;