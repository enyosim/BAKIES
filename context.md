# CONTEXTO DEL PROYECTO: BAKIES 🧁🐾

Este documento detalla la arquitectura, estructura de carpetas, assets y funcionamiento de **BAKIES** para permitir que cualquier instancia continúe el trabajo sin perder contexto.

---

## 1. Visión General
**BAKIES** es un juego/app web interactivo estilo **Gacha / Álbum de Stickers** ambientado en un universo de repostería viva. 
Los usuarios abren sobres coleccionables oficiales Serie 1 con animación de apertura cuadro a cuadro (*frame-by-frame*) y partículas para coleccionar stickers clasificados en álbumes por especie y variante.

* **Estilo Artístico:** 100% oficial Cookie Run: Kingdom (2D Flash/Animate cel-shading, sombreado de corte duro, lineart grueso entintado en color oscuro temático, rostros limpios sin boca/lengua/W y sin sombras en el piso).
* **Paleta de Interfaz:** Fondos pastel suaves (crema, vainilla, rosa pastel, azul cielo) combinados con un sutil **grid punteado** y sombras suaves.

---

## 2. Estructura de Assets Carpetizados
Todos los assets están clasificados en carpetas independientes bajo `C:\Enyo\Proyectos\BAKIES\public\assets\bakies\{criatura}\`:

```text
C:\Enyo\Proyectos\BAKIES\
├── index.html                               # Aplicación SPA completa
├── context.md                               # Este archivo de especificaciones técnicas
└── public\
    └── assets\
        ├── logo\
        │   └── bakies_logo.png              # Logotipo oficial arqueado con chocolate y cereza
        ├── sobres\
        │   ├── frame00.png a frame05.png    # 6 cuadros de la animación de rasgado
        └── bakies\
            ├── candylamb\
            │   ├── candylamb_001.png
            │   └── candylamb_002.png
            ├── cataroon\
            │   ├── cataroon_001.png
            │   └── cataroon_002.png
            ├── chocobat\
            │   ├── chocobat_001.png
            │   └── chocobat_002.png
            ├── cinnashell\
            │   ├── cinnashell_001.png
            │   └── cinnashell_002.png
            ├── croisfox\
            │   ├── croisfox_001.png
            │   └── croisfox_002.png
            ├── donubear\
            │   ├── donubear_001.png
            │   ├── donubear_002.png
            │   ├── donubear_003.png
            │   └── donubear_004.png
            ├── jellytopus\
            │   ├── jellytopus_001.png
            │   └── jellytopus_002.png
            ├── merinchick\
            │   ├── merinchick_001.png
            │   └── merinchick_002.png
            ├── mochibun\
            │   ├── mochibun_001.png
            │   └── mochibun_002.png
            ├── popsipeng\
            │   ├── popsipeng_001.png
            │   └── popsipeng_002.png
            ├── puppcake\
            │   ├── puppcake_001.png
            │   └── puppcake_002.png
            ├── tartle\
            │   ├── tartle_001.png
            │   └── tartle_002.png
            └── truffico\
                ├── truffico_001.png
                └── truffico_002.png
```

---

## 3. Catálogo Oficial de Especies y Variantes

| Especie | Nombre Oficial | Icono | Variantes Disponibles | Ruta de Carpeta |
| :--- | :--- | :--- | :--- | :--- |
| **Puppcake** | Puppcake | 🧁 | `#001`, `#002` | `public/assets/bakies/puppcake/` |
| **Cinnashell** | Cinnashell | 🐌 | `#001`, `#002` | `public/assets/bakies/cinnashell/` |
| **Donubear** | Donubear | 🐻 | `#001`, `#002`, `#003`, `#004` | `public/assets/bakies/donubear/` |
| **Cataroon** | Cataroon | 🐱 | `#001`, `#002` | `public/assets/bakies/cataroon/` |
| **Tartle** | Tartle | 🐢 | `#001`, `#002` | `public/assets/bakies/tartle/` |
| **Croisfox** | Croisfox | 🦊 | `#001`, `#002` | `public/assets/bakies/croisfox/` |
| **Candylamb** | Candylamb | 🐑 | `#001`, `#002` | `public/assets/bakies/candylamb/` |
| **Truffico** | Truffico | 🦔 | `#001`, `#002` | `public/assets/bakies/truffico/` |
| **Popsipeng** | Popsipeng | 🐧 | `#001`, `#002` | `public/assets/bakies/popsipeng/` |
| **Mochibun** | Mochibun | 🐇 | `#001`, `#002` | `public/assets/bakies/mochibun/` |
| **Jellytopus** | Jellytopus | 🐙 | `#001`, `#002` | `public/assets/bakies/jellytopus/` |
| **Merinchick** | Merinchick | 🐦 | `#001`, `#002` | `public/assets/bakies/merinchick/` |
| **Chocobat** | Chocobat | 🦇 | `#001`, `#002` | `public/assets/bakies/chocobat/` |

---

## 4. Regla para Agregar Nuevas Variantes en el Futuro
Para agregar una nueva variante (por ejemplo `puppcake_003.png`):
1. Guardar la imagen en `public/assets/bakies/puppcake/puppcake_003.png`.
2. En `index.html`, agregar la entrada dentro de `BAKIES_DATABASE` en el array `variants` de esa especie:
   ```javascript
   { num: "#003", file: "puppcake_003.png", path: "public/assets/bakies/puppcake/puppcake_003.png", flavor: "Nombre del Sabor" }
   ```
3. La app calculará automáticamente el total de stickers, el filtro, el progreso del álbum y las probabilidades del sobre gacha.

---

## 5. Ejecución
Abrir directamente `C:\Enyo\Proyectos\BAKIES\index.html` en cualquier navegador web. Todo funciona 100% en local sin servidores obligatorios.
