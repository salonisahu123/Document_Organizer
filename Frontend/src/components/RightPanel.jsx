import React from "react";

const RightPanel = ({
  pageInfo,
  folderName,
  filesProcessed,
  onClassify,
  onNext,
  onPrevious,
  onSkip,
}) => {
  const categories = [
    { name: "Tender Application", color: "bg-pink-100 hover:bg-pink-200 text-pink-900 border border-pink-200" },
    { name: "Reservation Letter", color: "bg-pink-100 hover:bg-pink-200 text-pink-900 border border-pink-200" },
    { name: "Agreement", color: "bg-pink-100 hover:bg-pink-200 text-pink-900 border border-pink-200" },
    { name: "Allotment Letter", color: "bg-pink-100 hover:bg-pink-200 text-pink-900 border border-pink-200" },
    { name: "Possession Letter", color: "bg-pink-100 hover:bg-pink-200 text-pink-900 border border-pink-200" },
    { name: "Site Plan", color: "bg-pink-100 hover:bg-pink-200 text-pink-900 border border-pink-200" },
    { name: "Registered Lease Deed", color: "bg-pink-100 hover:bg-pink-200 text-pink-900 border border-pink-200" },
    { name: "Transfer Letter", color: "bg-pink-100 hover:bg-pink-200 text-pink-900 border border-pink-200" },
    { name: "Registered Renewal", color: "bg-pink-100 hover:bg-pink-200 text-pink-900 border border-pink-200" },
    { name: "Registered Free Hold", color: "bg-pink-100 hover:bg-pink-200 text-pink-900 border border-pink-200" },
    { name: "Mortgage - Sale NOC", color: "bg-pink-100 hover:bg-pink-200 text-pink-900 border border-pink-200" },
    { name: "Receipts", color: "bg-pink-100 hover:bg-pink-200 text-pink-900 border border-pink-200" },
    { name: "Other", color: "bg-pink-100 hover:bg-pink-200 text-pink-900 border border-pink-200" },
    { name: "Blank", color: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200" },
  ];

  return (
    <aside className="w-80 bg-[#fdf2f8] rounded-2xl border border-pink-200/80 shadow-md p-5 flex flex-col justify-between text-slate-800">

      <div>

        {/* Header */}
        <div className="mb-5 bg-white/80 backdrop-blur-sm p-3.5 rounded-xl border border-pink-200/60 shadow-sm">

          <div className="flex justify-between text-xs font-semibold text-pink-700">
            <span>
              Page {pageInfo.current} / {pageInfo.total}
            </span>
          </div>

          <div className="flex justify-between items-center mt-2">

            <span className="text-slate-600 text-sm font-medium">
              Files Processed
            </span>

            <span className="text-2xl font-bold text-[#801446]">
              {filesProcessed}
            </span>

          </div>

          <p className="text-xs text-slate-400 mt-1.5 truncate">
            {folderName}
          </p>

        </div>

        {/* Navigation */}
        <div className="grid grid-cols-3 gap-2 mb-5">

          <button
            onClick={onPrevious}
            className="bg-white hover:bg-pink-50 text-slate-700 rounded-lg py-2 text-xs font-semibold border border-pink-200 transition active:scale-95 shadow-sm"
          >
            Previous
          </button>

          <button
            onClick={onNext}
            className="bg-[#801446] hover:bg-[#6b103a] text-white rounded-lg py-2 text-xs font-semibold shadow-md transition active:scale-95"
          >
            Next
          </button>

          <button
            onClick={onSkip}
            className="bg-white hover:bg-slate-100 text-slate-600 rounded-lg py-2 text-xs font-medium border border-slate-200 transition active:scale-95 shadow-sm"
          >
            Skip
          </button>

        </div>

        <hr className="border-pink-200/60 mb-5" />

        <h3 className="font-bold text-[#801446] text-sm">
          Document Classification
        </h3>

        <p className="text-xs text-slate-500 mb-3.5">
          Select a category for the current document.
        </p>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-2 max-h-[365px] overflow-y-auto pr-1">

          {categories.map((item) => (
            <button
              key={item.name}
              onClick={() => onClassify(item.name)}
              className={`${item.color} h-11 rounded-lg text-xs font-medium transition duration-150 active:scale-95 px-2.5 text-center flex items-center justify-center leading-tight shadow-sm`}
            >
              {item.name}
            </button>
          ))}

        </div>

      </div>

      {/* Footer */}
      <div className="mt-5 border-t border-pink-200/60 pt-2 text-center">

        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
          Powered By
        </p>

        <h4 className="text-xs font-bold text-[#801446] tracking-wide mt-0.5">
          NEXTIN GLOBAL LABS PVT. LTD.
        </h4>

      </div>

    </aside>
  );
};

export default RightPanel;