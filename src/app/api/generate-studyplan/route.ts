import { GoogleGenerativeAI } from "@google/generative-ai";
import Error from "next/error";

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

    const {
      job_title,
      number_of_days,
      hours_per_day,
      my_current_skills,
      required_job_skills,
    } = requestBody;

    // Validate required fields
    if (
      !job_title ||
      !number_of_days ||
      !hours_per_day ||
      !my_current_skills ||
      !required_job_skills
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

      const prompt = `I am preparing for an interview for the role of ${job_title} at a FAANG Company, and my interview is scheduled on ${new Date(Date.now() + number_of_days * 24 * 60 * 60 * 1000).toDateString()}. 
I have ${number_of_days} days left to prepare, and I can study for ${hours_per_day} hours each day. 
I will provide a list of skills I already possess: ${my_current_skills}, and the list of skills required for the job: ${required_job_skills}. 
Based on this information, generate a personalized study plan in JSON format. 
The JSON should contain an array called "study_plan" with ${number_of_days} entries—one for each day—where each entry includes: 
"day": the day number, 
"topics": a list of topics to study that day, 
"hours_allocated": time assigned to each topic, 
"focus_area": either "learning" for new skills or "revision" for familiar ones, 
"notes": optional recommendations like mock interviews, rest days, or quick reviews.`;

      try {
        const chatSession = model.startChat({
          generationConfig,
          history: [
            {
              role: "user",
              parts: [
                {
                  text: 'I am preparing for an interview for the role of Software Engineer at Google, and my interview is scheduled on April 20, 2025. I have 7 days left to prepare, and I can study for 6 hours each day. I will provide a list of skills I already possess: Data Structures, JavaScript, React, Git, and the list of skills required for the job: System Design, Algorithms, React, TypeScript, Behavioral Interview Preparation. Based on this information, generate a personalized study plan in JSON format. The JSON should contain an array called "study_plan" with 7 entries—one for each day—where each entry includes:\n\t•\t"day": the day number,\n\t•\t"topics": a list of topics to study that day,\n\t•\t"hours_allocated": time assigned to each topic,\n\t•\t"focus_area": either "learning" for new skills or "revision" for familiar ones,',
                },
              ],
            },
            {
              role: "model",
              parts: [
                {
                  text: '```json\n{\n  "interview_date": "April 20, 2025",\n  "preparation_start_date": "April 13, 2025",\n  "skills_possessed": ["Data Structures", "JavaScript", "React", "Git"],\n  "skills_required": ["System Design", "Algorithms", "React", "TypeScript", "Behavioral Interview Preparation"],\n  "study_plan": [\n    {\n      "day": 1,\n      "topics": [\n        {"topic": "System Design Fundamentals (Scalability, Availability, Consistency)", "hours_allocated": 2, "focus_area": "learning"},\n        {"topic": "TypeScript Basics (Types, Interfaces, Classes)", "hours_allocated": 2, "focus_area": "learning"},\n        {"topic": "React Revision (Component Lifecycle, Hooks)", "hours_allocated": 2, "focus_area": "revision"}\n      ]\n    },\n    {\n      "day": 2,\n      "topics": [\n        {"topic": "System Design Patterns (Caching, Load Balancing)", "hours_allocated": 2, "focus_area": "learning"},\n        {"topic": "TypeScript Advanced Types and Generics", "hours_allocated": 2, "focus_area": "learning"},\n        {"topic": "Algorithms: Array and String Manipulation", "hours_allocated": 2, "focus_area": "learning"}\n      ]\n    },\n    {\n      "day": 3,\n      "topics": [\n        {"topic": "Algorithms: Sorting Algorithms (Merge Sort, Quick Sort)", "hours_allocated": 3, "focus_area": "learning"},\n        {"topic": "Behavioral Questions: Project Experience and Challenges", "hours_allocated": 3, "focus_area": "learning"}\n      ]\n    },\n    {\n      "day": 4,\n      "topics": [\n        {"topic": "Algorithms: Search Algorithms (Binary Search, Depth-First Search, Breadth-First Search)", "hours_allocated": 3, "focus_area": "learning"},\n        {"topic": "React with TypeScript: Creating components and handling props", "hours_allocated": 3, "focus_area": "learning"}\n      ]\n    },\n    {\n      "day": 5,\n      "topics": [\n        {"topic": "System Design: Designing a URL Shortener", "hours_allocated": 3, "focus_area": "learning"},\n        {"topic": "Algorithms: Dynamic Programming (Basic Problems)", "hours_allocated": 3, "focus_area": "learning"}\n      ]\n    },\n    {\n      "day": 6,\n      "topics": [\n        {"topic": "Behavioral Questions: Leadership and Teamwork", "hours_allocated": 3, "focus_area": "learning"},\n        {"topic": "Algorithms: Graph Algorithms (Dijkstra, Topological Sort)", "hours_allocated": 3, "focus_area": "learning"}\n      ]\n    },\n    {\n      "day": 7,\n      "topics": [\n        {"topic": "System Design Review and Practice (Overall Architectures)", "hours_allocated": 2, "focus_area": "revision"},\n        {"topic": "Algorithms Review (All Topics)", "hours_allocated": 2, "focus_area": "revision"},\n        {"topic": "Behavioral Questions: Review STAR method and practice", "hours_allocated": 2, "focus_area": "revision"}\n      ]\n    }\n  ]\n}\n```\n',
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
