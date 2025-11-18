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
    const body = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing Gemini API key" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
I have completed a quiz with the following data:
- Quiz Title: ${body.title}
- Category: ${body.category}
- Difficulty: ${body.description}
- Total Questions: ${body.totalQuestions}
- Attempts: ${body.attempts}

Here is the latest attempt:
- Attempt ID: ${body.attemptsHistory[0].attemptId}
- Completed On: ${body.attemptsHistory[0].completedOn}
- Score: ${body.attemptsHistory[0].score}%
- Correct Answers: ${body.attemptsHistory[0].correctAnswers}
- Incorrect Answers: ${body.attemptsHistory[0].incorrectAnswers}
- Skipped Answers: ${body.attemptsHistory[0].skippedAnswers}
- Time Spent: ${body.attemptsHistory[0].timeSpent}

Each question and user response is provided in this structure:
${JSON.stringify(body.attemptsHistory[0].questions, null, 2)}

Based on this data, generate a personalized result report in JSON format including:
1. summary: A short 2-3 line summary.
2. analysis: A breakdown of what went well and what didn't.
3. recommendations: Actionable suggestions to improve.
4. next_steps: A prioritized list of what the user should focus on next.
5. motivation: An uplifting message to keep the user going.
6. badges: A list of badges earned with title and description.
7. weak_topics: List of weak topics.
8. strong_topics: List of strong topics.
9. study_materials: An array of 5 recommended study resources, each with this format:
   {
     "title": "Resource Title",
     "type": "video/article/book/etc",
     "url": "https://..."
   }

Return only the JSON.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const json = extractJSON(responseText); // Use your extractJSON helper

    if (!json) {
      return new Response(
        JSON.stringify({ error: "Failed to extract JSON from Gemini" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Quiz analysis API error:", err);
    return new Response(
      JSON.stringify({ error: "Server error", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
