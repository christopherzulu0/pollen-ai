// We need to use require here to avoid circular dependency issues
const React = require('react');
const { useCallback, useRef } = React;

/**
 * Polyfill for React's useEffectEvent hook
 * This is needed because the hook is not available in React 19.1.0
 * but is being imported by @radix-ui/react-use-effect-event
 */
function useEffectEvent(callback) {
  const callbackRef = useRef(callback);

  // Update the ref whenever the callback changes
  callbackRef.current = callback;

  // Return a stable function that calls the latest callback
  return useCallback((...args) => {
    return callbackRef.current(...args);
  }, []);
}

// Export for use in our React polyfill
module.exports = { useEffectEvent };
