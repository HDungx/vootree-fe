import { Configuration, OpenAIApi } from "openai";

export const checkReviewContent = async (reviewText) => {
  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_SECRET,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Check if the following review contains sensitive information: ${reviewText}`,
      max_tokens: 50,
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("Error checking review content:", error);
    return null;
  }
};
