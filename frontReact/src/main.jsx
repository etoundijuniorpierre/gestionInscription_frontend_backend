import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';

// Force console log to verify logging is working
console.log("=== APPLICATION STARTUP ===");
console.log("Current time:", new Date().toISOString());
console.log("Environment:", import.meta.env.MODE);

// Simple debug function that also shows on screen
const debugLog = (message) => {
  console.log("[MAIN] " + message);
  
  // Try to add to DOM
  setTimeout(() => {
    try {
      const debugDiv = document.createElement('div');
      debugDiv.textContent = "[MAIN] " + message;
      debugDiv.style.position = 'fixed';
      debugDiv.style.top = '50px';
      debugDiv.style.left = '0';
      debugDiv.style.backgroundColor = 'blue';
      debugDiv.style.color = 'white';
      debugDiv.style.padding = '5px';
      debugDiv.style.zIndex = '9998';
      debugDiv.style.fontSize = '10px';
      document.body.appendChild(debugDiv);
      
      // Remove after 5 seconds
      setTimeout(() => {
        if (debugDiv.parentNode) {
          debugDiv.parentNode.removeChild(debugDiv);
        }
      }, 5000);
    } catch (e) {
      console.log("Failed to add debug div:", e);
    }
  }, 0);
};

debugLog("Debug logging system initialized");

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.error("=== ERROR BOUNDARY CAUGHT ERROR ===");
    console.error("Error:", error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("=== ERROR BOUNDARY DETAILS ===");
    console.error("Error:", error);
    console.error("ErrorInfo:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Quelque chose s'est mal passé. Vérifiez la console du navigateur.</h1>;
    }

    return this.props.children;
  }
}

//import stripe function
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

debugLog("Loading Stripe");
// add stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_51RwRkpB8xDJAlUH6I0mr0d1tUnziR40lB3cEXXs0nCz6vz1YK7cyIwyztMPqcY67XY6c9oRNOlkEUzQx0inRHRti00nH3MJoI8");


const root = ReactDOM.createRoot(document.getElementById('root'));
debugLog("Rendering application");
root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <BrowserRouter>
                <UserProvider>
                    {/* Pass the stripePromise to the Elements provider */}
                    <Elements stripe={stripePromise}>
                        <App />
                    </Elements>
                </UserProvider>
            </BrowserRouter>
        </ErrorBoundary>
    </React.StrictMode>
);