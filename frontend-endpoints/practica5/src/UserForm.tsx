import { useState } from "react";
import type { SubmitEvent } from "react";

interface Props {
  token: string;
  // Cuando el alta sale bien, le avisamos a UserList para que sume el usuario
  onCreated: (user: { id: number; name: string }) => void;
}

export function UserForm({ token, onCreated }: Props) {
  //bajo capot
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryId, setCountryId] = useState("1");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(evento: SubmitEvent) {
    evento.preventDefault();
    setMensaje(null);
    setError(null);

    const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        age: Number(age), // los inputs devuelven texto: la API espera número
        email,
        password,
        country_id: Number(countryId),
      }),
    });
    // Si la API explota (500, ej. email repetido) no responde JSON
    const data = await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
      // 403 con sfer: "Missing permission: write_users"
      if (typeof data?.detail === "string") setError(data.detail);
      else if (Array.isArray(data?.detail)) setError(data.detail[0].msg); // 422
      else setError(`Error ${respuesta.status} al crear el usuario`);
      return;
    }

    onCreated({ id: data.id, name });
    setMensaje(`Usuario creado con id ${data.id}`);
    setName("");
    setAge("");
    setEmail("");
    setPassword("");
    setCountryId("1");
  }

  //carroceria
  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Edad"
        min={0}
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        minLength={4}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {/* No hay endpoint de países: las opciones van a mano */}
      <select value={countryId} onChange={(e) => setCountryId(e.target.value)}>
        <option value="1">Argentina</option>
        <option value="2">Brasil</option>
      </select>
      <button type="submit">Crear usuario</button>
      {mensaje && <p className="ok">{mensaje}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
}
