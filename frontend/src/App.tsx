import "./styles/App.css";
import FeedbackPin from "./components/FeedbackPin";

/*
 * Main application component that serves as the entry point
 * Renders the FeedbackPin component
 */
function App() {
  /* In a real application, this would come from user authentication */
  const userEmailId = "demo@example.com";

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
