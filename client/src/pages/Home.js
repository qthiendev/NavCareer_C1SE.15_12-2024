import React, { useEffect, useState } from "react";
import './Home.css';

function Home() {

  const [backendData, setBackendData] = useState([{}]);

  useEffect(() => {
    fetch("/").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, []);

  return (
    <div>
      This is home
      <a href="/signin">Signin</a>
      </div>

  );
}

export default Home;