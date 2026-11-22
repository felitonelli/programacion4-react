import { useState } from "react";
import Ej1 from "./Ej1";
import Ej2 from "./Ej2";
import Ej3 from "./Ej3";
import Ej4 from "./Ej4";
import Ej5 from "./Ej5";
import Ej6 from "./Ej6";
import Ej7 from "./Ej7";

// Un menú para ver cada ejercicio sin tener que tocar el código
const ejercicios = [
  { titulo: "1. Tarjetas de producto", componente: <Ej1 /> },
  { titulo: "2. Contador con límites", componente: <Ej2 /> },
  { titulo: "3. Mostrar y ocultar", componente: <Ej3 /> },
  { titulo: "4. Conversor de temperatura", componente: <Ej4 /> },
  { titulo: "5. Lista de compras", componente: <Ej5 /> },
  { titulo: "6. Buscador", componente: <Ej6 /> },
  { titulo: "7. Tipar con TypeScript", componente: <Ej7 /> },
];

export default function App() {
  const [actual, setActual] = useState(0);

  return (
    <>
      <h1>React desde cero · Ejercicios</h1>
      <nav>
        {ejercicios.map((ej, i) => (
          <button
            key={ej.titulo}
            className={i === actual ? "activo" : ""}
            onClick={() => setActual(i)}
          >
            {ej.titulo}
          </button>
        ))}
      </nav>
      <h2>{ejercicios[actual].titulo}</h2>
      {ejercicios[actual].componente}
    </>
  );
}
