import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Playground from "./components/Playground";
import Documentation from "./components/Documentation";

const App: React.FC = () => (
  <div className="app-root flex flex-col min-h-screen">
    <Navbar />
    <div className="flex-1">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </div>
  </div>
);

export default App;
