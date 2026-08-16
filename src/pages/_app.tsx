import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Head from 'next/head'
import ToastProvider from '@/components/ToastProvider'

export default function App({ Component, pageProps }: AppProps){
  return (
    <>
      <Head>
        <title>XYPHORIA — Tools. Code. Innovation.</title>
        <meta name="description" content="XYPHORIA — Public tools repository and marketplace" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>
      <ToastProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </>
  )
}
