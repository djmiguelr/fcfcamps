# FCF Camps Landing Page

Landing page para los campamentos de fútbol de la Federación Colombiana de Fútbol.

## Requisitos

- Node.js 18.x o superior
- pnpm 8.x o superior

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd fcf-camps-landing
```

2. Instalar dependencias:
```bash
pnpm install
```

3. Configurar variables de entorno:
Crear un archivo `.env.local` con las siguientes variables:
```env
NEXT_PUBLIC_GOOGLE_SHEETS_ID=tu_id_de_google_sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu_email_de_service_account
GOOGLE_PRIVATE_KEY=tu_private_key
```

## Desarrollo

Para ejecutar el servidor de desarrollo:
```bash
pnpm dev
```

## Producción

Para construir la aplicación para producción:
```bash
pnpm build
```

Para iniciar el servidor de producción:
```bash
pnpm start
```

## Despliegue en VPS

1. Instalar Node.js y pnpm en el servidor:
```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar pnpm
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

2. Clonar el repositorio y configurar:
```bash
git clone [URL_DEL_REPOSITORIO]
cd fcf-camps-landing
pnpm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env.local
# Editar .env.local con los valores correctos
```

4. Construir y ejecutar:
```bash
pnpm build
pnpm start
```

5. Configurar PM2 para mantener la aplicación en ejecución:
```bash
# Instalar PM2
npm install -g pm2

# Iniciar la aplicación
pm2 start npm --name "fcf-camps" -- start

# Configurar inicio automático
pm2 startup
pm2 save
```

## Tecnologías utilizadas

- Next.js 14
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Google Sheets API
