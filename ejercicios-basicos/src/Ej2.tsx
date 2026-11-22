// Ejercicio 2 · useState
// Contador de 0 a 10 con restar, sumar y reiniciar. Nunca se sale del rango.
// Extra: cada botón se deshabilita al llegar a su límite.
import { useState } from "react";

const MIN = 0;
const MAX = 10;

export default function Ej2() {
  const [valor, setValor] = useState(0);

  function restar() {
    if (valor > MIN) setValor(valor - 1);
  }

  function sumar() {
    if (valor < MAX) setValor(valor + 1);
  }

  return (
    <div className="tarjeta">
      <p className="grande">{valor}</p>
      <div className="fila">
        <button onClick={restar} disabled={valor === MIN}>
          −
        </button>
        <button onClick={sumar} disabled={valor === MAX}>
          +
        </button>
        <button onClick={() => setValor(0)}>Reiniciar</button>
      </div>
      {valor === MAX && <p className="suave">Llegaste al máximo</p>}
    </div>
  );
}
