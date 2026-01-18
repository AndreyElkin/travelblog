import type { ReactNode } from 'react'
import { useLocation } from 'react-router'
import Header from '../Header/Header'
import Hero from '../Hero/Hero'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const layoutClass = isHome ? 'layout layout--home' : 'layout layout--other';

  return (
    <>
    <div className={layoutClass}>
      <Header />
      <Hero />
    </div>
      <main className="container">{children}</main>
    </>
  )
}