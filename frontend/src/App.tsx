import "./styles/App.css";
import FeedbackPin from "./components/FeedbackPin";

/*
 * Main application component that serves as the entry point
 * Renders the demo content and the FeedbackPin component
 */
function App() {
    /* In a real application, this would come from user authentication */
    const userEmailId = "demo@example.com";

    return (
        <div className="app">
            <header className="app-header">
                <h1>Feedback Pin Demo</h1>
                <p>
                    Click anywhere on the page to add feedback when feedback
                    mode is enabled
                </p>
            </header>

            <main className="app-content">
                <div className="demo-content">
                    <h2>Demo Content</h2>
                    <p>
                        This is a demo page to showcase the feedback pin
                        functionality.
                    </p>
                    <p>
                        Enable feedback mode using the button in the corner,
                        then click anywhere to add feedback.
                    </p>
                </div>
            </main>

            <FeedbackPin
                initialActive={false}
                initialShowPins={true}
                emailId={userEmailId}
            />
        </div>
    );
}

export default App;
