import React, { useEffect, useState } from "react";

function Home() {

  const [backendData, setBackendData] = useState([{}]);

  useEffect(() => {
    fetch("/test").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, []);

  return (
    <div>This is home</div>
  );
}

export default Home;