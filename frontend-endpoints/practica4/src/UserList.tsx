import { useEffect, useState } from "react";

// Práctica 4: ampliamos la interfaz. GET /user solo trae id y name, por eso
// roles es opcional (?). GET /user/{id} sí lo trae.
interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  roles?: Role[];
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
        setError(data.detail);
        return;
      }
      setUsers(data);
    });
  }, [token]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    const api = import.meta.env.VITE_API_URL;
    fetch(`${api}/user/me/id`, { headers })
      .then((response) => response.json())
      .then(({ id }) => fetch(`${api}/user/${id}`, { headers })) // ya trae roles
      .then((response) => response.json())
      .then(setMe);
  }, [token]);

  // "ADMIN", o "ADMIN, REGULAR" si tuviera más de uno
  const misRoles = me?.roles?.map((rol) => rol.name).join(", ");

  //carroceria
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <h1>
        Hola, {me?.name}
        {misRoles && ` (${misRoles})`}
      </h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </>
  );
}
