import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppRoutes from "./routes/appRoutes";

function App() {

  return (
    <>
      <div className="container-fluid g-0">
        <Router>
         <AppRoutes/>
        </Router>
      </div>
    </>
  );
}

export default App;
