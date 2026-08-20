'use client';
import { useTheme } from '@/ui';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/ui';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  function toggle() {
    if ('startViewTransition' in document) {
      document.startViewTransition(() => toggleTheme());
    } else {
      toggleTheme();
    }
  }

  return (
    <Button variant="text" onClick={toggle}>
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );
}
