import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
}

export function UserList({ token }: { token: string }) {
  //bajo capot
  const [users, setUsers] = useState<User[]>([]);
  const [me, setMe] = useState<User | null>(null);
  // Práctica 2: dos estados más
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Para probar el error: cambien /user por /usr → aparece "Not Found".
    // Para ver el "Cargando...": en Network pongan la velocidad en Slow 4G.
    fetch(`${import.meta.env.VITE_API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (respuesta) => {
        const data = await respuesta.json();
        if (!respuesta.ok) {
          setError(data.detail); // 401, 403, 404…: viene { detail }
          return;
        }
        setUsers(data);
      })
      .catch(() => {
        // fetch solo falla si no hay conexión (API apagada, URL mal escrita…)
        setError("No se pudo conectar con la API");
      })
      .finally(() => setLoading(false)); // salga bien o mal, terminó de cargar
  }, [token]);

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
  return (
    <>
      <h1>Hola, {me?.name}</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="error">{error}</p>
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
