import { GoogleGenerativeAI } from "@google/generative-ai";

// Define interfaces for the response
interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface CodeSnippet {
  lang: string;
  code: string;
}

interface LeetCodeProblem {
  id: string;
  number: number;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  examples: Example[];
  constraints: string[];
  starterCode: CodeSnippet[];
}

/**
 * Extracts and parses JSON from various string formats
 */
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

/**
 * Validates that the response matches the LeetCodeProblem interface
 */
function validateLeetCodeProblem(data: any): LeetCodeProblem | null {
  // Basic validation
  if (!data || typeof data !== "object") return null;

  const requiredFields = [
    "id",
    "number",
    "title",
    "description",
    "difficulty",
    "examples",
    "constraints",
    "starterCode",
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      console.error(`Missing required field: ${field}`);
      return null;
    }
  }

  // Check difficulty is valid
  if (!["Easy", "Medium", "Hard"].includes(data.difficulty)) {
    console.error(`Invalid difficulty: ${data.difficulty}`);
    return null;
  }

  // Validate examples and starterCode are arrays
  if (
    !Array.isArray(data.examples) ||
    !Array.isArray(data.constraints) ||
    !Array.isArray(data.starterCode)
  ) {
    console.error("examples, constraints, and starterCode must be arrays");
    return null;
  }

  return data as LeetCodeProblem;
}

/**
 * Convert the old starterCode format to the new CodeSnippet[] format
 */
function convertStarterCode(starterCode: any): CodeSnippet[] {
  if (!starterCode || typeof starterCode !== "object") return [];

  return Object.entries(starterCode).map(([lang, code]) => ({
    lang,
    code: code as string,
  }));
}

