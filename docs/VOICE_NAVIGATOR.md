# Voice Navigator Documentation

## Overview

The Voice Navigator is an AI-powered accessibility feature that enables hands-free navigation and control of the Pollen web application using voice commands. It leverages the Web Speech API for speech recognition and OpenAI's GPT-4o-mini for intelligent command interpretation.

## Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Setup & Configuration](#setup--configuration)
4. [Usage](#usage)
5. [Supported Commands](#supported-commands)
6. [API Reference](#api-reference)
7. [Troubleshooting](#troubleshooting)
8. [Browser Compatibility](#browser-compatibility)
9. [Development Guide](#development-guide)

---

## Features

### Core Functionality
- **Voice-Activated Navigation**: Navigate to different pages using natural language
- **Hands-Free Operations**: Scroll, navigate back/forward, and control UI elements
- **Theme Control**: Toggle between light and dark modes
- **Real-Time Feedback**: Visual and audio feedback during voice recognition
- **AI-Powered Interpretation**: Fallback to OpenAI for complex command understanding
- **Accessibility-First Design**: Built with WCAG 2.1 compliance in mind

### User Experience
- **Tooltip Interface**: Non-intrusive floating button with hover tooltip
- **Status Indicators**: Real-time visual feedback (audio detected, speech detected, processing)
- **Toast Notifications**: Contextual feedback for user actions
- **Error Handling**: Graceful degradation with helpful error messages

---

## Architecture

### Components

```
┌─────────────────────────────────────────────────────┐
│                  Root Layout                        │
│                 (app/layout.tsx)                    │
└──────────────────┬──────────────────────────────────┘
                   │
                   ├─ VoiceNavigator Component
                   │  (components/voice/voice-navigator.tsx)
                   │
                   └─ Voice Commands API
                      (app/api/voice-commands/route.ts)
                      └─ OpenAI GPT-4o-mini (fallback)
```

### Flow Diagram

```
User clicks mic button
        │
        ├─ Web Speech API starts listening
        │  └─ Events: onstart → onaudiostart → onspeechstart → onresult
        │
        ├─ Transcript captured
        │
        ├─ Sent to /api/voice-commands
        │  │
        │  ├─ Direct Pattern Match (fast)
        │  │  └─ Navigation, scrolling, theme commands
        │  │
        │  └─ AI Interpretation (fallback)
        │     └─ OpenAI GPT-4o-mini analyzes intent
        │
        ├─ Action executed
        │  └─ router.push(), window.scrollBy(), setTheme(), etc.
        │
        └─ Feedback provided
           └─ Toast notifications, console logs
```

---

## Setup & Configuration

### Prerequisites

1. **OpenAI API Key** (optional, for AI-powered command interpretation)
   ```bash
   OPENAI_API_KEY=sk-...
   ```

2. **Browser Requirements**
   - Modern browser with Web Speech API support (Chrome, Edge, Safari)
   - HTTPS connection (required for microphone access)
   - Microphone permission granted

### Installation

The Voice Navigator is automatically integrated into the root layout. No additional installation is required.

### Environment Variables

```env
# Required for AI-powered command interpretation (optional)
OPENAI_API_KEY=your_openai_api_key_here
```

**Note**: If `OPENAI_API_KEY` is not provided, the system will still work with direct pattern matching for common commands.

---

## Usage

### For End Users

1. **Activate Voice Navigator**
   - Look for the blue microphone button (floating bottom-left or bottom-right)
   - Click the button or hover to see available commands

2. **Speak a Command**
   - Click the mic button (turns red when listening)
   - Speak clearly and loudly: "Go to dashboard"
   - Wait for confirmation toast

3. **Stop Listening**
   - Click the red mic button while listening
   - Or wait 3-5 seconds (auto-stops if no speech detected)

### Example Commands

```bash
# Navigation
"Go to dashboard"
"Open services"
"Navigate to blog"
"Go to home page"

# Scrolling
"Scroll down"
"Scroll up"
"Go to top"
"Go to bottom"

# Theme Control
"Toggle dark mode"
"Switch to light mode"
"Switch to dark mode"

# Browser Navigation
"Go back"
"Go forward"
```

---

## Supported Commands

### Navigation Commands

| Voice Command | Action | Route |
|--------------|--------|-------|
| "Go to home" | Navigate to landing page | `/` |
| "Go to dashboard" | Navigate to dashboard | `/dashboard` |
| "Open admin" | Navigate to admin panel | `/admin` |
| "Go to blog" | Navigate to blog | `/blog` |
| "Open services" | Navigate to services | `/services` |
| "Contact" | Navigate to contact page | `/contact` |
| "About" | Navigate to about page | `/about` |
| "Personal savings" | Navigate to savings | `/dashboard/personal-savings` |
| "View balances" | Navigate to balances | `/dashboard/view-balances` |
| "Payments" | Navigate to payments | `/dashboard/payments` |

### Action Commands

| Voice Command | Action | Target |
|--------------|--------|--------|
| "Scroll down" | Scroll page down | 100vh |
| "Scroll up" | Scroll page up | 66vh |
| "Top of page" | Scroll to top | 0 |
| "Bottom" | Scroll to bottom | document height |
| "Go back" | Browser back | history.back() |
| "Go forward" | Browser forward | history.forward() |
| "Dark mode" | Set dark theme | theme: 'dark' |
| "Light mode" | Set light theme | theme: 'light' |
| "Toggle theme" | Toggle theme | theme toggle |

### AI-Interpreted Commands

If a command doesn't match direct patterns, it's sent to OpenAI for interpretation. Examples:

- "Show me my account balance" → Navigate to `/dashboard/view-balances`
- "I want to read articles" → Navigate to `/blog`
- "Make it darker" → Switch to dark mode
- "Take me to the previous page" → Go back

---

## API Reference

### Voice Navigator Component

**Location**: `components/voice/voice-navigator.tsx`

#### Props
None (standalone component)

#### State Variables

```typescript
interface VoiceNavigatorState {
  isListening: boolean          // True when actively listening
  transcript: string | null     // Last captured transcript
  isProcessing: boolean         // True when processing command
  hasSupport: boolean          // True if browser supports Speech API
  audioDetected: boolean       // True when mic captures audio
  speechDetected: boolean      // True when speech is recognized
}
```

#### Key Methods

```typescript
// Start voice recognition
const startRecognition = () => void

// Stop voice recognition
const stopRecognition = () => void

// Process captured transcript
const processTranscript = (text: string) => Promise<void>

// Handle command action
const handleAction = (payload: CommandResponse) => void
```

### Voice Commands API

**Endpoint**: `POST /api/voice-commands`

#### Request

```typescript
interface VoiceCommandRequest {
  text: string       // The spoken command text
  pathname: string   // Current page path (for context)
}
```

Example:
```json
{
  "text": "go to dashboard",
  "pathname": "/services"
}
```

#### Response

```typescript
interface VoiceCommandResponse {
  action: "navigate" | "back" | "forward" | "scroll" | "theme" | "notify" | "unknown"
  target?: string | null        // Action target (e.g., route path, scroll direction)
  message?: string | null       // User-friendly feedback message
  confidence?: number           // AI confidence score (0-1)
  source?: "rule" | "ai" | "fallback"  // Command source
}
```

Example:
```json
{
  "action": "navigate",
  "target": "/dashboard",
  "message": "Navigating to dashboard",
  "confidence": 0.9,
  "source": "rule"
}
```

#### Error Responses

```json
{
  "error": "Missing command text"
}
```

```json
{
  "action": "unknown",
  "message": "Voice assistant unavailable (missing AI configuration).",
  "source": "fallback"
}
```

---

## Troubleshooting

### Common Issues

#### 1. "No speech detected" Error

**Symptoms**: Mic button activates, but no speech is recognized.

**Solutions**:
- Speak **louder** and **closer** to the microphone (within 6 inches)
- Check system microphone volume (should be ≥ 70%)
- Reduce background noise
- Ensure microphone is not muted in system settings

**Debug Steps**:
1. Open browser console (F12)
2. Click mic button
3. Look for these logs in order:
   - ✅ `🎤 Speech recognition started`
   - ✅ `🔊 Audio capture started` (mic is working)
   - ❌ `🗣️ Speech detected` (missing = speak louder)

#### 2. "Microphone access denied" Error

**Symptoms**: Button doesn't activate, shows permission error.

**Solutions**:
- Click the camera/lock icon in browser address bar
- Select "Allow" for microphone access
- Refresh the page

**Browser-Specific**:
- **Chrome**: Settings → Privacy → Site Settings → Microphone
- **Firefox**: Preferences → Privacy → Permissions → Microphone
- **Safari**: Preferences → Websites → Microphone

#### 3. "Voice recognition isn't supported" Error

**Symptoms**: Greyed out button with tooltip warning.

**Solutions**:
- Use a supported browser (Chrome, Edge, Safari)
- Ensure you're on HTTPS (not HTTP)
- Update browser to latest version

#### 4. Commands Not Working

**Symptoms**: Speech recognized but action not executed.

**Solutions**:
- Check console for error messages
- Verify OpenAI API key is configured (for complex commands)
- Try simpler, direct commands first ("go to dashboard")
- Check network connection (API calls may be failing)

### Testing Tools

#### Standalone Microphone Test

**URL**: `http://localhost:3000/test-mic.html`

This test page helps diagnose microphone issues:
1. Click "Start Voice Test"
2. Say "Hello test" loudly
3. Check debug log for detailed feedback

Look for:
- ✅ All events fire: start → audio → sound → speech → result
- ❌ Missing events indicate where the issue is

#### Console Debugging

Enable detailed logging:
```javascript
// Open browser console (F12)
// All voice events are logged with emoji prefixes:
🎤 // Recognition started
🔊 // Audio capture
🗣️ // Speech detected
✅ // Text recognized
❌ // Errors
```

---

## Browser Compatibility

### Supported Browsers

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 25+ | ✅ Full | Best support, recommended |
| Edge 79+ | ✅ Full | Chromium-based, excellent |
| Safari 14.1+ | ⚠️ Partial | iOS Safari limited |
| Firefox | ❌ Limited | Experimental, not recommended |
| Opera 27+ | ✅ Full | Chromium-based |

### Feature Detection

The component automatically detects browser support:

```typescript
const SpeechRecognition = 
  window.SpeechRecognition || window.webkitSpeechRecognition

if (!SpeechRecognition) {
  // Graceful degradation - button disabled with tooltip
}
```

### Mobile Support

- **iOS (Safari)**: Limited, best on iOS 14.1+
- **Android (Chrome)**: Full support
- **Android (Firefox)**: Not supported

---

## Development Guide

### Adding New Commands

#### 1. Direct Pattern Match (Recommended for Simple Commands)

**File**: `app/api/voice-commands/route.ts`

```typescript
const ROUTE_ALIASES: Record<string, string> = {
  // Add new navigation aliases
  "pricing": "/pricing",
  "faq": "/faq",
}

const DIRECT_PATTERNS = [
  // Add new action patterns
  { 
    keywords: ["refresh page", "reload"], 
    action: "reload" 
  },
]
```

#### 2. Handle New Action Types

**File**: `components/voice/voice-navigator.tsx`

```typescript
const handleAction = useCallback(
  (payload: CommandResponse) => {
    switch (payload.action) {
      // Add new action handler
      case "reload":
        window.location.reload()
        toast.success("Reloading page...")
        break
      
      // ... existing cases
    }
  },
  [router, setTheme, theme]
)
```

### Custom Speech Recognition Settings

Modify recognition behavior:

```typescript
const recognition = new SpeechRecognition()
recognition.lang = "en-US"              // Language
recognition.continuous = false          // Single utterance
recognition.interimResults = true       // Show interim results
recognition.maxAlternatives = 3         // Number of alternatives
```

### Styling Customization

The Voice Navigator uses Tailwind CSS and shadcn/ui components:

```typescript
// Button styling
className={cn(
  "rounded-full h-14 w-14",           // Size & shape
  "bg-[#4C4EFB]",                     // Brand color
  "shadow-lg hover:shadow-xl",        // Elevation
  isListening && "bg-red-500"         // Active state
)}

// Tooltip styling
className="max-w-xs p-4 bg-white dark:bg-slate-900"
```

### Event Listeners

Available Speech Recognition events:

```typescript
recognition.onstart = () => {}          // Recognition started
recognition.onaudiostart = () => {}     // Mic capturing audio
recognition.onsoundstart = () => {}     // Sound detected
recognition.onspeechstart = () => {}    // Speech detected
recognition.onresult = (event) => {}    // Text recognized
recognition.onerror = (event) => {}     // Error occurred
recognition.onend = () => {}            // Recognition ended
recognition.onspeechend = () => {}      // Speech ended
recognition.onaudioend = () => {}       // Audio capture ended
```

### Testing Voice Commands

Create unit tests for the API:

```typescript
// __tests__/api/voice-commands.test.ts
import { POST } from '@/app/api/voice-commands/route'

describe('Voice Commands API', () => {
  it('should handle navigation commands', async () => {
    const request = new Request('http://localhost/api/voice-commands', {
      method: 'POST',
      body: JSON.stringify({ text: 'go to dashboard', pathname: '/' })
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(data.action).toBe('navigate')
    expect(data.target).toBe('/dashboard')
  })
})
```

### Performance Optimization

#### 1. Lazy Loading (Already Implemented)

The component is integrated at the root level but uses React hooks for efficient rendering.

#### 2. Debouncing Interim Results

```typescript
// Use debounce for interim results to reduce processing
import { debounce } from 'lodash'

const debouncedProcessInterim = debounce((text: string) => {
  console.log(`💬 Interim: "${text}"`)
}, 300)
```

#### 3. API Response Caching

```typescript
// Cache common command interpretations
const commandCache = new Map<string, CommandResponse>()

const getCachedCommand = (text: string) => {
  const normalized = text.toLowerCase().trim()
  return commandCache.get(normalized)
}
```

---

## Security Considerations

### Microphone Permissions

- Microphone access is requested **on-demand** (only when user clicks button)
- User can revoke permission at any time via browser settings
- No audio is recorded or stored

### API Security

- Voice commands API is **public** (no authentication required)
- OpenAI API key is stored server-side only (not exposed to client)
- Rate limiting recommended for production (not implemented)

### Privacy

- Speech data is processed in real-time
- No transcripts are logged or stored
- OpenAI API calls follow OpenAI's data usage policy

---

## Future Enhancements

### Planned Features

1. **Multi-Language Support**
   - Support for Bemba, Nyanja, and other Zambian languages
   - Dynamic language switching

2. **Voice Feedback**
   - Text-to-speech responses
   - Audio confirmations for actions

3. **Custom Wake Word**
   - "Hey Pollen" activation phrase
   - Always-listening mode (opt-in)

4. **Advanced Commands**
   - Form filling via voice
   - Data filtering and search
   - Transaction initiation

5. **Accessibility Enhancements**
   - Screen reader compatibility
   - Keyboard shortcuts
   - Visual feedback for deaf users

### Contributing

To contribute voice command features:

1. Add command patterns to `app/api/voice-commands/route.ts`
2. Update component handlers in `components/voice/voice-navigator.tsx`
3. Test with `public/test-mic.html`
4. Update this documentation
5. Submit PR with test cases

---

## Resources

### External Documentation
- [Web Speech API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Internal Files
- Component: `components/voice/voice-navigator.tsx`
- API Route: `app/api/voice-commands/route.ts`
- Test Page: `public/test-mic.html`
- Root Layout: `app/layout.tsx`

### Support
For issues or questions, please contact the development team or file an issue in the project repository.

---

## Changelog

### Version 1.0.0 (Current)
- ✅ Initial release
- ✅ Web Speech API integration
- ✅ OpenAI GPT-4o-mini fallback
- ✅ Direct pattern matching for common commands
- ✅ Tooltip-based UI
- ✅ Real-time feedback and error handling
- ✅ Browser compatibility detection
- ✅ WCAG 2.1 accessibility compliance

---

## License

This feature is part of the Pollen web application. All rights reserved.

