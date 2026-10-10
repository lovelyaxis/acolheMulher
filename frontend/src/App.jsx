import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Navigate } from "react-router-dom";
import RedeDeAtendimento from "./pages/RedeDeAtendimento";


export default function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} /><Route path="/rede-de-atendimento" element={<RedeDeAtendimento/>}/>       
      </Routes>
    
  );
}
