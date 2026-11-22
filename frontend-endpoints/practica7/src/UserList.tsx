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
  // Práctica 7: errores y avisos del borrado (no tapan la lista)
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

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
      .then(({ id }) => fetch(`${api}/user/${id}`, { headers }))
      .then((response) => response.json())
      .then(setMe);
  }, [token]);

  async function borrar(user: User) {
    if (!window.confirm(`¿Seguro que querés borrar a ${user.name}?`)) return;
    setDeleteError(null);
    setMensaje(null);

    const respuesta = await fetch(
      `${import.meta.env.VITE_API_URL}/user/${user.id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await respuesta.json();
    if (!respuesta.ok) {
      // con sfer: 403 "Missing permission: delete_users"
      setDeleteError(data.detail);
      return;
    }
    // Lo sacamos de la lista sin volver a pedirla
    setUsers((anteriores) => anteriores.filter((u) => u.id !== user.id));
    setMensaje(data.msg); // "Usuario borrado con éxito"
  }

  //carroceria
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <h1>Hola, {me?.name}</h1>
      {deleteError && <p className="error">{deleteError}</p>}
      {mensaje && <p className="ok">{mensaje}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} <button onClick={() => borrar(user)}>Borrar</button>
          </li>
        ))}
      </ul>
    </>
  );
}
