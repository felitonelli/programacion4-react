# programacion4-react

Prácticas de React del profe Mariano (UTN TUP 2026).

```
programacion4-react/
├── ejercicios-basicos/        ← practica-react.pdf (Ej1 a Ej7, un solo proyecto con menú)
└── frontend-endpoints/        ← practica-bk-endpoints.pdf
    ├── practica1/ … practica8/   (cada una es el frontend de clase hasta el paso 7 + esa práctica)
```

Cada carpeta es un proyecto Vite independiente: hay que hacer `npm install` en cada una.

---

## 1. Levantar la API (Fumaneri, `clase-1-sqlmodel`)

En Windows (PowerShell):

```powershell
git clone https://github.com/ffumaneri/utn-tup-2026-python.git
cd utn-tup-2026-python\clase-1-sqlmodel
python -m venv .venv
.venv\Scripts\Activate.ps1
Get-Content requirements.txt | Where-Object { $_ -notmatch "uvloop" } | Set-Content req-windows.txt
pip install -r req-windows.txt
uvicorn main:app --reload --port 8000
```

> **Ojo con el puerto.** El frontend busca la API en `http://localhost:8000` (está en `.env.development`, igual que en el repo del profe y en la guía).
> Si la levantan con `--port 80`, cambien en cada `.env.development` la línea por `VITE_API_URL=http://localhost`.

Swagger: http://localhost:8000/docs

Usuarios de prueba (contraseña `123`):

| Email | Rol | Permisos |
|---|---|---|
| `mgomez@email.com` | ADMIN | write, read, delete, update |
| `sfer@email.com` | REGULAR | solo read |

`database.db` está versionada: lo que creen o borren aparece en `git status`. Para volver atrás, con la API apagada: `git checkout database.db`.

## 2. Levantar un frontend

```powershell
cd frontend-endpoints\practica1
npm install
npm run dev
```

Abrir http://localhost:5175 (las prácticas usan el puerto 5175 y `ejercicios-basicos` el 5173). Usen `localhost`, no `127.0.0.1`.
Como todas las prácticas usan el mismo puerto, levanten una por vez.

---

## 3. Qué hay en cada práctica

| Práctica | Archivos que cambian | Qué hace |
|---|---|---|
| 1. Detalle | `UserList.tsx` | Clic en un nombre → `GET /user/{id}`: email, edad, país y roles. Estado `selectedId` + `useEffect` que depende de él. |
| 2. Cargando y errores | `UserList.tsx` | Estados `loading` y `error`. Muestra `Cargando...` y, si falla, el `detail` de la API. |
| 3. Buscar | `UserList.tsx` | Input + **Buscar** → `GET /user/search/{name}` con `encodeURIComponent`. **Limpiar** vuelve a la lista. |
| 4. Mis roles | `UserList.tsx` | Interfaz `User` ampliada con `roles?`. Saludo: `Hola, Martina Gómez (ADMIN)`. |
| 5. Alta | `UserForm.tsx` (nuevo), `UserList.tsx` | Formulario → `POST /user`. `Number(...)` para edad y país, `<select>` a mano, `type="email"`, `minLength={4}`. Al crear, suma el usuario a la lista sin recargar. |
| 6. Mayores | `UserList.tsx` | Botón que alterna entre `GET /user` y `GET /user_mayores`. |
| 7. Borrar | `UserList.tsx` | Botón **Borrar** por fila, `window.confirm`, `DELETE /user/{id}` y `filter` para sacarlo de la lista. |
| 8. Sesión vencida | `App.tsx`, `UserList.tsx` | Si un pedido da 401, `UserList` llama a la prop `onUnauthorized`; `App` borra el token y vuelve al login con **Tu sesión venció**. |

### Cómo probar cada una

- **P2:** en `UserList.tsx` cambien `/user` por `/usr` → aparece `Not Found`. Para ver el `Cargando...`, en DevTools → Network pongan **Slow 4G**.
- **P3:** busquen `ma`. Después busquen `#` y miren la URL en Network.
- **P5:** con `sfer@email.com` la API responde `Missing permission: write_users` y se muestra.
- **P6:** con la práctica 5 (o Swagger) creen un usuario de 16 años y comparen las dos listas.
- **P7:** con `sfer` sale `Missing permission: delete_users`. Borren solo usuarios que crearon ustedes.
- **P8:** DevTools → Application → Local Storage → cambien una letra del `token` y recarguen (F5).

---

## 4. Respuestas de las preguntas "para pensar"

**P1. ¿Por qué la lista trae solo `id` y `name` y el detalle hace otro pedido?**
Porque la lista se muestra entera y el detalle se pide de a uno. Con 10.000 usuarios, mandar email, edad, país y roles de todos sería una respuesta enorme (más lenta, más memoria, más consultas a la base por los roles y países) para mostrar datos que el usuario casi nunca mira. Además, cuantos menos datos personales viajen, menos se exponen. Por eso: lista liviana y detalle a pedido.

**P3. `#` con y sin `encodeURIComponent`.**
Sin codificar, el navegador toma `#` como el comienzo del *fragmento* (el ancla de la URL), y eso nunca se manda al servidor: el pedido sale cortado, como `/user/search/`, y la búsqueda no llega a la API. Codificado sale `/user/search/%23` y la API recibe `#` como texto. Lo mismo pasa con `?`, `/`, `&` o espacios.

**P6.** Todos los usuarios de prueba son mayores, así que al principio las dos listas son iguales. Después de crear uno de 16 años, aparece en **Todos** pero no en **Solo mayores** (`age >= 18`).

**P7. ¿Está bien que el botón Borrar aparezca aunque no tenga permiso?**
No es lo ideal: el usuario ve una acción que siempre le va a fallar. Pero ocultarlo no protege nada; lo que protege es que la API responda 403. Lo correcto es hacer las dos cosas: la API valida siempre y el front oculta lo que no corresponde (eso se hace en el paso 12).

**P9. Contar repeticiones.** En las 8 prácticas, sumando:

| Qué | Veces | Archivos |
|---|---|---|
| `import.meta.env.VITE_API_URL` | 27 | 17 |
| ``Authorization: `Bearer ${token}` `` | 19 | 9 |
| `if (!response.ok)` / `if (!respuesta.ok)` | 19 | 17 |
| `useState` para loading y errores | 22 | — |

Si el backend cambiara el header del token, habría que tocar cada `fetch` de cada componente, y si se olvidan de uno, esa pantalla da 401 sin que sea obvio por qué. Esa es la razón del paso 8: un único `apiFetch()` en `api/client.ts` que arma la URL, pone el token y maneja errores; con eso, el cambio se hace en un solo archivo.

---

Material de estudio: guía completa (pasos 0 a 13) en
https://github.com/marianoggg/utn-tup-2026-frontend → `docs/guia-react-frontend.pdf`.