export async function POST(req: Request) {
  try {
    //console.log("POST request received");

    // Improved error handling for request body parsing
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

    const { problem_number, problem_description } = requestBody;

    // Validate required fields
    if (!problem_description) {
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

      const prompt = `You are given a LeetCode problem with the following details:
• LeetCode Problem Title: ${problem_description}
• (Optional) LeetCode Problem Number: ${problem_number}

Your tasks:
1. Give higher priority to the problem title than the problem number.
2. If the given problem number is incorrect or missing, try to determine the correct one based on the title.
3. If the problem does not exist or the title is invalid, generate a realistic and original dummy LeetCode-style problem using the given title as inspiration.

Return the result as a valid JSON object matching the structure below:

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface CodeSnippet {
  lang: string;
  code: string;
}

interface LeetCodeProblem {
  id: string;           // kebab-case identifier based on title
  number: number;       // The LeetCode problem number (use a high dummy number like 9999+ if it’s fictional)
  title: string;        // The title of the problem
  description: string;  // Detailed problem description
  difficulty: "Easy" | "Medium" | "Hard";  // Problem difficulty
  examples: Example[];  // Array of input/output examples with optional explanations
  constraints: string[]; // Array of constraints
  starterCode: CodeSnippet[]; // Starter code in JavaScript, Python, Java, and C++ (minimum)

Important:
- You must return only a valid JSON object.
- Do not include any explanation, text, or markdown around the JSON.
- Make the dummy data as believable and LeetCode-style as possible if needed.`;
      try {
        const chatSession = model.startChat({
          generationConfig,
          history: [
            {
              role: "user",
              parts: [
                {
                  text: 'You are given a LeetCode problem with the following details:\n• LeetCode Problem Number: 100\n• LeetCode Problem Title: \n\nYour task is to create a JSON object that follows this interface:\n\ninterface Example {\n  input: string;\n  output: string;\n  explanation?: string;\n}\n\ninterface CodeSnippet {\n  lang: string;\n  code: string;\n}\n\ninterface LeetCodeProblem {\n  id: string;           // kebab-case identifier based on title\n  number: number;       // The LeetCode problem number\n  title: string;        // The title of the problem\n  description: string;  // Detailed problem description\n  difficulty: "Easy" | "Medium" | "Hard";  // Problem difficulty\n  examples: Example[];  // Array of input/output examples with optional explanations\n  constraints: string[]; // Array of constraints\n  starterCode: CodeSnippet[]; // Array of code snippets in different languages\n}\n\nInclude starter code for JavaScript, Python, Java, and C++ at minimum.\nFormat your response as a pure JSON object, without any extra explanation.',
                },
              ],
            },
            {
              role: "model",
              parts: [
                {
                  text: '```json\n{\n  "id": "same-tree",\n  "number": 100,\n  "title": "Same Tree",\n  "description": "Given the roots of two binary trees p and q, write a function to check if they are the same.\\n\\nTwo binary trees are considered the same if they are structurally identical, and the nodes have the same value.",\n  "difficulty": "Easy",\n  "examples": [\n    {\n      "input": "p = [1,2,3], q = [1,2,3]",\n      "output": "true",\n      "explanation": "Both trees have the same structure and the same values at corresponding nodes."\n    },\n    {\n      "input": "p = [1,2], q = [1,null,2]",\n      "output": "false",\n      "explanation": "Although both trees have the same values, their structure is different."\n    },\n    {\n      "input": "p = [1,2,1], q = [1,1,2]",\n      "output": "false",\n      "explanation": "The values at the same positions are different."\n    }\n  ],\n  "constraints": [\n    "The number of nodes in both trees is in the range [0, 100].",\n    "-10^4 <= Node.val <= 10^4"\n  ],\n  "starterCode": [\n    {\n      "lang": "javascript",\n      "code": "/**\\n * Definition for a binary tree node.\\n * function TreeNode(val, left, right) {\\n *     this.val = (val===undefined ? 0 : val)\\n *     this.left = (left===undefined ? null : left)\\n *     this.right = (right===undefined ? null : right)\\n * }\\n */\\n/**\\n * @param {TreeNode} p\\n * @param {TreeNode} q\\n * @return {boolean}\\n */\\nvar isSameTree = function(p, q) {\\n    // Your code here\\n};" \n    },\n    {\n      "lang": "python",\n      "code": "# Definition for a binary tree node.\\n# class TreeNode:\\n#     def __init__(self, val=0, left=None, right=None):\\n#         self.val = val\\n#         self.left = left\\n#         self.right = right\\nclass Solution:\\n    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:\\n        # Your code here\\n        pass"\n    },\n    {\n      "lang": "java",\n      "code": "/**\\n * Definition for a binary tree node.\\n * public class TreeNode {\\n *     int val;\\n *     TreeNode left;\\n *     TreeNode right;\\n *     TreeNode() {}\\n *     TreeNode(int val) { this.val = val; }\\n *     TreeNode(int val, TreeNode left, TreeNode right) {\\n *         this.val = val;\\n *         this.left = left;\\n *         this.right = right;\\n *     }\\n * }\\n */\\nclass Solution {\\n    public boolean isSameTree(TreeNode p, TreeNode q) {\\n        // Your code here\\n    }\\n}"\n    },\n    {\n      "lang": "cpp",\n      "code": "/**\\n * Definition for a binary tree node.\\n * struct TreeNode {\\n *     int val;\\n *     TreeNode *left;\\n *     TreeNode *right;\\n *     TreeNode() : val(0), left(nullptr), right(nullptr) {}\\n *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\\n *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}\\n * };\\n */\\nclass Solution {\\npublic:\\n    bool isSameTree(TreeNode* p, TreeNode* q) {\\n        // Your code here\\n    }\\n};"\n    }\n  ]\n}\n```',
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
        if (
          responseData.starterCode &&
          typeof responseData.starterCode === "object" &&
          !Array.isArray(responseData.starterCode)
        ) {
          responseData.starterCode = convertStarterCode(
            responseData.starterCode,
          );
        }

        // Ensure number field is present and is a number
        if (!responseData.number && problem_number) {
          responseData.number = parseInt(problem_number, 10);
        }

        // Validate the response structure
        const validatedResponse = validateLeetCodeProblem(responseData);

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
