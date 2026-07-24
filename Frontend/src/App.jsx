import { useState } from "react";

import LoadingScreen from "./components/LoadingScreen";
import DocumentOrganizer from "./components/DocumentOrganizer";

function App() {

  const [loading, setLoading] = useState(true);

  const [remoteConfig, setRemoteConfig] = useState(null);

  const handleComplete = (config) => {

    // console.log("Remote Config:", config);

    setRemoteConfig(config);

    setLoading(false);
  };

  return (
    <>
      {
        loading ?

        <LoadingScreen onComplete={handleComplete} />

        :

        <DocumentOrganizer remoteConfig={remoteConfig} />

      }
    </>
  );
}

export default App;