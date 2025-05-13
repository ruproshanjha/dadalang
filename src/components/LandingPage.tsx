import { Link } from "react-router-dom";
import StarfieldBackground from "./StarfieldBackground";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden">
      <StarfieldBackground />
      <main className="flex-1 flex flex-col items-center justify-center z-10">
        <div className="flex flex-col items-center">
          <div className="flex items-end gap-4 mb-6">
            {/* দাদাLang with Galada font for Bengali and English */}
            <span
              style={{
                fontFamily: "'Galada', cursive",
                color: "#CB2D6F",
                fontSize: "4rem",
                lineHeight: 1,
                textShadow: "2px 2px 8px #CB2D6F44",
                letterSpacing: "0.05em",
              }}
            >
              দাদা
              <span
                style={{
                  fontFamily: "'Galada', cursive",
                  color: "#14A098",
                  fontSize: "2.6rem",
                  marginLeft: "0.6rem",
                  verticalAlign: "middle",
                  textShadow: "1px 1px 4px #14A09844",
                }}
              >
                Lang
              </span>
            </span>
          </div>
          <p
            style={{
              fontFamily: "'Press Start 2P', monospace",
              color: "#CCCCCC",
              marginBottom: "2.5rem",
              textAlign: "center",
              fontSize: "1.1rem",
              maxWidth: "32rem",
            }}
          >
            Dada bolechhe, code likhbi toh moja hobe! 😎
          </p>
          <div className="flex gap-7">
            <Link
              to="/playground"
              aria-label="Go to Playground"
              className="btn-3d px-8 py-4 rounded font-bold text-lg shadow transition"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "1.2rem",
                background: "#CB2D6F",
                color: "#fff",
                boxShadow: "0 4px 24px #CB2D6F44",
                letterSpacing: "0.04em",
              }}
            >
              Playground
            </Link>
            <Link
              to="/docs"
              aria-label="Go to Documentation"
              className="btn-3d px-8 py-4 rounded font-bold text-lg shadow transition"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "1.2rem",
                background: "#CB2D6F",
                color: "#fff",
                boxShadow: "0 4px 24px #CB2D6F44",
                letterSpacing: "0.04em",
              }}
            >
              Documentation
            </Link>
          </div>
        </div>
      </main>
      <footer className="w-full flex flex-col items-center mb-8 z-10">
        <div
          className="text-[#CCCCCC] text-sm text-center"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          Made with <span className="text-[#CB2D6F]">♥</span> by{" "}
          <span className="font-bold text-[#14A098]">@ruproshnjha</span> from
          the city of joy.
        </div>
      </footer>
    </div>
  );
}
