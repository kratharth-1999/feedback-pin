# Kratharth Feedback Pin

A React component for adding feedback pins to web pages, allowing users to provide contextual feedback by clicking on specific areas of the page.

## Installation

```bash
npm install k-feedback-pin
```

## Usage

### Basic Usage

```tsx
import React from 'react';
import { FeedbackPin } from 'k-feedback-pin';
import 'k-feedback-pin/dist/index.css'; // Import the CSS

function App() {
  return (
    <div>
      <h1>My Application</h1>
      <FeedbackPin emailId="user@example.com" />
    </div>
  );
}

export default App;
```

### With Custom Props

```tsx
import React from 'react';
import { FeedbackPin, FeedbackPinAppProps } from 'k-feedback-pin';
import 'k-feedback-pin/dist/index.css';

function App() {
  return (
    <div>
      <h1>My Application</h1>
      <FeedbackPin 
        emailId="user@example.com"
        initialActive={false}
        initialShowPins={true}
        initialShowControls={true}
      />
    </div>
  );
}

export default App;
```

## Important: CSS Import

**You must import the CSS file for the component to display correctly:**

```tsx
import 'k-feedback-pin/dist/index.css';
```

Without this import, the feedback pins and controls will not have proper styling.

## Props

### FeedbackPinAppProps

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `emailId` | `string` | Yes | - | Email ID to associate with feedback pins |
| `initialActive` | `boolean` | No | `false` | Whether the feedback mode is initially active |
| `initialShowPins` | `boolean` | No | `true` | Whether to show existing pins initially |
| `initialShowControls` | `boolean` | No | `true` | Whether to show control buttons initially |

## Types

The package exports the following TypeScript types:

- `FeedbackPinAppProps` - Props for the main FeedbackPin component
- `PinType` - Structure of a feedback pin
- `Position` - X,Y coordinates
- `PinsContextType` - Context type for managing pins
- `PinsProviderProps` - Props for the PinsProvider
- And more...

## Features

- Click anywhere on the page to add feedback pins
- View and edit existing feedback
- Toggle feedback mode on/off
- Show/hide existing pins
- Responsive design
- TypeScript support

## License

MIT
