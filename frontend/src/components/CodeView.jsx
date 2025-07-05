import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import {
  Code,
  Eye,
  File,
  FolderDown,
  Loader2,
  Moon,
  Rocket,
  Sun,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import LookUp from "../utils/LookUp";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import SandpackSync from "./SandpackSync ";
import isEqual from "lodash.isequal";
import axiosClient from "../utils/axiosClient";

function CodeView({
  prompt,
  chatId,
  initialFiles = {},
  sandboxFiles,
  setSandboxFiles,
}) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const [showPreviewMsg, setShowPreviewMsg] = useState(false);
  const [previewCountdown, setPreviewCountdown] = useState(12);
  const [deploying, setDeploying] = useState(false);
  const [istheme, setTheme] = useState(true);

  const handleSendPrompt = async () => {
    if (!prompt) return;

    setLoading(true);
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/chat/code/${chatId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ message: prompt }),
          signal,
        }
      );

      const data = await response.json();

      if (data.success && data.files) {
        const sandpackFiles = {};

        data.files.forEach(({ path, content }) => {
          sandpackFiles[path] = { code: content };
        });

        const merged = {
          ...sandboxFiles,
          ...sandpackFiles,
        };

        if (!isEqual(sandboxFiles, merged)) {
          setSandboxFiles(merged);
        }
      } else {
        console.warn("Unexpected response format:", data);
      }
    } catch (err) {
      console.error("Error during code generation:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSandboxFiles(initialFiles);
  }, [initialFiles]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (prompt) handleSendPrompt();
    }, 500);

    return () => clearTimeout(timeout);
  }, [prompt]);

  useEffect(() => {
    if (activeTab === "preview") {
      setShowPreviewMsg(true);
      setPreviewCountdown(12);

      const timer = setTimeout(() => {
        setShowPreviewMsg(false);
      }, 12000);

      const countdownInterval = setInterval(() => {
        setPreviewCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setShowPreviewMsg(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
      };
    }
  }, [activeTab]);

  const allFiles = useMemo(
    () => ({
      ...LookUp?.DefaultFile,
      ...sandboxFiles,
    }),
    [sandboxFiles]
  );

  const handleDownloadAll = () => {
    const zip = new JSZip();

    Object.entries(allFiles).forEach(([path, { code }]) => {
      zip.file(path.replace(/^\//, ""), code);
    });

    zip.generateAsync({ type: "blob" }).then((blob) => {
      saveAs(blob, "project.zip");
    });
  };

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      const files = Object.entries(allFiles).map(([path, { code }]) => ({
        path,
        content: code,
      }));

      const res = await axiosClient.post("/deploy", { files });

      if (res.data.success && res.data.url) {
        alert("✅ Your site is live!");
        window.open(res.data.url, "_blank");
      } else {
        alert("❌ Failed to deploy. Check console");
        console.log(res.data);
      }
    } catch (err) {
      console.error("Deployment Error:", err);
      alert("❌ Error during deployment.");
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b border-white/10  p-2 pr-5 h-[7%]">
        <div className="flex gap-1 mr-1">
          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center px-2 md:px-3 py-1..5 rounded-md  text-[10px] md:text-sm transition-colors ${
              activeTab === "code"
                ? "bg-blue-600/30 text-white font-bold shadow-sm cursor-default"
                : "text-gray-600 hover:text-yellow-500 cursor-pointer"
            }`}
          >
            <Code className="h-3 w-3 md:h-4.5 md:w-4.5 mr-1 md:mr-2" />
            Code
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center px-2 md:px-3 py-1.5 rounded-md text-[10px] md:text-sm transition-colors ${
              activeTab === "preview"
                ? "bg-blue-600/30 text-white font-bold shadow-sm cursor-default"
                : "text-gray-600 hover:text-yellow-500 cursor-pointer "
            }`}
          >
            <Eye className="h-3 w-3 md:h-4.5 md:w-4.5 mr-1 md:mr-2" />
            Preview
          </button>
        </div>
        <div className="flex space-x-2">
          <button   onClick={() => setTheme((prev) => !prev)}
            className="flex items-center active:scale-95 hover:bg-black cursor-pointer px-1.5 md:px-2 py-0 md:py-1.5 rounded-md text-white font-medium text-xs shadow shadow-gray-300"
          >
            {istheme ? <Moon className="h-3 w-3 md:h-4.5 md:w-4.5"/> :<Sun className="h-3 w-3 md:h-4.5 md:w-4.5 text-yellow-400"/>} 
          </button>
          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-1 active:scale-95 hover:bg-pink-700/80 cursor-pointer px-2 py-1.5 rounded-md bg-pink-700 text-white font-medium text-[8px] md:text-xs shadow-sm"
          >
            <FolderDown className="h-3 w-3 md:h-4.5 md:w-4.5"/> <span>Export</span>
          </button>
          <button
            onClick={handleDeploy}
            disabled={deploying}
            className={`flex items-center gap-1 active:scale-95 hover:bg-blue-500/80 cursor-pointer px-2 py-2 rounded-md bg-blue-500 font-bold text-white text-[8px] md:text-xs shadow-sm   ${
              deploying
                ? "bg-blue-400 cursor-not-allowed"
                : "hover:bg-blue-500/80 bg-blue-500"
            }`}
          >
            {deploying ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Deploying...</span>
              </>
            ) : (
              <>
                <Rocket className="h-3 w-3 md:h-4.5 md:w-4.5" />
                <span>Deploy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <SandpackProvider
        template="react"
        theme={istheme ? "dark" : "light"}
        files={allFiles}
        options={{
          showNavigator: true,
          showLineNumbers: true,
          showInlineErrors: true,
          wrapContent: true,
          editorHeight: "100%",
          layout: "preview",
          showConsole: true,
          showConsoleButton: true,
          externalResources: ["https://cdn.tailwindcss.com"],
        }}
        customSetup={{
          dependencies: {
            ...LookUp?.Dependencies,
          },
        }}
      >
        <SandpackSync activeTab={activeTab} />

        <SandpackLayout className="rounded-b-2xl!">
          {activeTab === "code" &&
            (loading ? (
              <div className="p-4 text-green-500 h-[82.8vh] lg:h-[86.5vh] w-full flex flex-col gap-3 items-center justify-center  text-xl animate-pulse">
                <File size={50} />
                <div className="flex items-center gap-1">
                  {" "}
                  <Loader2 className="animate-spin mt-0.5" size={25} /> Your
                  files will aprear here
                </div>
              </div>
            ) : (
              <>
                <SandpackFileExplorer className="h-[22vh]! md:h-[83.2vh]! lg:h-[87vh]!" />
                <SandpackCodeEditor
                  showLineNumbers
                  wrapContent
                  showTabs={false}
                  closableTabs
                  className="h-[61.5vh]! md:h-[83.2vh]! lg:h-[87vh]!"
                />
              </>
            ))}

          {activeTab === "preview" &&
            (loading ? (
              <div className="p-4 text-yellow-500 h-[80.5vh] lg:h-[86vh] w-full flex flex-col gap-3 items-center justify-center  text-xl animate-pulse">
                <Zap size={50} />
                <div> Your preview will aprear here</div>
              </div>
            ) : (
              <div className="h-[83.2vh]! lg:h-[87.2vh]! w-full">
                {showPreviewMsg && (
                  <div className="absolute inset-0 bg-black/80 z-10 flex items-center justify-center text-yellow-400 text-lg font-semibold animate-fade">
                    ⏳ Building preview, please wait... {previewCountdown}s
                  </div>
                )}
                <SandpackPreview className="h-full" showNavigator={true} />
              </div>
            ))}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}

export default CodeView;
