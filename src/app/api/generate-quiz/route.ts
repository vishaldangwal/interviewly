import { GoogleGenerativeAI } from "@google/generative-ai";

function extractJSON(input: string | object) {
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

    const {
      topic,
      difficulty,
      question_type,
      number_of_questions,
      time_per_question,
    } = requestBody;

    // Validate required fields
    if (
      !topic ||
      !difficulty ||
      !question_type ||
      !number_of_questions ||
      !time_per_question
    ) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          required: [
            "job_title",
            "number_of_days",
            "hours_per_day",
            "my_current_skills",
            "required_job_skills",
          ],
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

      const prompt = `Generate an array of quiz questions based on the following configuration: ${topic}, ${difficulty} difficulty, ${question_type},${number_of_questions} number of questions, and ${time_per_question}time per question. Each question should be a multiple-choice question represented as a JSON object with the following structure: (1) "question" – a string containing the question text, (2) "options" – an array of exactly four answer choices, and (3) "correct" – the index (0-based) of the correct option from the options array. The total number of questions should match the numberOfQuestions value. Ensure the content aligns with the given topic and difficulty. Return only a JSON array without any extra explanation, strictly following the required format.`;

      try {
        const chatSession = model.startChat({
          generationConfig,
          history: [
            {
              role: "user",
              parts: [
                {
                  text: `Generate an array of quiz questions based on the following configuration: Javascript, medium, single correct type, 10, and 30sec 
 Each question should be a multiple-choice question represented as a JSON object with the following structure: (1) "question" – a string containing the question text, (2) "options" – an array of exactly four answer choices, and (3) "correct" – the index (0-based) of the correct option from the options array. The total number of questions should match the numberOfQuestions value. Ensure the content aligns with the given topic and difficulty. Return only a JSON array without any extra explanation, strictly following the required format.`,
                },
              ],
            },
            {
              role: "model",
              parts: [
                {
                  text: `\`\`\`json
[
  {
    "question": "What is the purpose of the \`bind()\` method in JavaScript?",
    "options": [
      "To create a new function with a specified \`this\` value and arguments.",
      "To execute a function immediately.",
      "To remove an event listener.",
      "To concatenate strings."
    ],
    "correct": 0
  },
  {
    "question": "What does the \`typeof\` operator return for an array?",
    "options": [
      "array",
      "object",
      "Array",
      "list"
    ],
    "correct": 1
  },
  {
    "question": "Which of the following is the correct way to create a new object in JavaScript using constructor function?",
    "options": [
      "let obj = new Object();",
      "let obj = create Object();",
      "let obj = new object();",
      "let obj = Object.new();"
    ],
    "correct": 0
  },
  {
    "question": "What is the difference between \`==\` and \`===\` in JavaScript?",
    "options": [
      "\`==\` compares values only, \`===\` compares values and types.",
      "\`===\` compares values only, \`==\` compares values and types.",
      "There is no difference.",
      "\`==\` is used for assignment, \`===\` is used for comparison."
    ],
    "correct": 0
  },
  {
    "question": "Which of the following is NOT a valid JavaScript data type?",
    "options": [
      "Number",
      "String",
      "Boolean",
      "Float"
    ],
    "correct": 3
  },
  {
    "question": "What is a closure in JavaScript?",
    "options": [
      "A function that has access to variables from its outer scope, even after the outer function has finished executing.",
      "A way to close the browser window.",
      "A method for hiding variables from other scripts.",
      "A loop that never terminates."
    ],
    "correct": 0
  },
  {
    "question": "What is the purpose of the \`map()\` method for arrays?",
    "options": [
      "To create a new array with the results of calling a provided function on every element in the calling array.",
      "To remove elements from an array.",
      "To sort the elements of an array.",
      "To find the first element in an array that satisfies a provided testing function."
    ],
    "correct": 0
  },
  {
    "question": "How do you properly check if a variable is \`NaN\` in JavaScript?",
    "options": [
      "variable === NaN",
      "variable == NaN",
      "isNaN(variable)",
      "variable.isNaN()"
    ],
    "correct": 2
  },
  {
    "question": "What is event bubbling in JavaScript?",
    "options": [
      "When an event is handled by the innermost element and then propagates to outer elements.",
      "When an event is handled only by the outermost element.",
      "When an event is prevented from propagating.",
      "When an event is automatically triggered multiple times."
    ],
    "correct": 0
  },
  {
    "question": "What is the purpose of \`JSON.stringify()\`?",
    "options": [
      "To parse a JSON string into a JavaScript object.",
      "To convert a JavaScript object into a JSON string.",
      "To validate a JSON string.",
      "To format a JSON string for readability."
    ],
    "correct": 1
  }
]
\`\`\``,
                },
              ],
            },
          ],
        });

        const result = await chatSession.sendMessage(prompt);
        const ans = extractJSON(result.response.text());

        if (!ans) {
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

        return new Response(JSON.stringify(ans), {
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
