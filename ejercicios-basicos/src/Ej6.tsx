// Ejercicio 6 · Filtrado
// Un input que filtra la lista mientras se escribe, sin distinguir
// mayúsculas de minúsculas, y muestra cuántos resultados hay.
import { useState } from "react";

const lenguajes = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Kotlin",
  "Swift",
];

export default function Ej6() {
  const [busqueda, setBusqueda] = useState("");

  // La lista filtrada no es estado: se calcula a partir de la búsqueda
  const resultados = lenguajes.filter((l) =>
    l.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="tarjeta">
      <input
        placeholder="Buscar lenguaje"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <p className="suave">
        {resultados.length} {resultados.length === 1 ? "resultado" : "resultados"}
      </p>
      <ul>
        {resultados.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </div>
  );
}
