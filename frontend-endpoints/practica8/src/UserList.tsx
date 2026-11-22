import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
}

interface Props {
  token: string;
  // Práctica 8: la función que cierra la sesión vive en App;
  // UserList la recibe por prop para avisarle cuando hay un 401.
  onUnauthorized: () => void;
}

export function UserList({ token, onUnauthorized }: Props) {
  //bajo capot
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<User | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (respuesta) => {
      if (respuesta.status === 401) {
        onUnauthorized(); // token vencido o adulterado → al login
        return;
      }
      const data = await respuesta.json();
      if (!respuesta.ok) {
        setError(data.detail);
        return;
      }
      setUsers(data);
    });
  }, [token, onUnauthorized]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    const api = import.meta.env.VITE_API_URL;
    fetch(`${api}/user/me/id`, { headers })
      .then(async (respuesta) => {
        if (respuesta.status === 401) {
          onUnauthorized();
          return;
        }
        const { id } = await respuesta.json();
        const respuestaYo = await fetch(`${api}/user/${id}`, { headers });
        if (respuestaYo.status === 401) {
          onUnauthorized();
          return;
        }
        if (respuestaYo.ok) setMe(await respuestaYo.json());
      });
  }, [token, onUnauthorized]);

  //carroceria
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <h1>Hola, {me?.name}</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </>
  );
}
