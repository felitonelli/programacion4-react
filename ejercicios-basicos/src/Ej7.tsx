// Ejercicio 7 · TypeScript
// El Producto del ejercicio 1 con una interface ProductoProps y una prop
// opcional "oferta" que, si es true, muestra "¡Oferta!".

interface ProductoProps {
  nombre: string;
  precio: number;
  stock: number;
  oferta?: boolean; // opcional: puede no venir
}

function Producto({ nombre, precio, stock, oferta }: ProductoProps) {
  return (
    <div className="tarjeta">
      <h3>{nombre}</h3>
      {oferta && <p className="oferta">¡Oferta!</p>}
      <p>${precio}</p>
      {stock === 0 ? (
        <p className="suave">Sin stock</p>
      ) : (
        <p>Stock: {stock}</p>
      )}
    </div>
  );
}

export default function Ej7() {
  return (
    <div className="fila">
      <Producto nombre="Teclado" precio={45000} stock={12} oferta />
      <Producto nombre="Mouse" precio={18000} stock={0} />
      {/* Prueben en VS Code: <Producto nombre="X" precio="mil" stock={1} />
          marca error porque precio tiene que ser number */}
    </div>
  );
}
