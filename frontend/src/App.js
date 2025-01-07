import React from "react";
import ScanComponent from "./components/ScanComponent";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl text-center mt-4 text-blue-400">URL Analysis</h1>
      <ScanComponent />
    </div>
  );
}

export default App;
