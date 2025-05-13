import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  return (
    <nav
      className="w-full flex justify-between items-center px-8 py-4 bg-transparent fixed top-0 left-0 z-50"
      style={{ height: "64px" }}
    >
      <Link to="/" className="flex items-end gap-2 select-none">
        <span
          style={{
            fontFamily: "'Galada', cursive",
            color: "#CB2D6F",
            fontSize: "2.2rem",
            lineHeight: 1,
            textShadow: "1px 1px 4px #CB2D6F44",
            letterSpacing: "0.04em",
          }}
        >
          দাদা
        </span>
        <span
          style={{
            fontFamily: "'Galada', cursive",
            color: "#14A098",
            fontSize: "1.6rem",
            marginLeft: "0.3rem",
            verticalAlign: "middle",
            fontStyle: "italic",
            textShadow: "1px 1px 2px #14A09844",
          }}
        >
          Lang
        </span>
      </Link>
      <div
        className="flex gap-8 text-lg"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        <Link
          to="/playground"
          aria-current={
            location.pathname === "/playground" ? "page" : undefined
          }
          className={`transition ${
            location.pathname === "/playground"
              ? "text-[#CB2D6F]"
              : "text-[#CCCCCC] hover:text-[#CB2D6F]"
          }`}
        >
          Playground
        </Link>
        <Link
          to="/docs"
          aria-current={location.pathname === "/docs" ? "page" : undefined}
          className={`transition ${
            location.pathname === "/docs"
              ? "text-[#14A098]"
              : "text-[#CCCCCC] hover:text-[#14A098]"
          }`}
        >
          Docs
        </Link>
      </div>
    </nav>
  );
}
