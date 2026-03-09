'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { cn } from '@/lib/utils/cn'

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  once?: boolean
}

export function FadeIn({
  children,
  className,
  delay = 0,
  once = true,
}: FadeInProps) {
  const reduceMotion = useReducedMotion()
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: 0.12,
  })

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.45, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
