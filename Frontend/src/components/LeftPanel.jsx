import React from "react";
import { RotateCcw } from "lucide-react";

const LeftPanel = ({
  inputFolder,
  outputFolder,
  setInputFolder,
  setOutputFolder,
  onStartProcessing,
  onResetAll,
}) => {
  // Browse Input Folder
  const handleBrowseInput = async () => {
    try {
      const folder = await window.electronAPI.selectDirectory();

      if (folder) {
        setInputFolder(folder);
      }
    } catch (error) {
      console.error("Input Folder Error:", error);
    }
  };

  // Browse Output Folder
  const handleBrowseOutput = async () => {
    try {
      const folder = await window.electronAPI.selectDirectory();

      if (folder) {
        setOutputFolder(folder);
      }
    } catch (error) {
      console.error("Output Folder Error:", error);
    }
  };

  return (
    <aside className="w-72 h-full bg-[#fdf2f8] rounded-2xl shadow-md border border-pink-200/80 p-5 flex flex-col justify-between text-slate-800">

      <div>

        <h2 className="text-lg font-bold text-[#801446]">
          Get Started - Load Folder 
        </h2>

        <p className="text-xs text-slate-500 mt-1 mb-6 truncate">
          use below settings to load your input and output folders. Once both are selected, click "Start Processing" to begin organizing your documents.
        </p>

        {/* Input Folder */}

        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Input Folder
          </label>

          <div className="flex gap-2">

            <input
              type="text"
              readOnly
              value={inputFolder}
              placeholder="Path Folder"
              className="flex-1 border border-pink-200 rounded-lg px-3 py-2 text-xs bg-white/80 text-slate-700 placeholder-slate-400 outline-none"
            />

            <button
              onClick={handleBrowseInput}
              className="bg-[#801446] hover:bg-[#6b103a] text-white px-3.5 rounded-lg text-xs font-medium transition shadow-sm"
            >
              Browse
            </button>

          </div>

        </div>

        {/* Output Folder */}

        <div className="mb-8">

          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Output Folder
          </label>

          <div className="flex gap-2">

            <input
              type="text"
              readOnly
              value={outputFolder}
              placeholder="Path Folder"
              className="flex-1 border border-pink-200 rounded-lg px-3 py-2 text-xs bg-white/80 text-slate-700 placeholder-slate-400 outline-none"
            />

            <button
              onClick={handleBrowseOutput}
              className="bg-[#801446] hover:bg-[#6b103a] text-white px-3.5 rounded-lg text-xs font-medium transition shadow-sm"
            >
              Browse
            </button>

          </div>

        </div>

        {/* Start Button */}

        <button
          onClick={onStartProcessing}
          disabled={!inputFolder || !outputFolder}
          className={`w-full py-2.5 rounded-xl font-semibold text-xs tracking-wide transition shadow-md ${
            inputFolder && outputFolder
              ? "bg-[#801446] hover:bg-[#6b103a] text-white"
              : "bg-pink-100 text-pink-300 border border-pink-200/60 cursor-not-allowed shadow-none"
          }`}
        >
          Start Processing
        </button>

      </div>

      {/* Reset */}

      <div className="flex justify-end mt-6">

        <button
          onClick={onResetAll}
          title="Reset"
          className="w-9 h-9 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-200 flex items-center justify-center transition shadow-sm"
        >
          <RotateCcw size={16} />
        </button>

      </div>

    </aside>
  );
};

export default LeftPanel;