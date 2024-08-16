// pages/api/check-review.js
import { OpenAIApi, Configuration } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_SECRET,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { reviewText } = req.body;

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Check if the following review contains sensitive information: ${reviewText}`,
        max_tokens: 50,
      });

      const result = response.data.choices[0].text.trim();
      res.status(200).json({ result });
    } catch (error) {
      console.error("Error checking review content:", error);
      res.status(500).json({ error: "Failed to check review content" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
