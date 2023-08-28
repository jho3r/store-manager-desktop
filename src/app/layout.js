import 'bootstrap/dist/css/bootstrap.min.css'

export const metadata = {
  title: 'Sales Manager',
  description: 'Manage your sales'
}

export default function RootLayout ({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"/>
      </head>
      <body >{children}</body>
    </html>
  )
}
