// E2E Test - Posts CRUD Operations

describe("Posts CRUD Operations", () => {
  const testUser = {
    username: "posttester",
    email: "posttester@example.com",
    password: "Password123",
  };

  before(() => {
    // Register and login test user
    cy.register(testUser.username, testUser.email, testUser.password);
  });

  beforeEach(() => {
    cy.login(testUser.email, testUser.password);
    cy.visit("/");
  });

  describe("View Posts", () => {
    it("should display list of posts on homepage", () => {
      cy.get('[data-testid="post-card"]').should("exist");
    });

    it("should show post details when clicking on a post", () => {
      cy.get('[data-testid="post-card"]').first().click();

      cy.url().should("include", "/posts/");
      cy.get("h1").should("be.visible");
    });

    it("should handle empty posts list", () => {
      // Mock empty response or navigate to page with no posts
      cy.visit("/posts?category=nonexistent");

      cy.contains(/no posts found/i).should("be.visible");
    });
  });

  describe("Create Post", () => {
    it("should create a new post successfully", () => {
      const postTitle = `Test Post ${Date.now()}`;
      const postContent = "This is a test post content for E2E testing.";

      cy.visit("/posts/new");

      cy.get('input[name="title"]').type(postTitle);
      cy.get('textarea[name="content"]').type(postContent);
      cy.get('button[type="submit"]').click();

      // Verify post was created
      cy.contains(postTitle).should("be.visible");
      cy.contains(postContent).should("be.visible");
    });

    it("should show validation errors for empty fields", () => {
      cy.visit("/posts/new");

      cy.get('button[type="submit"]').click();

      cy.contains(/required/i).should("be.visible");
    });
  });

  describe("Edit Post", () => {
    let postId;

    beforeEach(() => {
      // Create a post to edit
      cy.createPost("Post to Edit", "Original content").then((response) => {
        postId = response.body._id;
      });
    });

    it("should edit an existing post", () => {
      cy.visit(`/posts/${postId}/edit`);

      const updatedTitle = "Updated Post Title";
      const updatedContent = "Updated post content";

      cy.get('input[name="title"]').clear().type(updatedTitle);
      cy.get('textarea[name="content"]').clear().type(updatedContent);
      cy.get('button[type="submit"]').click();

      // Verify updates
      cy.contains(updatedTitle).should("be.visible");
      cy.contains(updatedContent).should("be.visible");
    });
  });

  describe("Delete Post", () => {
    it("should delete a post", () => {
      // Create a post to delete
      cy.createPost("Post to Delete", "This post will be deleted");

      cy.visit("/posts");

      // Find the post and delete it
      cy.contains("Post to Delete")
        .parents('[data-testid="post-card"]')
        .find("button")
        .contains(/delete/i)
        .click();

      // Confirm deletion
      cy.on("window:confirm", () => true);

      // Verify post is deleted
      cy.contains("Post to Delete").should("not.exist");
    });
  });

  describe("Like Post", () => {
    it("should like a post", () => {
      cy.visit("/");

      // Get initial like count
      cy.get('[data-testid="post-card"]')
        .first()
        .within(() => {
          cy.get(".stat")
            .contains(/likes/i)
            .invoke("text")
            .then((text) => {
              const initialLikes = parseInt(text.match(/\d+/)[0]);

              // Click like button
              cy.get("button").contains(/like/i).click();

              // Wait and verify like count increased
              cy.wait(1000);
              cy.get(".stat")
                .contains(/likes/i)
                .should("contain", initialLikes + 1);
            });
        });
    });
  });
});
