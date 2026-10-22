import React, { useEffect, useRef, useState } from 'react'

export function BackgroundGradientAnimation({
  gradientBackgroundStart = 'rgb(248, 249, 252)',
  gradientBackgroundEnd = 'rgb(238, 242, 255)',
  firstColor = '99, 102, 241',
  secondColor = '139, 92, 246',
  thirdColor = '59, 130, 246',
  fourthColor = '236, 72, 153',
  fifthColor = '96, 165, 250',
  pointerColor = '124, 58, 237',
  size = '80%',
  blendingValue = 'hard-light',
  children,
  className = '',
  interactive = true,
  containerClassName = '',
}) {
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--gradient-background-start', gradientBackgroundStart)
    root.style.setProperty('--gradient-background-end', gradientBackgroundEnd)
    root.style.setProperty('--first-color', firstColor)
    root.style.setProperty('--second-color', secondColor)
    root.style.setProperty('--third-color', thirdColor)
    root.style.setProperty('--fourth-color', fourthColor)
    root.style.setProperty('--fifth-color', fifthColor)
    root.style.setProperty('--pointer-color', pointerColor)
    root.style.setProperty('--size', size)
    root.style.setProperty('--blending-value', blendingValue)
  }, [
    gradientBackgroundStart,
    gradientBackgroundEnd,
    firstColor,
    secondColor,
    thirdColor,
    fourthColor,
    fifthColor,
    pointerColor,
    size,
    blendingValue,
  ])

  const interactiveRef = useRef(null)
  // Use refs instead of state so mouse animation does NOT cause full React re-renders 60 times/sec
  const curPos = useRef({ x: 0, y: 0 })
  const tgPos = useRef({ x: 0, y: 0 })
  const rafId = useRef(null)

  useEffect(() => {
    function move() {
      if (!interactiveRef.current) return
      curPos.current.x += (tgPos.current.x - curPos.current.x) / 15
      curPos.current.y += (tgPos.current.y - curPos.current.y) / 15
      interactiveRef.current.style.transform = `translate3d(${Math.round(curPos.current.x)}px, ${Math.round(curPos.current.y)}px, 0)`
      rafId.current = requestAnimationFrame(move)
    }

    if (interactive) {
      rafId.current = requestAnimationFrame(move)
    }
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [interactive])

  const handleMouseMove = (event) => {
    if (interactiveRef.current) {
      const rect = interactiveRef.current.getBoundingClientRect()
      tgPos.current.x = event.clientX - rect.left
      tgPos.current.y = event.clientY - rect.top
    }
  }

  const [isSafari, setIsSafari] = useState(false)
  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent))
  }, [])

  return (
    <div
      className={`h-full w-full relative overflow-hidden top-0 left-0 bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))] ${containerClassName}`}
      onMouseMove={interactive ? handleMouseMove : undefined}
    >
      <svg className="hidden">
        <defs>
          <filter id="blurFilter">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="40"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div
        className={`gradients-container h-full w-full blur-lg ${
          isSafari ? 'blur-2xl' : '[filter:url(#blurFilter)_blur(40px)]'
        }`}
      >
        <div
          className={`absolute [background:radial-gradient(circle_at_center,_rgba(var(--first-color),_0.8)_0,_rgba(var(--first-color),_0)_50%)_no-repeat] [mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] [transform-origin:center_center] animate-first opacity-100`}
        />
        <div
          className={`absolute [background:radial-gradient(circle_at_center,_rgba(var(--second-color),_0.8)_0,_rgba(var(--second-color),_0)_50%)_no-repeat] [mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] [transform-origin:calc(50%-400px)] animate-second opacity-100`}
        />
        <div
          className={`absolute [background:radial-gradient(circle_at_center,_rgba(var(--third-color),_0.8)_0,_rgba(var(--third-color),_0)_50%)_no-repeat] [mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] [transform-origin:calc(50%+400px)] animate-third opacity-100`}
        />
        <div
          className={`absolute [background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),_0.8)_0,_rgba(var(--fourth-color),_0)_50%)_no-repeat] [mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] [transform-origin:calc(50%-200px)] animate-fourth opacity-70`}
        />
        <div
          className={`absolute [background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),_0.8)_0,_rgba(var(--fifth-color),_0)_50%)_no-repeat] [mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] [transform-origin:calc(50%-800px)_calc(50%+800px)] animate-fifth opacity-100`}
        />

        {interactive && (
          <div
            ref={interactiveRef}
            className={`absolute [background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.8)_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat] [mix-blend-mode:var(--blending-value)] w-full h-full -top-1/2 -left-1/2 opacity-70`}
          />
        )}
      </div>
      {children}
    </div>
  )
}

export default BackgroundGradientAnimation
