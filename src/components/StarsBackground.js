import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const StarsBackground = () => {
  const [stars, setStars] = useState([])
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mqNarrow = window.matchMedia('(max-width: 600px)')

    const build = () => {
      const motionReduced = mqReduce.matches
      setReduceMotion(motionReduced)
      const count = motionReduced ? 28 : mqNarrow.matches ? 28 : 50
      const newStars = []
      for (let i = 0; i < count; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 2,
        })
      }
      setStars(newStars)
    }

    build()
    mqReduce.addEventListener('change', build)
    mqNarrow.addEventListener('change', build)
    return () => {
      mqReduce.removeEventListener('change', build)
      mqNarrow.removeEventListener('change', build)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
      aria-hidden
    >
      {stars.map(star => (
        <motion.div
          key={star.id}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            boxShadow: '0 0 8px rgba(124, 184, 255, 0.55)',
          }}
          animate={
            reduceMotion
              ? { opacity: 0.55, scale: 1 }
              : {
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  duration: star.duration,
                  delay: star.delay,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 2,
                }
          }
        />
      ))}
    </div>
  )
}

export default StarsBackground
