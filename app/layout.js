export const metadata = {
  title: 'ESP32-CAM Face Recognition System',
  description: 'Système de reconnaissance faciale hors ligne avec ESP32-CAM et activation de relais',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
