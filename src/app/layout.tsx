import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Dorimu's Gallery",
  description: 'Dorimu的美图展示页',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
          <script defer src="https://charity.dorimu.cn/script.js" data-website-id="a690e8bf-b690-4c76-87f0-a40c37636fc7"></script>
        </div>
      </body>
    </html>
  )
}