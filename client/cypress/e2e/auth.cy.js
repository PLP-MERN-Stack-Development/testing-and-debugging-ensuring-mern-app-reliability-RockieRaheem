// E2E Test - User Authentication Flow

describe("Authentication Flow", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.logout();
  });

  describe("User Registration", () => {
    it("should register a new user successfully", () => {
      const timestamp = Date.now();
      const username = `testuser${timestamp}`;
      const email = `test${timestamp}@example.com`;
      const password = "Password123";

      // Navigate to registration page (if exists)
      cy.visit("/register");

      // Fill out registration form
      cy.get('input[name="username"]').type(username);
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);

      // Submit form
      cy.get('button[type="submit"]').click();

      // Verify successful registration
      cy.url().should("include", "/dashboard");
      cy.contains(username).should("be.visible");
    });

    it("should show validation errors for invalid input", () => {
      cy.visit("/register");

      // Submit empty form
      cy.get('button[type="submit"]').click();

      // Check for validation errors
      cy.contains(/required/i).should("be.visible");
    });

    it("should prevent registration with existing email", () => {
      const email = "existing@example.com";

      // Register first user
      cy.register("user1", email, "Password123");
      cy.logout();

      cy.visit("/register");

      // Try to register with same email
      cy.get('input[name="username"]').type("user2");
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type("Password123");
      cy.get('button[type="submit"]').click();

      // Verify error message
      cy.contains(/already exists/i).should("be.visible");
    });
  });

  describe("User Login", () => {
    const testUser = {
      username: "logintest",
      email: "logintest@example.com",
      password: "Password123",
    };

    beforeEach(() => {
      // Create test user
      cy.register(testUser.username, testUser.email, testUser.password);
      cy.logout();
    });

    it("should login with valid credentials", () => {
      cy.visit("/login");

      cy.get('input[name="email"]').type(testUser.email);
      cy.get('input[name="password"]').type(testUser.password);
      cy.get('button[type="submit"]').click();

      cy.url().should("include", "/dashboard");
      cy.contains(testUser.username).should("be.visible");
    });

    it("should show error for invalid credentials", () => {
      cy.visit("/login");

      cy.get('input[name="email"]').type(testUser.email);
      cy.get('input[name="password"]').type("WrongPassword");
      cy.get('button[type="submit"]').click();

      cy.contains(/invalid credentials/i).should("be.visible");
    });

    it("should logout successfully", () => {
      cy.login(testUser.email, testUser.password);
      cy.visit("/dashboard");

      cy.get("button")
        .contains(/logout/i)
        .click();

      cy.url().should("not.include", "/dashboard");
    });
  });
});
