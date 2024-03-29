import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: 'Generate a random common word between 4 and 8 letters',
      temperature: 1,
    });

    const result = completion.data.choices[0].text;
    const sanitizedResult = sanitizeResult(result);

    res.status(200).json({ result: sanitizedResult });

  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

/**
 * Remove not necessary characters 
 * @param {string} result Value to be sanitized
 */
function sanitizeResult(result) {
  const sanitizedResult = result
                            .replaceAll('\n', '')
                            .replaceAll('.', '');
  return sanitizedResult;
}
