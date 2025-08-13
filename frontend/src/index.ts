// Main entry point for the package
export { default as FeedbackPin } from './components/FeedbackPin';
export type { 
  FeedbackPinAppProps,
  PinType,
  Position,
  PinsContextType,
  PinsProviderProps
} from './types';

// Export CSS
import './styles/App.css';
import './styles/LoadingOverlay.css';
