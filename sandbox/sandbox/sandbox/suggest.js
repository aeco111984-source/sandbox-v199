// ----------------------------------------------------------
// SUGGEST ENGINE — v1.99
// Light / Deep / Ultra suggestion logic
// ----------------------------------------------------------

import { COMPONENTS } from "./components.js";

// Helper for clean list rendering
function wrap(text) {
  return `<section class="sandbox-section"><p>${text}</p></section>`;
}

export const Suggest = {

  // ---------------- LIGHT MODE ----------------
  light(projectHtml) {
    return [

      wrap("Suggested: Improve spacing. Try increasing padding on key sections."),

      wrap("Suggested: Add a Pricing section for clarity."),
      
      wrap("Suggested: Add an About block so users know who you are."),
      
      wrap("Suggested: Add a FAQ block to reduce user friction."),
      
      wrap("Suggested: Improve typography-size for readability.")

    ];
  },

  // ---------------- DEEP MODE ----------------
  deep(projectHtml) {

    const suggestions = [];

    suggestions.push(wrap("Deep Suggestion: Add stronger hero copy — your value must be obvious in 3 seconds."));
    suggestions.push(wrap("Deep Suggestion: Add Pricing + FAQ + Testimonials to maximize conversions."));
    suggestions.push(wrap("Deep Suggestion: Improve spacing / balance — consider more whitespace."));
    suggestions.push(wrap("Deep Suggestion: Add CTAs — buttons should be visible above the fold."));
    suggestions.push(wrap("Deep Suggestion: Improve visual hierarchy (bigger titles, cleaner blocks)."));
    suggestions.push(wrap("Deep Suggestion: Add Contact form to build trust."));
    suggestions.push(wrap("Deep Suggestion: Add Footer for navigation + credibility."));

    return suggestions;
  },

  // ---------------- ULTRA MODE ----------------
  ultra(projectHtml) {

    const ultra = [];

    // UX Boost
    ultra.push(wrap("Ultra UX: Add Hero + Pricing + FAQ + Testimonials + Contact for a complete funnel."));

    // Content Boost
    ultra.push(wrap("Ultra Content: Add a bold headline with a direct benefit statement."));

    // Conversion Boost
    ultra.push(wrap("Ultra Conversion: Add a strong CTA button with action verbs (Start, Get, Build)."));

    // Structure Boost
    ultra.push(wrap("Ultra Structure: Reorder sections to Hero → Benefits → Pricing → FAQ → Testimonials → Contact."));

    return ultra;
  },

  // ---------------- COMPONENT INSERT HANDLER ----------------
  applyComponent(type) {
    if (COMPONENTS[type]) {
      return COMPONENTS[type];
    }
    return wrap(`Unknown component type: ${type}`);
  }
};
