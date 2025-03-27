import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#0066CC', // Color azul FCF
      },
    ],
  },
  manifest: '/site.webmanifest',
  title: 'FCF Camps | Campamentos Oficiales de la Selección Colombia de Fútbol',
  description: 'Campamentos oficiales de fútbol de la FCF. Entrena como un profesional con la metodología de la Selección Colombia. Sedes en Bogotá y Barranquilla para niños y jóvenes de 6 a 17 años.',
  keywords: ['FCF Camps', 'Selección Colombia', 'campamentos de fútbol', 'escuela de fútbol', 'fútbol juvenil', 'entrenamiento fútbol', 'FCF', 'fútbol Colombia'],
  authors: [{ name: 'Federación Colombiana de Fútbol' }],
  creator: 'Federación Colombiana de Fútbol',
  publisher: 'Federación Colombiana de Fútbol',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  generator: 'Next.js',
  applicationName: 'FCF Camps',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'sports',
  metadataBase: new URL('https://www.fcfcamps.com'),
  alternates: {
    canonical: 'https://www.fcfcamps.com',
  },
  openGraph: {
    title: 'FCF Camps | Campamentos Oficiales de la Selección Colombia',
    description: 'Entrena como un profesional con la metodología oficial de la Selección Colombia. Campamentos de fútbol para niños y jóvenes de 6 a 17 años.',
    url: 'https://www.fcfcamps.com',
    siteName: 'FCF Camps',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FCF Camps - Campamentos Oficiales de la Selección Colombia',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FCF Camps | Entrena como un Profesional',
    description: 'Campamentos oficiales de fútbol de la Selección Colombia para niños y jóvenes. ¡Inscríbete ahora!',
    creator: '@FCF_Oficial',
    images: ['/twitter-image.jpg'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'tu-codigo-de-verificacion-google',
    yandex: 'tu-codigo-de-verificacion-yandex',
    yahoo: 'tu-codigo-de-verificacion-yahoo',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
