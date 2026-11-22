import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";

interface User {
  id: number;
  name: string;
}

export function UserList({ token }: { token: string }) {
  //bajo capot
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<User | null>(null);

  // Práctica 3: lo que se escribe en el input y lo que se buscó de verdad
  const [texto, setTexto] = useState("");
  const [busqueda, setBusqueda] = useState(""); // "" = lista completa

  useEffect(() => {
    const api = import.meta.env.VITE_API_URL;
    // encodeURIComponent: un "#" sin codificar corta la URL (el navegador lo
    // toma como ancla y no lo manda). Codificado viaja como %23.
    const url = busqueda
      ? `${api}/user/search/${encodeURIComponent(busqueda)}`
      : `${api}/user`;

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (respuesta) => {
      const data = await respuesta.json();
      if (!respuesta.ok) {
        setError(data.detail);
        return;
      }
      setError(null);
      setUsers(data);
    });
  }, [busqueda, token]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    const api = import.meta.env.VITE_API_URL;
    fetch(`${api}/user/me/id`, { headers })
      .then((response) => response.json())
      .then(({ id }) => fetch(`${api}/user/${id}`, { headers }))
      .then((response) => response.json())
      .then(setMe);
  }, [token]);

  function buscar(evento: SubmitEvent) {
    evento.preventDefault();
    setBusqueda(texto.trim());
  }

  function limpiar() {
    setTexto("");
    setBusqueda("");
  }

  //carroceria
  return (
    <>
      <h1>Hola, {me?.name}</h1>

      <form onSubmit={buscar}>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Buscar por nombre"
        />
        <button type="submit">Buscar</button>
        <button type="button" onClick={limpiar}>
          Limpiar
        </button>
      </form>

      {error ? (
        <p className="error">{error}</p>
      ) : busqueda && users.length === 0 ? (
        <p>No hay usuarios que coincidan con "{busqueda}".</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </>
  );
}
