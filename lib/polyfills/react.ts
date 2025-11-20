// Import the original React
// We need to use require here to avoid circular dependency issues
// when webpack processes this file
const React = require('react');
import { useEffectEvent } from './use-effect-event';

// Re-export everything from React
// We need to use require here to avoid circular dependency issues
module.exports = {
  ...React,
  // Add our useEffectEvent polyfill
  useEffectEvent,
};

// Also export named exports
Object.keys(React).forEach(key => {
  if (key !== 'default') {
    module.exports[key] = React[key];
  }
});

// Add useEffectEvent as a named export
module.exports.useEffectEvent = useEffectEvent;
