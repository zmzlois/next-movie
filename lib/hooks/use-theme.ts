import * as React from 'react'

import { useTheme as useNextTheme } from 'next-themes'

export function useTheme() {
  const [hasMounted, setHasMounted] = React.useState(false)
  const { resolvedTheme, setTheme } = useNextTheme()

  const isDarkMode = hasMounted && resolvedTheme === 'dark'

  const toggleDarkMode = React.useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault()
      setTheme(isDarkMode ? 'light' : 'dark')
    },
    [setTheme, isDarkMode]
  )

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  return {
    isDarkMode,
    toggleDarkMode
  }
}
