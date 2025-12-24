const { useState, useEffect } = React;

import Landing from './components/Landing.js';
import StoryViewer from './components/StoryViewer.js';
import { parseChat } from './parser.js';
import { analyzeChat } from './analyzer.js';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const text = await file.text();
      const messages = parseChat(text);
      if (messages.length === 0) {
        throw new Error("No valid messages found. Check the file format.");
      }
      const stats = analyzeChat(messages);
      
      // Simulate processing time for effect
      setTimeout(() => {
        setData(stats);
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setError(null);
  };

  if (data) {
    return <StoryViewer data={data} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Landing onFileUpload={handleFileUpload} loading={loading} error={error} />
    </div>
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
