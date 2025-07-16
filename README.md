# 🐾 Acandemy - Tienda online para amantes de los perros

**Acandemy** es una tienda online desarrollada como Trabajo Fin de Grado por **Andrea Vega**, estudiante del Grado en Ingeniería Informática de la **Universidad Internacional de La Rioja (UNIR)**.

Está enfocada en ofrecer productos especializados y personalizados para perros, combinando una experiencia de compra moderna con un sistema de gestión completo para usuarios y administradores.
---
## 🎥 Vídeos demostrativos

- [🔗 Demo de una subida readme con integración de vercel](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

- [🔗 Demo como Admin](https://www.youtube.com/watch?v=TI-m58GOX4g)
  
- [🔗 Demo como User](https://www.youtube.com/watch?v=0W1EuqzwolU)

---

## ✨ Funcionalidades principales

### 🛒 Público general

- Catálogo público de productos
- Lista de deseos
- Carrito de compra
- Checkout con autenticación obligatoria

### 👤 Usuario registrado

- Visualización y edición de datos personales
- Gestión de mascotas
- Consulta del historial de pedidos y su estado

### 🛠️ Administrador

- Panel de control con gestión de:
  - Productos y categorías
  - Pedidos y estados
  - Descuentos y promociones
  - Personalizaciones de productos

---

## 🧑‍💻 Tecnologías utilizadas

- **Frontend:** React + Tailwind CSS + Vite
- **Backend:** Node.js + Express
- **Base de datos:** Supabase (PostgreSQL + Auth + Storage)
- **Autenticación:** Supabase Auth + JWT
- **Pagos:** Stripe
- **Almacenamiento de imágenes:** Supabase Storage
- **Despliegue:** Vercel (con integración continua)

---

## 🚀 Instalación local

```bash
# Clona el repositorio
git clone https://github.com/andreavega/acandemy.git
cd acandemy

# Instala las dependencias
npm install

# Crea el archivo de entorno
cp .env.example .env
# Rellena con tus claves de Supabase, Stripe y otras variables necesarias

# Ejecuta la app en modo desarrollo
npm run start
```
