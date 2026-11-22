import { useEffect, useState } from "react";
import { UserForm } from "./UserForm";

interface User {
  id: number;
  name: string;
}

export function UserList({ token }: { token: string }) {
  //bajo capot
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<User | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (respuesta) => {
      const data = await respuesta.json();
      if (!respuesta.ok) {
        setError(data.detail); // 401, 403…: viene un objeto { detail }
        return;
      }
      setUsers(data); // 200: recién acá es una lista
    });
  }, [token]);

  // Paso 6: ¿quién soy? → /user/me/id y después /user/{id}
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    const api = import.meta.env.VITE_API_URL;
    fetch(`${api}/user/me/id`, { headers })
      .then((response) => response.json())
      .then(({ id }) => fetch(`${api}/user/${id}`, { headers }))
      .then((response) => response.json())
      .then(setMe);
  }, [token]);

  // Práctica 5: el alta salió bien → lo sumamos a la lista sin volver a pedirla
  function agregarUsuario(user: User) {
    setUsers((anteriores) => [...anteriores, user]);
  }

  //carroceria
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <h1>Hola, {me?.name}</h1>
      <UserForm token={token} onCreated={agregarUsuario} />
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </>
  );
}
