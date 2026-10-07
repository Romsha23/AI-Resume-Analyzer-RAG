import React from 'react'
import { BackgroundGradientAnimation } from '../ui/background-gradient-animation'
import { useTheme } from '../context/ThemeContext'

export default function GlobalAnimatedBackground() {
  const { dark } = useTheme()

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 h-screen w-screen overflow-hidden select-none"
      aria-hidden="true"
    >
      <BackgroundGradientAnimation
        interactive={true}
        containerClassName="h-full w-full"
        gradientBackgroundStart={dark ? 'rgb(9, 11, 16)' : 'rgb(248, 249, 252)'}
        gradientBackgroundEnd={dark ? 'rgb(13, 16, 23)' : 'rgb(238, 242, 255)'}
        firstColor={dark ? '37, 99, 235' : '99, 102, 241'}
        secondColor={dark ? '124, 58, 237' : '139, 92, 246'}
        thirdColor={dark ? '67, 56, 202' : '59, 130, 246'}
        fourthColor={dark ? '190, 24, 93' : '236, 72, 153'}
        fifthColor={dark ? '30, 58, 138' : '147, 197, 253'}
        pointerColor={dark ? '124, 58, 237' : '99, 102, 241'}
        size="100%"
        blendingValue={dark ? 'hard-light' : 'soft-light'}
      />
    </div>
  )
}
