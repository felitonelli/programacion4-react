import { useState } from "react";
import type { SubmitEvent } from "react";
import { UserList } from "./UserList";

export default function App() {
  //bajo capot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  // Paso 7: el token se guarda en localStorage para que sobreviva al F5
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  async function handleSubmit(evento: SubmitEvent) {
    evento.preventDefault();
    setError(null);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.detail);
      return;
    }
    localStorage.setItem("token", data.token);
    setToken(data.token);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  //carroceria
  if (token) {
    return (
      <>
        <button onClick={logout}>Salir</button>
        <UserList token={token} />
      </>
    );
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Ingresar</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
