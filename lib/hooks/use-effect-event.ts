import { useCallback, useRef } from 'react';

/**
 * Polyfill for React's useEffectEvent hook
 * This is needed because the hook is not available in React 19.1.0
 * but is being imported by @radix-ui/react-use-effect-event
 */
export function useEffectEvent<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback);
  
  // Update the ref whenever the callback changes
  callbackRef.current = callback;
  
  // Return a stable function that calls the latest callback
  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as T;
}