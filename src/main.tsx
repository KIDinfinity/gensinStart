import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css";
import App from './App';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import Home from "./pages/game/Home/Home";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
    </React.StrictMode>
)