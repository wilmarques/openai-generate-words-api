import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured",
      },
    });
    return;
  }

  const word = req.query.word || "";
  if (word.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a word",
      },
    });
    return;
  }

  try {
    // TODO: Try generating 5 choices using the parameter `n`
    // Compare the costs between increasing the `max_tokens` and the number of choices `n` 

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(word),
      temperature: 0.6,
      // n: 5,
      max_tokens: 100,
    });

    const result = completion.data.choices[0].text;
    const sanitizedResult = result; //sanitizeResult(result);

    res.status(200).json({ result: sanitizedResult });

  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(word) {
  return `Generate 5 definitions for the word ${word}

  ###
1. Definition
2. Definition
3. Definition
4. Definition
5. Definition
###`;
}
