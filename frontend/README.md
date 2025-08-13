# Kratharth Feedback Pin

A React component for adding interactive feedback pins to web pages. Users can click anywhere on the page to add feedback pins with comments, view existing pins, and manage them.

## Installation

```bash
npm install kratharth-feedback-pin
```

## Usage

```jsx
import React from 'react';
import { FeedbackPin } from 'kratharth-feedback-pin';

function App() {
  // The emailId is MANDATORY and used to identify the user
  const userEmailId = "user@example.com";

  return (
    <FeedbackPin
      initialActive={false}
      initialShowPins={true}
      emailId={userEmailId}
      initialShowControls={true}
    />
  );
}

export default App;
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `emailId` | string | Yes | - | User's email ID (mandatory) |
| `initialActive` | boolean | No | false | Whether feedback mode is initially active |
| `initialShowPins` | boolean | No | true | Whether pins are initially visible |
| `initialShowControls` | boolean | No | true | Whether control buttons are initially visible |

## Features

- Click anywhere on the page to add feedback pins
- View, edit, and delete existing pins
- Toggle visibility of pins and controls
- Responsive design that works on all screen sizes
- Automatic position adjustment for pins and popups

## License

MIT
