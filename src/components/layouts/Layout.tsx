import { Outlet } from 'react-router'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'

export default function Layout() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Navigation />
      <div className="mx-auto h-full max-w-300">
        <Outlet />
      </div>
    </motion.div>
  )
}
