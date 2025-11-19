import { useState } from "react";
import "../styles/globals.css";

export default function Home() {
  const [html, setHtml] = useState(
    `<section class="sandbox-section">
       <h1>AI Sandbox v2.1</h1>
       <p>This is your clean, AI-ready sandbox base.</p>
     </section>`
  );
  const [log, setLog] = useState([]);

  function addSection() {
    const block = `
    <section class="sandbox-section">
      <h2>New Section</h2>
      <p>Write something useful here.</p>
    </section>`;
    setHtml(prev => prev + block);
    setLog(prev => [...prev, "Added basic section."]);
  }

  function runAutopilot() {
    const block = `
    <section class="sandbox-section">
      <h2>Autopilot Layout</h2>
      <p>In the future, AI will generate full pages here.</p>
    </section>`;
    setHtml(prev => prev + block);
    setLog(prev => [...prev, "Autopilot placeholder executed."]);
  }

  return (
    <div className="app">
      <div className="toolbarC">
        <button onClick={addSection}>+ Section</button>
        <button onClick={runAutopilot}>Autopilot (placeholder)</button>
      </div>

      <header className="app-header">
        <h1>AI Sandbox v2.1</h1>
      </header>

      <main className="layout">
        <section className="panel panel-chat">
          <h2>Event Log</h2>
          <div className="chat-log">
            {log.map((entry, i) => (
              <div key={i} className="chat-msg system">
                <span>{entry}</span>
              </div>
            ))}
            {log.length === 0 && (
              <div className="chat-msg system">
                <span>No actions yet. Try the buttons above.</span>
              </div>
            )}
          </div>
        </section>

        <section className="panel panel-preview">
          <h2>Preview</h2>
          <div className="preview-frame">
            <iframe
              title="preview"
              srcDoc={html}
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
