// Ejercicio 4 · Inputs controlados
// Se escriben grados Celsius y debajo se ve el equivalente en Fahrenheit.
// F = C × 9/5 + 32. Extra: si supera los 30 °C, "Hace calor".
import { useState } from "react";

export default function Ej4() {
  const [celsius, setCelsius] = useState("");

  // Fahrenheit no tiene estado propio: se calcula en cada renderizado
  const c = Number(celsius); // el valor del input es texto
  const fahrenheit = (c * 9) / 5 + 32;

  return (
    <div className="tarjeta">
      <input
        type="number"
        placeholder="Grados Celsius"
        value={celsius}
        onChange={(e) => setCelsius(e.target.value)}
      />
      {celsius !== "" && (
        <>
          <p className="grande">{fahrenheit.toFixed(1)} °F</p>
          {c > 30 && <p>Hace calor</p>}
        </>
      )}
    </div>
  );
}
