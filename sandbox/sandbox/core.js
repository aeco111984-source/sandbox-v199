// ----------------------------------------------------------
// SANDBOX CORE ENGINE — v1.99
// Handles HTML mutation, snapshots, project updates
// ----------------------------------------------------------

export function applySingleCommand(cmd, currentHtml, TEMPLATES) {
  let html = currentHtml || "";

  if (cmd.type === "ADD_SECTION") {
    html += cmd.html;
  }

  if (cmd.type === "SET_TEMPLATE" && TEMPLATES[cmd.template]) {
    html = TEMPLATES[cmd.template];
  }

  return html;
}

// ----------------------------------------------------------
// Expands multi-step autopilot plans into a list of commands
// ----------------------------------------------------------
export function expandAutopilotPlan(plan, TEMPLATES) {
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

// ----------------------------------------------------------
// Main applyCommand function — pure engine logic
// ----------------------------------------------------------
export function applyCommandToProject(cmd, project, TEMPLATES) {
  if (!cmd || !project) return project;

  // Smart Suggest does NOT mutate HTML
  if (cmd.type === "SMART_SUGGEST") {
    return project; 
  }

  const isAuto = cmd.type === "AUTOPILOT_PLAN";
  const expanded = isAuto
    ? expandAutopilotPlan(cmd.plan, TEMPLATES)
    : [cmd];

  let newHtml = project.html;
  expanded.forEach(c => {
    newHtml = applySingleCommand(c, newHtml, TEMPLATES);
  });

  const snapshot = {
    id: Date.now(),
    label: isAuto
      ? "Before Autopilot"
      : "Before: " + describeForSnapshot(cmd),
    html: project.html,
    timestamp: new Date().toLocaleTimeString()
  };

  return {
    ...project,
    html: newHtml,
    history: [snapshot, ...(project.history || [])].slice(0, 10)
  };
}

// Utility for naming snapshots
function describeForSnapshot(cmd) {
  if (cmd.type === "SET_TEMPLATE") return `Switch to template: ${cmd.template}`;
  if (cmd.type === "ADD_SECTION") return "Add Section";
  if (cmd.type === "AUTOPILOT_PLAN") return "Autopilot Plan";
  return "Change";
}

// ----------------------------------------------------------
// Restore Snapshot
// ----------------------------------------------------------
export function restoreSnapshot(project, snapshotId) {
  const snap = (project.history || []).find(s => s.id === snapshotId);
  if (!snap) return project;

  return {
    ...project,
    html: snap.html
  };
}

// ----------------------------------------------------------
// Fork Snapshot → new project
// ----------------------------------------------------------
export function forkSnapshot(project, snapshotId) {
  const snap = (project.history || []).find(s => s.id === snapshotId);
  if (!snap) return null;

  return {
    id: Date.now(),
    name: project.name + " (fork)",
    type: project.type,
    html: snap.html,
    history: [snap]
  };
}
