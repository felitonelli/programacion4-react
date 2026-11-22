// Ejercicio 5 · Listas y estado
// Un input y "Agregar" suma el texto a la lista; cada ítem se puede eliminar.
// No se agregan ítems vacíos y, si la lista está vacía, se avisa.
import { useState } from "react";
import type { SubmitEvent } from "react";

interface Item {
  id: number;
  texto: string;
}

export default function Ej5() {
  const [texto, setTexto] = useState("");
  const [items, setItems] = useState<Item[]>([]);

  function agregar(evento: SubmitEvent) {
    evento.preventDefault();
    const limpio = texto.trim();
    if (limpio === "") return; // nada de ítems vacíos
    // Nunca push: un array nuevo con lo anterior + el nuevo
    setItems([...items, { id: Date.now(), texto: limpio }]);
    setTexto("");
  }

  function eliminar(id: number) {
    setItems(items.filter((i) => i.id !== id));
  }

  return (
    <div className="tarjeta">
      <form className="fila" onSubmit={agregar}>
        <input
          placeholder="Ej: yerba"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <button type="submit">Agregar</button>
      </form>

      {items.length === 0 ? (
        <p className="suave">No hay nada para comprar</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.texto}{" "}
              <button onClick={() => eliminar(item.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
