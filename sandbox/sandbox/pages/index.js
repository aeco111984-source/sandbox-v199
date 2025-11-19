import { useState } from "react";

// ------------------ TEMPLATES ------------------
const TEMPLATES = {
  blank: `
    <section class="sandbox-section">
      <h1>New Project</h1>
      <p>Start building...</p>
    </section>
  `,
  fx: `
    <section class="sandbox-section">
      <header><h1>FX Site</h1></header>
    </section>
    <section class="sandbox-section">
      <h2>Live Converter</h2>
      <p>[converter placeholder]</p>
    </section>
    <section class="sandbox-section">
      <h2>Live Rates</h2>
      <p>[rates placeholder]</p>
    </section>
    <section class="sandbox-section">
      <p>About · Privacy</p>
    </section>
  `,
  simple: `
    <section class="sandbox-section">
      <header><h1>Simple Landing</h1></header>
    </section>
    <section class="sandbox-section">
      <h2>Headline</h2>
      <p>Explain your value here.</p>
    </section>
    <section class="sandbox-section">
      <p>Contact · Terms</p>
    </section>
  `
};

// ---------------- COMMAND BUILDER ----------------
function buildCommandFromText(text) {
  const t = text.toLowerCase();

  if (t.includes("add about")) {
    return {
      type: "ADD_SECTION",
      display: "add about",
      html: `
        <section class="sandbox-section">
          <h2>About</h2>
          <p>Write about your project here.</p>
        </section>
      `
    };
  }

  if (t.includes("add pricing")) {
    return {
      type: "ADD_SECTION",
      display: "add pricing",
      html: `
        <section class="sandbox-section">
          <h2>Pricing</h2>
          <p>Basic · Pro · Enterprise.</p>
        </section>
      `
    };
  }

  if (t.includes("make fx")) {
    return { type: "SET_TEMPLATE", template: "fx", display: "make fx" };
  }

  if (t.includes("simplify")) {
    return { type: "SET_TEMPLATE", template: "simple", display: "simplify" };
  }

  if (t.includes("autopilot")) {
    return {
      type: "AUTOPILOT_PLAN",
      plan: "basic-landing",
      display: "autopilot"
    };
  }

  return null;
}

function describeCommand(cmd) {
  if (!cmd) return "";
  if (cmd.type === "ADD_SECTION") return "Add a new designed section.";
  if (cmd.type === "SET_TEMPLATE") {
    if (cmd.template === "fx") return "Switch to FX template.";
    if (cmd.template === "simple") return "Switch to Simple Landing template.";
  }
  if (cmd.type === "AUTOPILOT_PLAN") return "Run Autopilot Basic Landing Page Plan.";
  return "Unknown action.";
}

function expandAutopilotPlan(plan) {
  if (plan === "basic-landing") {
    return [
      { type: "SET_TEMPLATE", template: "simple" },
      {
        type: "ADD_SECTION",
        html: `
          <section class="sandbox-section">
            <h2>About</h2>
            <p>Write about your project here.</p>
          </section>
        `
      },
      {
        type: "ADD_SECTION",
        html: `
          <section class="sandbox-section">
            <h2>Pricing</h2>
            <p>Basic · Pro · Enterprise.</p>
          </section>
        `
      }
    ];
  }
  return [];
}

