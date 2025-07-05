export default {
  DefaultFile: {
    "/index.html": {
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
     <div id="root"></div>
  </head>
  <body>
  </body>
</html>`,
    },
    "/index.css": {
      code: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
    },
    "/vercel.json": {
      code: `{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
`,
    },
    "/package.json": {
      code: `{
       "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-scripts": "^5.0.0",
    "tailwindcss": "^3.4.1",
    "tailwindcss-animate": "^1.0.7",
    "lucide-react": "latest",
    "react-router-dom": "latest"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
      "@vitejs/plugin-react": "^4.0.0" 
  }
}
`,
    },
    "/tailwind.config.js": {
      code: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.js",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
}
`,
    },
    "/vite.config.js": {
      code: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /.js/,
    exclude: [],
  },
});
`,
    },
  },
};
