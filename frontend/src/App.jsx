import React, { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    const res = await fetch("http://localhost:4000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  const handleLogin = async () => {
    const res = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      setMessage("Logged in successfully!");
    } else {
      setMessage(data.message);
    }
  };

  const getProtectedData = async () => {
    const res = await fetch("http://localhost:4000/protected", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="App">
      <h1>JWT Authentication</h1>

      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>

      {token && (
        <div>
          <h3>Token:</h3>
          <p>{token}</p>
          <button onClick={getProtectedData}>Get Protected Data</button>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
