import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Websocket from "./components/Websocket";
import RegisterPage from "./pages/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Websocket />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
