// ----------------------------------------------------------
// ACTION ENGINE — v1.99
// Executes: Add Section, Switch Template, Insert Components,
// Apply Suggestions, Autopilot Expansion
// ----------------------------------------------------------

import { TEMPLATES } from "./core.js";
import { COMPONENTS } from "./components.js";
import { Suggest } from "./suggest.js";

// ------------- Apply one action -------------
export function applyAction(projectHtml, action) {

  // ADD SECTION
  if (action.type === "ADD_SECTION") {
    return projectHtml + action.html;
  }

  // TEMPLATE SWITCH
  if (action.type === "SET_TEMPLATE") {
    if (TEMPLATES[action.template]) {
      return TEMPLATES[action.template];
    }
    return projectHtml;
  }

  // INSERT COMPONENT
  if (action.type === "ADD_COMPONENT") {
    if (COMPONENTS[action.component]) {
      return projectHtml + COMPONENTS[action.component];
    }
    return projectHtml;
  }

  // APPLY SUGGESTION BLOCK (adds a suggestion section)
  if (action.type === "APPLY_SUGGESTION") {
    return projectHtml + action.html;
  }

  return projectHtml;
}

// ------------- AUTOPILOT PLAN EXPANSION -------------
export function expandAutopilot(planName) {

  if (planName === "basic-landing") {
    return [
      { type: "SET_TEMPLATE", template: "simple" },
      { type: "ADD_COMPONENT", component: "About" },
      { type: "ADD_COMPONENT", component: "Pricing" },
      { type: "ADD_COMPONENT", component: "FAQ" }
    ];
  }

  if (planName === "fx-starter") {
    return [
      { type: "SET_TEMPLATE", template: "fx" },
      { type: "ADD_COMPONENT", component: "Converter" },
      { type: "ADD_COMPONENT", component: "Rates" },
    ];
  }

  return [];
}

// ------------- SUGGESTION EXPANSION -------------
export function expandSuggestions(mode, projectHtml) {

  if (mode === "light") {
    const blocks = Suggest.light(projectHtml);
    return blocks.map(block => ({
      type: "APPLY_SUGGESTION",
      html: block
    }));
  }

  if (mode === "deep") {
    const blocks = Suggest.deep(projectHtml);
    return blocks.map(block => ({
      type: "APPLY_SUGGESTION",
      html: block
    }));
  }

  if (mode === "ultra") {
    const blocks = Suggest.ultra(projectHtml);
    return blocks.map(block => ({
      type: "APPLY_SUGGESTION",
      html: block
    }));
  }

  return [];
}
