import "./App.css";
import React from "react";
import NavBar from "./common/NavBar";
import Router from "./routes/Router";
function App() {
  
  return (
    <div className="App">
      <NavBar />
      <header className="App-header">
          <Router />
      </header>
    </div>
  );
}

export default App;
