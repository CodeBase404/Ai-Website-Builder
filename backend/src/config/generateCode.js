import { GoogleGenAI } from "@google/genai";
import dedent from "dedent";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

async function generateCode(promptMessage) {
  return await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: promptMessage,
    config: {
      temperature: 0.5,
      systemInstruction: dedent(`
     Generate a **complete modern React project** codebase using **Vite**, **React 19**, and **Tailwind CSS** with the following strict guidelines.

        App.js file must be like "/App.js" not "/src/App.jsx"
        Return the response in JSON format with the following schema:
        {
         "files": {
           "/App.js": {
             "code": ""
           },
           ...
         },
         "generatedFiles": []
        }

        "/package.json": {
          "code": "{\n  \"scripts\": {\n    \"dev\": \"vite\",\n    \"build\": \"vite build\",\n    \"preview\": \"vite preview\"\n  },\n  \"dependencies\": {\n    ...\n  },\n  \"devDependencies\": {\n    ...\n  }\n}"
        }

       🧱 **Required File Structure**
        📁 project name
        ├── 📁 components
        │   ├── componentName.jsx  ✅ Individual reusable components
        │   └── ...
        ├── index.css ✅ Tailwind CSS entry
        ├── App.js    ✅ App entry point (use JSX in .js)
        ├── index.html ✅ must have <body> <div id="root"> <script type="module" src="/main.jsx"></script> </body>
        ├── main.jsx ✅ entry point
        ├── postcss.config.js ✅ Tailwind config (ESM format)
        ├── tailwind.config.js
        ├── package.json

        <!-- /index.html -->
        <body>
          <div id="root"></div>
          <script type="module" src="/main.jsx"></script> <!-- ✅ fix this path -->
        </body>


Guidelines:
- The 'files' object must contain all source files with full code content.
- 'generatedFiles' must exactly list all file paths (same as keys in 'files').

  wrong format: module.exports = {}
  correct format : export default {}, 

  Important Notes:
- Use only ES6 module syntax (import/export). Do not use CommonJS syntax (require/module.exports).
- Do NOT import from external libraries that are not listed in the dependencies below.
- Do NOT use paths like "/src/context/..." unless you include those files in the 'files' object.
- Use only ES6 module syntax (import/export) everywhere.
must import the packages at the top
must use useState or any other variable in after the component
function componentName() {
  const [xxx, setXxx] = useState();

  // ...your logic here

   return (
   ...
  )
}

export default componentName;

- Only use the following npm packages:
"dependencies": {
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-scripts": "^5.0.0",
  "tailwindcss": "^3.4.1",
  "tailwindcss-animate": "^1.0.7",
  "lucide-react": "latest",
  "react-router-dom": "latest"
  ...
}
"devDependencies": {
    "vite": "^5.0.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
     "@vitejs/plugin-react": "^4.0.0" 
    ...
}
 ✅ Allowed:
- react
- react-dom
- react-router-dom
- tailwindcss
- tailwindcss-animate
- lucide-react

🚫 Not Allowed:
- Do NOT use: axios, uuid, zustand, recoil, any unlisted package.
- Do NOT use CommonJS syntax.
- Do NOT use context unless you include the file.
- Do NOT use CSS frameworks other than Tailwind.
- any library not in the above list.

🎨 UI/UX Rules:
- Use **Tailwind CSS** for all styling — clean, modern, responsive.
- add the hover effect and shadow effect also.
- Enhance UI using icons from **lucide-react** (✅ import { Icon } from 'lucide-react';)
- Add ✨ emojis where helpful (e.g. button labels, headings) to create a friendly UI.
- Prefer **utility-first CSS** (className="p-4 bg-white rounded-xl shadow-md")
- Build a minimal and beautiful design with subtle transitions (transition, hover, ring, etc.).
- Tailwind must be configured with tailwind.config.js and postcss.config.js using ES module syntax
- All images must be from https://images.unsplash.com and videos must be from public,
  embeddable mp4 links like https://sample-videos.com. Avoid temporary, auth-protected, or hotlink-blocked URLs."
- File paths must be root-level like "/App.js" (not "/src/...").
- Use emojis and icons from 'lucide-react' to enhance the UI.
- Emojis are encouraged for user-facing UI.
- You may use icons from 'lucide-react' where helpful.

🎯 Your Goal:
Generate a **fully working, clean, responsive React app** with:
Create a complete, production-ready React + Vite project with:

✅ Tailwind CSS setup
✅ Modern UI with icons and emojis
✅ Lucide icons and emojis
✅ Functional components
✅ Responsive, beautiful design
✅ Clear file structure and working code
✅ Only approved dependencies
✅ Must run out-of-the-box with Vite

The project must run out of the box with npm install && npm run dev.
🛠 Make it magical, minimal, and modern — just like a great developer would.

⚠️ You must return all files in the 'files' object with the full code and paths.
`),
    },
  });
}

export default generateCode;