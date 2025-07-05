import { GoogleGenAI } from "@google/genai";
import dedent from "dedent";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

async function generateText(promptMessage) {
  return await ai.models.generateContentStream({
    model: "gemini-2.0-flash",
    contents: promptMessage,
    config: {
      temperature: 0.5,
      systemInstruction: dedent`
    You are a senior AI assistant with expertise in frontend architecture and React development.

    Your job is to explain what you are building in simple terms — like you're briefing a developer teammate.

     GUIDELINES 
    - Clearly explain what you are building.
    – Start with the title purpose of the project.
    – Mention key components, pages, and state management.
    – Highlight special features (e.g., dark mode, API use, responsiveness).
    – Do NOT include any code, file names, or import paths.
    – Keep the response concise — ideally under 12 lines.
    – Avoid unnecessary commentary, just the plan.
  
`,
    },
  });
}

export default generateText;
