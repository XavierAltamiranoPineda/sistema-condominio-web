# Sistema Condominio Web

Cliente web administrativo para el Sistema de Gestión Residencial. Construido con React, TypeScript y Tailwind CSS.

## 🚀 Tecnologías Principales

- **Frontend Framework:** React + Vite
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios
- **State Management / Data Fetching:** TanStack Query
- **Manejo de Formularios:** React Hook Form + Zod
- **Iconos:** Lucide React

## 📦 Estructura del Proyecto

```text
src/
├── api/          # Configuración de Axios e Interceptores JWT
├── assets/       # Recursos estáticos (imágenes, logos)
├── components/   # Componentes UI reutilizables
├── context/      # Context API (AuthContext)
├── hooks/        # Custom React Hooks
├── layouts/      # Layouts principales (MainLayout)
├── pages/        # Vistas organizadas por módulos (auth, dashboard, etc.)
├── routes/       # Rutas protegidas y públicas
├── services/     # Llamadas a la API organizadas por módulo
├── types/        # Interfaces y tipos de TypeScript
└── utils/        # Funciones utilitarias (formatters, etc.)
```

## 🛠 Instalación y Ejecución Local

1. Clonar el repositorio.
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno:
   Copiar o crear el archivo `.env` en la raíz del proyecto.
   ```env
   VITE_API_URL={tu url}
   ```
4. Ejecutar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 🔐 Conexión API y Autenticación

El cliente se conecta a la API de Spring Boot alojada en Railway.
La autenticación se realiza mediante JWT. El token se almacena en el `localStorage` y un interceptor de Axios (ubicado en `src/api/axios.ts`) se encarga de inyectar el token en la cabecera `Authorization: Bearer <token>` de cada petición HTTP automáticamente.

## 💻 Módulos

*   **Auth:** Login con validación y JWT.
*   **Dashboard:** Resumen general de la administración.
*   *(Realizado)* **Residentes:** CRUD de residentes.
*   *(Realizado)* **Residencias:** Gestión de casas/departamentos.
*   *(Realizado)* **Pagos:** Registro y estado de cuenta.
*   *(Realizado)* **Comunicados:** Emisión de avisos.
*   *(Próximamente)* **Reportes:** Resumen de novedades.
