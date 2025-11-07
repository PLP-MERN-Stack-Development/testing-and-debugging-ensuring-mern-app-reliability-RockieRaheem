// Cypress E2E Support File

// Import commands
import "./commands";

// Hide fetch/XHR requests from command log
const app = window.top;
if (!app.document.head.querySelector("[data-hide-command-log-request]")) {
  const style = app.document.createElement("style");
  style.innerHTML =
    ".command-name-request, .command-name-xhr { display: none }";
  style.setAttribute("data-hide-command-log-request", "");
  app.document.head.appendChild(style);
}

// Prevent Cypress from failing tests on uncaught exceptions
Cypress.on("uncaught:exception", (err, runnable) => {
  // Return false to prevent the error from failing this test
  return false;
});
