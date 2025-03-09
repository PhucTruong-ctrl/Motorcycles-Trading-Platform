import React from "react";
import Header from "./components/Header";

const App = () => {
  return (
    <main className="my-[15px] mx-[25px]">
      <header>
        <Header></Header>
      </header>
      <div className="banner">
        <h1>GEAR UP</h1> <br />
        <h1 className="text-gradient">RIDE ON</h1>
      </div>
    </main>
  );
};

export default App;
