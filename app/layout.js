import './globals.css'
import Navbar from './components/Navbar'
import { ClerkProvider } from '@clerk/nextjs'

export const metadata = {
  title: 'Food Delivery System',
  description: 'Built by Big Mitch',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body >
            <Navbar />
            <div className="user-container">
              {children}
            </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
