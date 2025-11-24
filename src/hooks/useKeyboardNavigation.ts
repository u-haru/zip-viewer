import React from 'react';
import { useViewerStore } from '../store/viewerStore';

const useKeyboardNavigation = () => {
  const next = useViewerStore((s) => s.next);
  const prev = useViewerStore((s) => s.prev);
  const toggleSpread = useViewerStore((s) => s.toggleSpread);
  const toggleDirection = useViewerStore((s) => s.toggleDirection);
  const setCurrentIndex = useViewerStore((s) => s.setCurrentIndex);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ': {
          e.preventDefault();
          next();
          break;
        }
        case 'ArrowLeft':
        case 'Backspace': {
          e.preventDefault();
          prev();
          break;
        }
        case '+':
        case '=':
        case '-':
        case 'f':
        case 'F':
          // zoom modes disabled
          break;
        case 'd':
        case 'D':
          toggleDirection();
          break;
        case 't':
        case 'T':
          toggleSpread();
          break;
        case 'g':
        case 'G':
          setCurrentIndex(0);
          break;
        default:
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev, toggleSpread, toggleDirection, setCurrentIndex]);
};

export default useKeyboardNavigation;
