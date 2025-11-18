import { GoogleGenerativeAI } from "@google/generative-ai";

// Define interfaces for the response
interface EnhancedResume {
  enhanced_content: string;
  improvements_made: string[];
  suggestions: string[];
  word_count: {
    original: number;
    enhanced: number;
  };
  readability_score: {
    original: number;
    enhanced: number;
  };
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
 * Validates that the response matches the EnhancedResume interface
 */
function validateEnhancedResume(data: any): EnhancedResume | null {
  // Basic validation
  if (!data || typeof data !== "object") return null;

  const requiredFields = [
    "enhanced_content",
    "improvements_made",
    "suggestions",
    "word_count",
    "readability_score",
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      console.error(`Missing required field: ${field}`);
      return null;
    }
  }

  // Validate word_count structure
  if (!data.word_count.original || !data.word_count.enhanced) {
    console.error("word_count must have original and enhanced properties");
    return null;
  }

  // Validate readability_score structure
  if (!data.readability_score.original || !data.readability_score.enhanced) {
    console.error("readability_score must have original and enhanced properties");
    return null;
  }

  // Validate arrays
  if (!Array.isArray(data.improvements_made) || !Array.isArray(data.suggestions)) {
    console.error("improvements_made and suggestions must be arrays");
    return null;
  }

  return data as EnhancedResume;
}

export async function POST(req: Request) {
  try {
    // Improved error handling for request body parsing
    let requestBody;
    try {
      const text = await req.text();
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

    const { resume_content, target_role, target_industry } = requestBody;

    // Validate required fields
    if (!resume_content) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          required: ["resume_content"],
          optional: ["target_role", "target_industry"],
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
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      };

      const roleContext = target_role ? `Target Role: ${target_role}` : "General professional resume";
      const industryContext = target_industry ? `Target Industry: ${target_industry}` : "General industry";

      const prompt = `You are an expert resume writer and career coach with 15+ years of experience helping professionals land their dream jobs. Your task is to enhance the provided resume content to make it more compelling, professional, and ATS-friendly.

RESUME CONTENT TO ENHANCE:
${resume_content}

CONTEXT:
- ${roleContext}
- ${industryContext}

ENHANCEMENT REQUIREMENTS:

1. **Content Improvements:**
   - Replace weak action verbs with strong, impactful ones (e.g., "did" → "orchestrated", "made" → "implemented")
   - Add quantifiable achievements and metrics where possible
   - Improve clarity and eliminate redundancy
   - Ensure professional tone and industry-appropriate language
   - Optimize for Applicant Tracking Systems (ATS)

2. **Structure and Formatting:**
   - Maintain clear section organization
   - Use consistent formatting and bullet points
   - Ensure proper spacing and readability
   - Keep content concise but impactful

3. **Professional Standards:**
   - Follow current resume best practices
   - Use industry-standard terminology
   - Ensure grammar, spelling, and punctuation are perfect
   - Make content relevant to the target role/industry

Return the result as a valid JSON object with the following structure:

{
  "enhanced_content": "The improved resume content with all enhancements applied",
  "improvements_made": [
    "List of specific improvements made (e.g., 'Replaced weak verbs with strong action verbs', 'Added quantifiable metrics to achievements')"
  ],
  "suggestions": [
    "Additional suggestions for further improvement (e.g., 'Consider adding a skills section', 'Include more specific project outcomes')"
  ],
  "word_count": {
    "original": number,
    "enhanced": number
  },
  "readability_score": {
    "original": number (1-10 scale),
    "enhanced": number (1-10 scale)
  }
}

IMPORTANT GUIDELINES:
- Preserve the original structure and sections
- Only enhance content, don't add fictional information
- Focus on making existing content more impactful
- Ensure the enhanced version is still authentic to the candidate
- Provide specific, actionable suggestions for further improvement
- Calculate accurate word counts and readability scores

Make the resume stand out while maintaining professionalism and authenticity.`;

      try {
        const chatSession = model.startChat({
          generationConfig,
          history: [
            {
              role: "user",
              parts: [
                {
                  text: `You are an expert resume writer. Enhance this resume content:

EXPERIENCE
Software Developer at TechCorp
- Did coding and testing
- Made some features
- Worked with team

EDUCATION
Bachelor's in Computer Science

Return as JSON with enhanced_content, improvements_made, suggestions, word_count, and readability_score.`,
                },
              ],
            },
            {
              role: "model",
              parts: [
                {
                  text: `\`\`\`json
{
  "enhanced_content": "EXPERIENCE\\nSoftware Developer at TechCorp\\n• Developed and tested software applications using modern programming languages\\n• Implemented new features and functionality to enhance user experience\\n• Collaborated with cross-functional teams to deliver high-quality solutions\\n\\nEDUCATION\\nBachelor's Degree in Computer Science",
  "improvements_made": [
    "Replaced weak verbs 'did' and 'made' with strong action verbs 'developed', 'implemented', 'collaborated'",
    "Added specific details about software applications and user experience",
    "Enhanced team collaboration description with 'cross-functional' and 'high-quality solutions'",
    "Improved education section formatting"
  ],
  "suggestions": [
    "Add quantifiable achievements (e.g., 'Reduced bug reports by 25%')",
    "Include specific technologies and tools used",
    "Add a skills section highlighting technical competencies",
    "Consider adding a professional summary section"
  ],
  "word_count": {
    "original": 15,
    "enhanced": 35
  },
  "readability_score": {
    "original": 3,
    "enhanced": 8
  }
}\`\`\``,
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

        // Validate the response structure
        const validatedResponse = validateEnhancedResume(ans);
        if (!validatedResponse) {
          return new Response(
            JSON.stringify({
              error: "Invalid response structure from Gemini",
              received: ans,
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
    console.error("Unexpected error in enhance-resume route:", error);
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