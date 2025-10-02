# Adopción de Animales en Casanare

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.57.2-3ECF8E)](https://supabase.com/)

Plataforma dedicada a la adopción y apadrinamiento de animales en necesidad en el departamento de Casanare, Colombia. Conecta a ciudadanos con albergues locales para encontrar compañeros peludos perfectos y apoyar el bienestar animal.

🌐 **Demo en Vivo**: [Adopción de Animales - Casanare](https://banimal.desarrolllocomunitario2025.online/)  

## 🚀 Características Principales

### Para Usuarios Públicos
- **Explorar Mascotas**: Navega por mascotas disponibles para adopción o apadrinamiento
- **Reportar Mascotas Perdidas**: Ayuda a reunir mascotas perdidas con sus dueños
- **Filtrar Búsquedas**: Busca por municipio, especie, sexo y más
- **Ver Instituciones**: Conoce los albergues y veterinarias participantes
- **Red Animalia**: Información sobre la red de protección animal

### Para Usuarios Registrados
- **Registro y Autenticación**: Sistema seguro de login/registro
- **Mis Mascotas**: Gestiona tus adopciones y apadrinamientos
- **Seguimiento de Solicitudes**: Monitorea el estado de tus solicitudes
- **Perfil Personal**: Actualiza tu información y cambia contraseña

### Para Albergues y Veterinarias
- **Gestión de Mascotas**: Registra y administra el inventario de mascotas
- **Manejo de Solicitudes**: Revisa y procesa solicitudes de adopción/apadrinamiento
- **Seguimiento Post-Adopción**: Monitorea el progreso de adopciones
- **Información del Albergue**: Gestiona datos y descripción de la institución

### Para Administradores
- **Panel de Administración**: Gestiona usuarios y permisos
- **Super Admin**: Control total del sistema

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (Base de datos PostgreSQL, Autenticación, Storage)
- **UI Components**: Lucide React, React Icons
- **Formularios**: React Hook Form
- **Compresión de Imágenes**: browser-image-compression
- **Control de Versiones**: Commitizen, Husky, Commitlint

## 📋 Prerrequisitos

- Node.js 18+
- Yarn (recomendado) o npm
- Cuenta de Supabase

## 🚀 Instalación

1. **Clona el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd adopcion-animales-next
   ```

2. **Instala dependencias**
   ```bash
   yarn install
   ```

3. **Configura variables de entorno**

   Crea un archivo `.env.local` en la raíz del proyecto:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

   > **Nota**: Obtén estas claves desde tu proyecto de Supabase en [supabase.com](https://supabase.com)

## 📁 Estructura del Proyecto

```
adopcion-animales-next/
├── src/
│   ├── app/                    # Páginas Next.js (App Router)
│   │   ├── admin/             # Paneles de administración
│   │   ├── auth/              # Páginas de autenticación
│   │   ├── dashboard/         # Dashboard de usuarios
│   │   ├── mascotas/          # Gestión de mascotas
│   │   ├── login/             # Login
│   │   └── ...
│   ├── components/            # Componentes React
│   │   ├── auth/              # Componentes de autenticación
│   │   ├── common/            # Componentes compartidos
│   │   ├── dashboard/         # Componentes del dashboard
│   │   ├── layout/            # Layout y navegación
│   │   └── ...
│   ├── contexts/              # Contextos de React
│   ├── hooks/                 # Hooks personalizados
│   ├── lib/                   # Utilidades y configuraciones
│   │   └── supabase/          # Cliente de Supabase
│   ├── types/                 # Definiciones TypeScript
│   │   ├── database.ts        # Tipos de base de datos
│   │   ├── enums/             # Enumeraciones
│   │   └── interfaces/        # Interfaces
│   └── utils/                 # Utilidades
├── public/                    # Archivos estáticos
├── .husky/                    # Git hooks
├── tailwind.config.js         # Configuración Tailwind
├── next.config.js             # Configuración Next.js
├── tsconfig.json              # Configuración TypeScript
└── package.json               # Dependencias y scripts
```

## 🎯 Roles y Permisos

- **Usuario**: Ciudadanos que pueden adoptar/apadrinar mascotas
- **Staff (Albergue)**: Gestionan mascotas y solicitudes de su albergue
- **Veterinaria**: Similar a Staff pero para veterinarias
- **Red Animalia**: Rol especial para la red de protección animal
- **Admin**: Administradores del sistema
- **Super Admin**: Control total

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

- **Email**: [btriana33@gmail.com](mailto:btriana33@gmail.com)
- **GitHub**: [https://github.com/Mauricio320](https://github.com/Mauricio320)
- **GitLab**: [https://gitlab.com/mauricio320](https://gitlab.com/mauricio320)
- **LinkedIn**: [https://www.linkedin.com/in/mauricio-t-0a3b1a161/](https://www.linkedin.com/in/mauricio-t-0a3b1a161/)

---

¡Ayuda a cambiar vidas! 🐾
