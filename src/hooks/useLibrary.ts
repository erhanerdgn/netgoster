import { useEffect, useState } from 'react';
import { getFavorites, getSaved, type SavedCalculation } from '@/lib/storage';

export function useLibrary() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [saved, setSaved] = useState<SavedCalculation[]>([]);
  useEffect(() => {
    const refresh = () => {
      setFavorites(getFavorites());
      setSaved(getSaved());
    };
    refresh();
    window.addEventListener('ng:library', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('ng:library', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  return { favorites, saved };
}
