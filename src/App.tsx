import { useEffect, useState } from "react";
import { Footer, Navbar, type Route } from "./components/Layout";
import Home from "./pages/Home";
import Technology from "./pages/Technology";
import Fleet from "./pages/Fleet";
import Pricing from "./pages/Pricing";
import Safety from "./pages/Safety";
import Dashboard from "./pages/Dashboard";

const ROUTES: Route[] = ["home", "technology", "fleet", "pricing", "safety", "dashboard"];

function fromHash(): Route {
  const h = window.location.hash.replace("#/", "").replace("#", "") as Route;
  return ROUTES.includes(h) ? h : "home";
}

export default function App() {
  const [route, setRoute] = useState<Route>(fromHash);

  useEffect(() => {
    const onHash = () => setRoute(fromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (r: Route) => {
    window.location.hash = "/" + r;
    setRoute(r);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <Navbar route={route} go={go} />
      {route === "home" && <Home go={go} />}
      {route === "technology" && <Technology />}
      {route === "fleet" && <Fleet go={go} />}
      {route === "pricing" && <Pricing go={go} />}
      {route === "safety" && <Safety />}
      {route === "dashboard" && <Dashboard />}
      <Footer go={go} />
    </div>
  );
}
