import './App.css';
import { Routes, Route } from "react-router";
import Download from './components/Download';
import Home from './components/Home';
import Certificate from './components/Certificate';


function App() {
  return (
   <>
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/download" element={<Download />} />
  <Route path="/certificate" element={<Certificate />} />
</Routes>
   </>
  );
}

export default App;
