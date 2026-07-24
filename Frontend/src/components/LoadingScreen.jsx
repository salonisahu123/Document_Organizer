import React, { useEffect, useState } from "react";
import { fetchRemoteConfig } from "../api/api";


const LoadingScreen = ({ onComplete }) => {

  const [progress, setProgress] = useState(0);


useEffect(() => {
  let mounted = true;

const loadConfiguration = async () => {
  try {

    const response = await fetchRemoteConfig();
    const config = response.data;

    if (!mounted) return;

    if (!config) {
      alert("Unable to load Remote Configuration");
      return;
    }

    let value = 0;

    const interval = setInterval(() => {
      value++;

      setProgress(value);

      if (value >= 100) {
        clearInterval(interval);

        setTimeout(() => {
          onComplete(config);
        }, 300);
      }
    }, 20);

  } catch (err) {

    console.error("Remote Config Error:", err);

    alert("Failed to load Remote Configuration");

  }
};
  loadConfiguration();

  return () => {
    mounted = false;
  };
}, [onComplete]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#faf0f4] relative select-none">


      {/* Icon */}
      <div className="mb-6">

        <div className="flex items-center justify-center">

          <div className="relative p-3 bg-white rounded-2xl shadow-sm border border-[#f3d2df]">

            <img
              src="../src/assets/spashimage.png"
              alt="OCR PDF Flow"
              className="h-32 w-auto object-contain"
            />

          </div>

        </div>

      </div>


      {/* Title */}
      <h1 className="text-3xl font-bold text-[#701235] tracking-wide">
        NextViz Document Organizer
      </h1>


      {/* Subtitle */}
      <p className="mt-3 text-lg font-semibold text-[#8c2d52]">
        One moment as we take you to Organizer...
      </p>



      {/* Progress */}

      <div className="mt-8 w-[400px]">


        {/* Track */}
        <div className="h-3 bg-[#f5dce6] border border-[#ebd0dd] rounded-full overflow-hidden shadow-inner">


          {/* Fill */}
          <div
            className="h-full bg-[#701235] transition-all duration-100 ease-linear rounded-full"
            style={{
              width:`${progress}%`
            }}
          />


        </div>


        {/* Percentage */}
        <p className="text-center mt-2.5 font-bold text-[#701235]">
          {progress}%
        </p>


      </div>



      {/* Footer */}

      <div className="absolute bottom-5 right-8 text-xs tracking-wider text-[#8c2d52]">

        POWERED BY

        <span className="font-extrabold text-[#701235] ml-1 text-sm block sm:inline">
          NEXTIN GLOBAL LABS PVT. LTD.
        </span>

      </div>


    </div>
  );
};


export default LoadingScreen;