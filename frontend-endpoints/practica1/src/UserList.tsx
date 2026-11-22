import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
}

// Práctica 1: lo que devuelve GET /user/{id}
interface UserDetail extends User {
  age: number;
  email: string;
  country: { id: number; name: string } | null;
  roles: { id: number; name: string }[];
}

export function UserList({ token }: { token: string }) {
  //bajo capot
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<User | null>(null);

  // Práctica 1: id elegido y su detalle
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

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

  // Práctica 1: cada vez que cambia el id elegido, se pide el detalle
  useEffect(() => {
    if (selectedId === null) return;
    let ignorar = false; // si hacen clic rápido en otro, descartamos la respuesta vieja

    fetch(`${import.meta.env.VITE_API_URL}/user/${selectedId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (respuesta) => {
      const data = await respuesta.json();
      if (ignorar) return;
      if (!respuesta.ok) {
        setDetailError(data.detail);
        return;
      }
      setDetail(data);
    });

    return () => {
      ignorar = true;
    };
  }, [selectedId, token]);

  function elegir(id: number) {
    setDetail(null);
    setDetailError(null);
    setSelectedId(id);
  }

  //carroceria
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <h1>Hola, {me?.name}</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <button className="link" onClick={() => elegir(user.id)}>
              {user.name}
            </button>
          </li>
        ))}
      </ul>

      {detailError && <p className="error">{detailError}</p>}
      {selectedId !== null && !detail && !detailError && <p>Cargando...</p>}
      {detail && (
        <div className="detalle">
          <h2>{detail.name}</h2>
          <p>Email: {detail.email}</p>
          <p>Edad: {detail.age}</p>
          <p>País: {detail.country?.name ?? "Sin país"}</p>
          <p>
            Roles:{" "}
            {detail.roles.length > 0
              ? detail.roles.map((rol) => rol.name).join(", ")
              : "Sin roles"}
          </p>
        </div>
      )}
    </>
  );
}
