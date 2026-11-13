# BAKIES 🧁🐾

Juego y app web interactiva de coleccionismo estilo **Gacha / Álbum de Stickers** ambientada en un universo de repostería viva.

Diseñada con estética **cute pastel**, bordes redondeados, tipografía amigable y **100% responsive** (móvil, tablet y escritorio).

---

## ✨ Características

- 🧁 **Splash Screen de 15 Segundos:** Pantalla de carga con logo flotante, barra de bastón de caramelo animada, mensajes temáticos de pastelería y precarga completa en caché de los 35 recursos gráficos (sprites, frames y logo) para una experiencia instantánea.
- 🎁 **Apertura de Sobres Gacha (Serie 1):** Animación cuadro a cuadro (*frame-by-frame*, `frame00` a `frame05`) del sobre rasgándose con chispas de confeti pastel generadas proceduralmente y efectos de sonido con Web Audio API (con botón para silenciar).
- 📖 **Álbum de Colección Clasificado:**
  - 13 especies oficiales (`Puppcake`, `Donubear`, `Cataroon`, `Tartle`, `Croisfox`, `Candylamb`, `Truffico`, `Popsipeng`, `Mochibun`, `Jellytopus`, `Merinchick`, `Chocobat`, `Cinnashell`) y 28 variantes únicas con su receta y sabor.
  - Buscador en tiempo real por nombre de especie o sabor.
  - Filtro por estado (*Todos*, *Conseguidos*, *Faltantes*) y filtros por especie.
  - Ficha modal de detalle con vista previa ampliada, cantidad de copias y navegación *Anterior / Siguiente*.
- 📱 **100% Responsive & Mobile-First:**
  - **Móvil:** Barra de navegación fija inferior ergonómica en la zona natural del pulgar, cabecera compacta y modales adaptados tipo *bottom-sheet*.
  - **Escritorio:** Vista balanceada con sobre interactivo y panel lateral de *Tu Pastelería* con los últimos stickers recién horneados y porcentaje total de la colección.
- 💾 **Persistencia Automática:** Todo tu inventario y contador de sobres se guardan localmente en `localStorage` (`bakies_save_v2`) con opción de reiniciar la partida.

---

## 🛠️ Tecnologías

- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS v4** con fuentes redondeadas (`Fredoka` & `Nunito`)
- **Lucide React** (iconografía)
- **Web Audio API** (efectos de sonido táctiles sintetizados)

---

## 📁 Estructura del Proyecto

```text
BAKIES/
├── public/
│   └── assets/
│       ├── logo/            # Logotipo oficial BAKIES
│       ├── sobres/          # Frames de animación de apertura (00 a 05)
│       └── bakies/          # Sprites de criaturas clasificados por especie
├── src/
│   ├── components/
│   │   ├── AlbumView.tsx          # Vista de álbum, filtros y buscador
│   │   ├── BakieImage.tsx         # Imagen con fallback seguro
│   │   ├── ConfettiCanvas.tsx     # Partículas de confeti pastel
│   │   ├── PackOpener.tsx         # Apertura de sobres interactiva
│   │   ├── RewardModal.tsx        # Modal de revelación de stickers
│   │   ├── SplashScreen.tsx       # Carga de 15s con precarga de assets
│   │   └── StickerDetailModal.tsx # Ficha ampliada de cada criatura
│   ├── data/
│   │   └── bakies.ts              # Base de datos tipada de especies y variantes
│   ├── utils/
│   │   └── sound.ts               # Efectos de sonido sintetizados
│   ├── App.tsx                    # Componente principal
│   ├── index.css                  # Estilos Tailwind y animaciones
│   └── main.tsx                   # Punto de entrada
├── index.html
├── package.json
└── vite.config.ts
```

---

## 🚀 Ejecución Local

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Construir para producción:
   ```bash
   npm run build
   ```

---

## ☁️ Deploy en Cloudflare Pages

1. Conecta este repositorio en **Cloudflare Pages**.
2. Parámetros de compilación:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/`
3. En **Settings > Environment variables**, añade:
   - `NODE_VERSION`: `22`
