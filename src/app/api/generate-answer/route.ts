import { GoogleGenerativeAI } from "@google/generative-ai";

function extractJSON(input: string | object): any {
  try {
    if (typeof input === "object") return input;

    if (typeof input === "string") {
      const backtickMatch = input.match(/```json([\s\S]*?)```/);
      if (backtickMatch) {
        try {
          return JSON.parse(backtickMatch[1].trim());
        } catch (error) {
          console.error("Error parsing JSON from backticks:", error);
          return null;
        }
      }

      try {
        return JSON.parse(input);
      } catch (error) {
        console.error("Error parsing direct JSON:", error);
        return null;
      }
    }
    console.error("No valid JSON could be extracted");
    return null;
  } catch (error) {
    console.error("Unexpected error in extractJSON function:", error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    let requestBody;
    try {
      const text = await req.text();
      //console.log("Raw request body:", text);
      requestBody = JSON.parse(text);
    } catch (error: any) {
      console.error("Error parsing request body:", error);
      return new Response(
        JSON.stringify({
          error: "Invalid JSON in request body",
          details: error.message,
          position: error.message.match(/position (\d+)/)?.[1] || "unknown",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const { title, description, category, typetoAnswer } = requestBody;

    // Validate required fields
    if (!title || !description || !category) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          required: ["problem_number", "problem_description"],
          received: Object.keys(requestBody),
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not found" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);

      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });

      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      };

      const prompt = `You are a flashcard assistant. I will give you a question title, category, and the question itself. Your job is to return a JSON object with the original fields and a new field called "answer" that provides a clear, concise, and accurate answer to the question.

Please respond ONLY with a valid JSON object in the following format:

{
  "title": "Question title here",
  "category": "Category name here",
  "question": "The full question here",
  "answer": "Your answer here"
}

Here is the data:
Title: ${title}
Category: ${category}
Question: ${description}
How to answer: ${typetoAnswer}
If How to answer is descriptive Answer in 250 words , 
if How to asnwer is with Example Answer with a good example`;
      try {
        const chatSession = model.startChat({
          generationConfig,
          history: [
            {
              role: "user",
              parts: [
                {
                  text: `You are a flashcard assistant. I will give you a question title, category, and the question itself. Your job is to return a JSON object with the original fields and a new field called "answer" that provides a clear, concise, and accurate answer to the question.

Please respond ONLY with a valid JSON object in the following format:

{
  "title": "JavaScript Promises",
  "category": "Programming",
  "question": "What is a Promise in JavaScript?",
  "answer": "A Promise is an object representing the eventual completion or failure of an asynchronous operation."
}

Here is the data:
Title: JavaScript Promises  
Category: Programming  
Question: What is a Promise in JavaScript?
How to answer: Concise`,
                },
              ],
            },
            {
              role: "model",
              parts: [
                {
                  text: `\`\`\`json
{
  "title": "JavaScript Promises",
  "category": "Programming",
  "question": "What is a Promise in JavaScript?",
  "answer": "A Promise is an object representing the eventual completion or failure of an asynchronous operation."
}
\`\`\`
`,
                },
              ],
            },
          ],
        });

        const result = await chatSession.sendMessage(prompt);
        let responseData = extractJSON(result.response.text());

        if (!responseData) {
          return new Response(
            JSON.stringify({
              error: "Failed to parse JSON response from Gemini",
            }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
        }

        // Handle old format response (convert if needed)
        const validatedResponse = responseData;
        if (!validatedResponse) {
          return new Response(
            JSON.stringify({
              error: "Invalid response structure from Gemini",
              received: responseData,
            }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
        }

        return new Response(JSON.stringify(validatedResponse), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error: any) {
        console.error("Error in chatSession communication:", error);
        return new Response(
          JSON.stringify({
            error: "Failed to communicate with Gemini API",
            details: error.message,
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }
    } catch (error: any) {
      console.error("Error initializing Gemini API:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to initialize Gemini API",
          details: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  } catch (error: any) {
    console.error("Unhandled error in POST handler:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
