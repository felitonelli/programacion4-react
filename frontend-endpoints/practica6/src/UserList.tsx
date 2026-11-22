import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
}

export function UserList({ token }: { token: string }) {
  //bajo capot
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<User | null>(null);
  // Práctica 6: qué lista estamos viendo
  const [soloMayores, setSoloMayores] = useState(false);

  useEffect(() => {
    const api = import.meta.env.VITE_API_URL;
    const url = soloMayores ? `${api}/user_mayores` : `${api}/user`;

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (respuesta) => {
      const data = await respuesta.json();
      if (!respuesta.ok) {
        setError(data.detail);
        return;
      }
      setUsers(data);
    });
  }, [soloMayores, token]); // al cambiar el botón, se vuelve a pedir

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    const api = import.meta.env.VITE_API_URL;
    fetch(`${api}/user/me/id`, { headers })
      .then((response) => response.json())
      .then(({ id }) => fetch(`${api}/user/${id}`, { headers }))
      .then((response) => response.json())
      .then(setMe);
  }, [token]);

  //carroceria
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <h1>Hola, {me?.name}</h1>
      <p>
        <button onClick={() => setSoloMayores(!soloMayores)}>
          {soloMayores ? "Ver todos" : "Ver solo mayores"}
        </button>
      </p>
      <h2>
        {soloMayores ? "Solo mayores" : "Todos"} ({users.length})
      </h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </>
  );
}