// ---------------- HOME COMPONENT ----------------
export default function Home() {

  // ---------- STATE ----------
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "My First Site",
      type: "simple",
      html: TEMPLATES.simple,
      history: []
    }
  ]);

  const [activeId, setActiveId] = useState(1);
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState([
    {
      from: "system",
      text: "Welcome to AI Sandbox v1.9 (Suggest Dropdown + Modes)."
    }
  ]);

  const [pendingCommand, setPendingCommand] = useState(null);
  const [recentCommands, setRecentCommands] = useState([]);

  // Wizard
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardType, setWizardType] = useState("simple");
  const [wizardPlan, setWizardPlan] = useState("basic-landing");

  // Help + Tips
  const [showHelp, setShowHelp] = useState(false);
  const [showTips, setShowTips] = useState(true);

  // Suggest dropdown
  const [showSuggestBox, setShowSuggestBox] = useState(false);

  const activeProject = projects.find(p => p.id === activeId);
  const activeHistory = activeProject?.history || [];

  // RECENT COMMANDS
  function addRecentCommand(display) {
    if (!display) return;
    setRecentCommands(prev => {
      const updated = [display, ...prev.filter(x => x !== display)];
      return updated.slice(0, 4);
    });
  }

  // ADD PROJECT
  function addProject(type) {
    const id = Date.now();
    const name = type === "fx" ? "New FX Site" : "New Blank Site";
    const html = type === "fx" ? TEMPLATES.fx : TEMPLATES.blank;

    setProjects(prev => [...prev, { id, name, type, html, history: [] }]);
    setActiveId(id);
    setChatLog(prev => [...prev, { from: "system", text: `Created ${name}.` }]);
    setPendingCommand(null);
  }

  // CHAT SUBMIT
  function handleChatSubmit(e) {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatLog(prev => [...prev, { from: "user", text: userText }]);

    const cmd = buildCommandFromText(userText);
    setChatInput("");

    if (!cmd) {
      setChatLog(prev => [
        ...prev,
        {
          from: "system",
          text:
            "Unknown command. Try: 'add about', 'add pricing', 'make fx', 'simplify', 'autopilot'."
        }
      ]);
      return;
    }

    addRecentCommand(cmd.display);
    setPendingCommand(cmd);

    setChatLog(prev => [
      ...prev,
      { from: "system", text: "Proposed: " + describeCommand(cmd) }
    ]);
  }

  // APPLY COMMAND
  function applySingleCommand(cmd, currentHtml) {
    let html = currentHtml || "";

    if (cmd.type === "ADD_SECTION") html += cmd.html;
    if (cmd.type === "SET_TEMPLATE" && TEMPLATES[cmd.template])
      html = TEMPLATES[cmd.template];

    return html;
  }  function applyCommand(cmd) {
    if (!cmd || !activeProject) return;

    const isAutopilot = cmd.type === "AUTOPILOT_PLAN";
    const finalCommands = isAutopilot
      ? expandAutopilotPlan(cmd.plan)
      : [cmd];

    const snapshotLabel = isAutopilot
      ? "Before Autopilot"
      : "Before: " + describeCommand(cmd);

    const snapshotTime = new Date().toLocaleTimeString();

    setProjects(prev =>
      prev.map(p => {
        if (p.id !== activeProject.id) return p;

        const snapshot = {
          id: Date.now() + Math.random(),
          label: snapshotLabel,
          html: p.html,
          timestamp: snapshotTime
        };

        let html = p.html || "";
        finalCommands.forEach(c => {
          html = applySingleCommand(c, html);
        });

        const newHistory = [snapshot, ...(p.history || [])].slice(0, 10);

        return { ...p, html, history: newHistory };
      })
    );

    setChatLog(prev => [
      ...prev,
      {
        from: "system",
        text: isAutopilot
          ? "Autopilot executed the Basic Landing Plan."
          : "Applied: " + describeCommand(cmd)
      }
    ]);

    setPendingCommand(null);

    setTimeout(() => {
      const iframe = document.querySelector("iframe");
      if (iframe?.contentWindow)
        iframe.contentWindow.scrollTo(0, 99999);
    }, 120);
  }

  // ---------- SUGGEST DROPDOWN ----------
  function runSuggestion(mode) {
    let suggestions = [];

    if (mode === "light") {
      suggestions = [
        "• Add spacing between sections",
        "• Improve headline clarity",
        "• Add small FAQ section"
      ];
    }

    if (mode === "deep") {
      suggestions = [
        "• Add About section",
        "• Add Pricing section",
        "• Add FAQ",
        "• Improve readability",
        "• Add CTA button",
        "• Enhance spacing",
        "• Add basic footer"
      ];
    }

    if (mode === "ultra") {
      suggestions = [
        "• Add About",
        "• Add Pricing",
        "• Add FAQ",
        "• Add Testimonials",
        "• Add CTA hero",
        "• Improve layout structure",
        "• Enhance spacing",
        "• Add subtle color theme",
        "• Add final polish passes"
      ];
    }

    setChatLog(prev => [
      ...prev,
      { from: "system", text: `Suggestions (${mode} mode):` },
      ...suggestions.map(s => ({ from: "system", text: s }))
    ]);

    setShowSuggestBox(false);
  }

  // ---------- WIZARD ----------
  function startWizard() {
    setShowWizard(true);
    setWizardStep(1);
    setWizardType("simple");
    setWizardPlan("basic-landing");
  }

  function wizardNext() {
    if (wizardStep === 1) {
      setWizardStep(2);
      return;
    }
    if (wizardStep === 2) {
      const id = Date.now();
      const html = wizardType === "fx" ? TEMPLATES.fx : TEMPLATES.blank;
      const name = wizardType === "fx" ? "Wizard FX Site" : "Wizard Site";

      setProjects(prev => [
        ...prev,
        { id, name, type: wizardType, html, history: [] }
      ]);
      setActiveId(id);

      const cmd = {
        type: "AUTOPILOT_PLAN",
        plan: wizardPlan,
        display: "autopilot"
      };
      setPendingCommand(cmd);

      setChatLog(prev => [
        ...prev,
        {
          from: "system",
          text: `Wizard created ${name}. Approve Autopilot to build.`
        }
      ]);

      setShowWizard(false);
    }
  }

  function wizardBack() {
    if (wizardStep === 2) {
      setWizardStep(1);
      return;
    }
    setShowWizard(false);
  }

  // ---------- WIZARD MODAL ----------
  function WizardModal() {
    if (!showWizard) return null;
    return (
      <div className="wizard-overlay">
        <div className="wizard-modal">
          <div className="wizard-title">Guided Build Wizard</div>
          <div className="wizard-step">Step {wizardStep} of 2</div>

          {wizardStep === 1 && (
            <>
              <div style={{ fontSize: "0.8rem", marginBottom: "0.4rem" }}>
                What type of site do you want to build?
              </div>
              <div className="wizard-options">
                <button
                  className={"wizard-btn " + (wizardType === "simple" ? "selected" : "")}
                  onClick={() => setWizardType("simple")}
                >
                  Simple Landing Page
                </button>
                <button
                  className={"wizard-btn " + (wizardType === "fx" ? "selected" : "")}
                  onClick={() => setWizardType("fx")}
                >
                  FX / Finance Site
                </button>
              </div>
            </>
          )}

          {wizardStep === 2 && (
            <>
              <div style={{ fontSize: "0.8rem", marginBottom: "0.4rem" }}>
                Choose build method:
              </div>
              <div className="wizard-options">
                <button
                  className={"wizard-btn " + (wizardPlan === "basic-landing" ? "selected" : "")}
                  onClick={() => setWizardPlan("basic-landing")}
                >
                  Autopilot Basic Landing
                </button>
              </div>
            </>
          )}

          <div className="wizard-actions">
            <button onClick={wizardBack}>Back</button>
            <button onClick={wizardNext}>{wizardStep === 2 ? "Finish" : "Next"}</button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- HELP ----------
  function HelpModal() {
    if (!showHelp) return null;
    return (
      <div className="help-overlay">
        <div className="help-modal">
          <div className="help-title">How This Sandbox Works</div>
          <div className="help-body">
            <p>You can:</p>
            <ul>
              <li>Create sites via toolbar buttons</li>
              <li>Type commands like “add about”, “add pricing”</li>
              <li>Approve changes in Pending Actions</li>
              <li>Use History to undo or fork</li>
              <li>Use Wizard for guided builds</li>
              <li>Use Suggest for improvements</li>
            </ul>
            <p style={{ opacity: 0.8 }}>
              Tip: Do not reload — your work stays until replaced.
            </p>
          </div>
          <div className="help-actions">
            <button onClick={() => setShowHelp(false)}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- TIPS ----------
  function TipsBar() {
    if (!showTips) return null;
    return (
      <div className="tips-bar">
        <div className="tips-text">
          Tip: Try the Wizard or use 'autopilot'. Approve actions in Pending.
        </div>
        <button className="tips-dismiss" onClick={() => setShowTips(false)}>
          Got it
        </button>
      </div>
    );
  }

  // ---------- MAIN RETURN ----------
  return (
    <div className="app">
      
      {/* Toolbar */}
      <div className="toolbarC">
        <button onClick={() => setShowSuggestBox(v => !v)}>Suggest ▼</button>
        <button onClick={() => addProject("simple")}>+ Simple Site</button>
        <button onClick={() => addProject("fx")}>+ FX Site</button>
        <button onClick={() => startWizard()}>Wizard</button>
        <button onClick={() => setShowHelp(true)}>Help</button>
      </div>

      {/* Suggest Dropdown */}
      {showSuggestBox && (
        <div className="suggest-box">
          <button onClick={() => runSuggestion("light")}>Light Suggestions</button>
          <button onClick={() => runSuggestion("deep")}>Deep Suggestions</button>
          <button onClick={() => runSuggestion("ultra")}>Ultra Suggestions</button>
        </div>
      )}

      <header className="app-header">
        <h1>AI Sandbox v1.9</h1>
      </header>

      <main className="layout">

        {/* LEFT */}
        <section className="panel panel-list">
          <h2>Projects</h2>
          <ul className="project-list">
            {projects.map(p => (
              <li
                key={p.id}
                className={p.id === activeId ? "active" : ""}
                onClick={() => {
                  setActiveId(p.id);
                  setPendingCommand(null);
                }}
              >
                <strong>{p.name}</strong>
                <span className="tag">{p.type}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CENTER */}
        <section className="panel panel-chat">
          <h2>Chat / Commands</h2>

          <TipsBar />

          {recentCommands.length > 0 && (
            <div className="recent-commands">
              <div className="recent-title">Recent Commands:</div>
              <div className="recent-row">
                {recentCommands.map((r, i) => (
                  <button key={i} className="recent-btn" onClick={() => applyRecent(r)}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="chat-log">
            {chatLog.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from}`}>
                <span>{m.text}</span>
              </div>
            ))}
          </div>

          {pendingCommand && (
            <div className="pending-box">
              <div className="pending-title">Pending Action — approve to apply:</div>
              <div className="pending-desc">
                {describeCommand(pendingCommand)}
              </div>
              <button className="pending-btn" onClick={() => applyCommand(pendingCommand)}>
                ✅ Approve & Apply
              </button>
            </div>
          )}

          <form className="chat-input-row" onSubmit={handleChatSubmit}>
            <input
              type="text"
              placeholder="Type a command…"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
            />
            <button type="submit">Propose</button>
          </form>
        </section>

        {/* RIGHT */}
        <section className="panel panel-preview">
          <h2>Preview</h2>
          <div className="preview-frame">
            {activeProject ? (
              <iframe
                title="preview"
                srcDoc={activeProject.html}
                sandbox="allow-same-origin allow-scripts"
              />
            ) : (
              <p>No project selected.</p>
            )}
          </div>

          <div className="publish-tip">
            <small style={{
              display: "block",
              marginTop: "6px",
              fontSize: "0.72rem",
              opacity: 0.75,
              color: "#9cb3ff"
            }}>
              Tip: Don’t publish until your site is fully final.<br />
              Each publish uses 1 of your monthly free publishes.
            </small>
          </div>
        </section>
      </main>

      {/* Overlays */}
      <WizardModal />
      <HelpModal />

      <button className="stuck-btn" onClick={handleStuck}>
        I’m Stuck
      </button>
    </div>
  );
}
