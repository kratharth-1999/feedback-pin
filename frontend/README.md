# Kratharth Feedback Pin

A React component for adding feedback pins to web pages, allowing users to provide contextual feedback by clicking on specific areas of the page.

## Installation

```bash
npm install kratharth-feedback-pin
```

## Usage

### Basic Usage

```tsx
import React from 'react';
import { FeedbackPin } from 'kratharth-feedback-pin';
import 'kratharth-feedback-pin/dist/index.css'; // Import the CSS

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
import { FeedbackPin, FeedbackPinAppProps } from 'kratharth-feedback-pin';
import 'kratharth-feedback-pin/dist/index.css';

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
import 'kratharth-feedback-pin/dist/index.css';
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

## Contributing

We welcome contributions to the Kratharth Feedback Pin project! Here's how to get started:

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Setting up the Development Environment

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kratharth-1999/feedback-pin.git
   cd feedback-pin/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the Project

#### Development Mode
To start the development server with hot reload:

```bash
npm run dev
```

This will start the Vite development server, typically at `http://localhost:5173`.

#### Build for Production
To create a production build:

```bash
npm run build
```

The built files will be generated in the `dist` directory.

#### Preview Production Build
To preview the production build locally:

```bash
npm run preview
```

### Running Tests

The project uses Vitest for testing. Here are the available test commands:

#### Run Tests in Watch Mode
```bash
npm test
```

#### Run Tests Once
```bash
npm run test:run
```

#### Run Tests with UI
```bash
npm run test:ui
```

This opens a web-based UI for running and viewing tests.

#### Run Tests with Coverage
```bash
npm run test:coverage
```

This generates a coverage report showing which parts of the code are tested.

### Code Quality

#### Linting
To check for code style and potential issues:

```bash
npm run lint
```

### Project Structure

- `src/components/` - React components
- `src/context/` - React context providers
- `src/hooks/` - Custom React hooks
- `src/services/` - API service functions
- `src/styles/` - CSS stylesheets
- `src/test/` - Test files
- `src/types/` - TypeScript type definitions

### Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure everything works (`npm test`)
5. Run linting to check code quality (`npm run lint`)
6. Commit your changes (`git commit -m 'Add some amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Testing Guidelines

- Write tests for new components and functions
- Ensure all tests pass before submitting a PR
- Aim for good test coverage
- Test files should be placed in the `src/test/` directory with the same structure as the source files

## License

MIT
