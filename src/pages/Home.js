import React from "react";
import "../styles/custom.css";
import Hero from "../components/Home/Hero";
import Campaign from "../components/Home/Campaign";

function Home() {
  return (
    <section style={{ marginTop: "105px",backgroundColor: '#fff' }}>
      <Hero />
      <Campaign />
    </section>
  );
}

export default Home;
