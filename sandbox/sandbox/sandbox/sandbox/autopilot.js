// ----------------------------------------------------------
// AUTOPILOT ENGINE — v1.99
// Provides Light / Deep / Max (Ultra) Autopilot plans
// Returns command arrays for the Sandbox Core to execute
// ----------------------------------------------------------

// ----------- SECTION BLOCKS (HTML placeholders) -----------
const SECTIONS = {

  hero: `
    <section class="sandbox-section">
      <h1>Welcome to Your New Site</h1>
      <p>Fast, clean, easy website creation.</p>
      <button style="
        padding: 10px 18px;
        background: #0f62fe;
        color: white;
        border: none;
        border-radius: 6px;
        margin-top: 12px;
      ">Get Started</button>
    </section>
  `,

  benefits: `
    <section class="sandbox-section">
      <h2>Why Choose Us?</h2>
      <ul>
        <li>Fast website creation</li>
        <li>No coding needed</li>
        <li>Beautiful clean layouts</li>
        <li>Works on any device</li>
      </ul>
    </section>
  `,

  features: `
    <section class="sandbox-section">
      <h2>Features</h2>
      <ul>
        <li>Drag-free building</li>
        <li>Smart AI suggestions</li>
        <li>Publish instantly</li>
        <li>Full component library</li>
      </ul>
    </section>
  `,

  pricing: `
    <section class="sandbox-section">
      <h2>Pricing</h2>
      <p>Choose the plan that's right for you.</p>
      <div style="display:flex; gap:12px; margin-top:16px;">
        <div style="flex:1; padding:14px; border:1px solid #ddd; border-radius:6px;">
          <h3>Basic</h3><p>Free</p>
        </div>
        <div style="flex:1; padding:14px; border:1px solid #ddd; border-radius:6px;">
          <h3>Pro</h3><p>£4.99/mo</p>
        </div>
        <div style="flex:1; padding:14px; border:1px solid #ddd; border-radius:6px;">
          <h3>Unlimited</h3><p>£14.99/mo</p>
        </div>
      </div>
    </section>
  `,

  faq: `
    <section class="sandbox-section">
      <h2>FAQ</h2>
      <details><summary>How does this work?</summary>
      <p>You build using suggested blocks or AI autopilot.</p></details>

      <details><summary>Can I export?</summary>
      <p>Yes — ZIP, WordPress, or direct publish.</p></details>
    </section>
  `,

  testimonials: `
    <section class="sandbox-section">
      <h2>Testimonials</h2>
      <blockquote>"I built a site in 10 minutes." — A</blockquote>
      <blockquote>"Game-changing speed." — B</blockquote>
    </section>
  `,

  contact: `
    <section class="sandbox-section">
      <h2>Contact Us</h2>
      <p>Email: hello@example.com</p>
      <p>Phone: +1 555 123 4567</p>
    </section>
  `,

  finalCTA: `
    <section class="sandbox-section">
      <h2>Ready to Begin?</h2>
      <button style="
        padding: 10px 18px;
        background: #0f62fe;
        color:white;
        border:none;
        border-radius:6px;
      ">Start Now</button>
    </section>
  `,

};// ----------------------------------------------------------
// AUTOPILOT PLANS — v1.99
// Light • Deep • Max (Ultra)
// Each returns a list of Sandbox Commands
// ----------------------------------------------------------

// ---------- LIGHT MODE ----------
function buildLightPlan(project) {
  return [
    { type: "SET_TEMPLATE", template: "simple" },
    { type: "ADD_SECTION", html: SECTIONS.benefits },
    { type: "ADD_SECTION", html: SECTIONS.pricing }
  ];
}

// ---------- DEEP MODE ----------
function buildDeepPlan(project) {
  return [
    { type: "SET_TEMPLATE", template: "simple" },
    { type: "ADD_SECTION", html: SECTIONS.hero },
    { type: "ADD_SECTION", html: SECTIONS.benefits },
    { type: "ADD_SECTION", html: SECTIONS.features },
    { type: "ADD_SECTION", html: SECTIONS.pricing },
    { type: "ADD_SECTION", html: SECTIONS.faq },
    { type: "ADD_SECTION", html: SECTIONS.contact }
  ];
}

// ---------- MAX / ULTRA MODE ----------
function buildMaxPlan(project) {
  return [
    { type: "SET_TEMPLATE", template: "simple" },

    // Structure: Hero → Benefits → Features → Testimonials → Pricing → FAQ → Contact → Final CTA
    { type: "ADD_SECTION", html: SECTIONS.hero },
    { type: "ADD_SECTION", html: SECTIONS.benefits },
    { type: "ADD_SECTION", html: SECTIONS.features },
    { type: "ADD_SECTION", html: SECTIONS.testimonials },
    { type: "ADD_SECTION", html: SECTIONS.pricing },
    { type: "ADD_SECTION", html: SECTIONS.faq },
    { type: "ADD_SECTION", html: SECTIONS.contact },
    { type: "ADD_SECTION", html: SECTIONS.finalCTA },
  ];
}

// ----------------------------------------------------------
// MAIN EXPORT
// ----------------------------------------------------------
export function buildAutopilotPlan(project, mode = "light") {
  if (mode === "light") return buildLightPlan(project);
  if (mode === "deep") return buildDeepPlan(project);
  if (mode === "max") return buildMaxPlan(project);

  // fallback
  return buildLightPlan(project);
}
