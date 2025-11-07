// Unit Tests for Form Component

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Form from "../../components/Form";

describe("Form Component", () => {
  const mockFields = [
    {
      name: "username",
      label: "Username",
      type: "text",
      required: true,
      placeholder: "Enter username",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "Enter email",
      validation: (value) => {
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        return emailRegex.test(value) ? "" : "Invalid email format";
      },
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      placeholder: "Enter password",
    },
  ];

  it("renders all form fields", () => {
    render(<Form fields={mockFields} onSubmit={() => {}} />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders submit button with default text", () => {
    render(<Form fields={mockFields} onSubmit={() => {}} />);

    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("renders submit button with custom text", () => {
    render(
      <Form fields={mockFields} onSubmit={() => {}} submitText="Sign Up" />
    );

    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it("updates field values on input change", () => {
    render(<Form fields={mockFields} onSubmit={() => {}} />);

    const usernameInput = screen.getByLabelText(/username/i);
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    expect(usernameInput).toHaveValue("testuser");
  });

  it("calls onSubmit with form data when submitted with valid data", async () => {
    const handleSubmit = jest.fn();
    render(<Form fields={mockFields} onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("shows validation errors for required fields", async () => {
    render(<Form fields={mockFields} onSubmit={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it("runs custom validation for fields", async () => {
    render(<Form fields={mockFields} onSubmit={() => {}} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "invalid-email" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it("clears field error when user starts typing", () => {
    render(<Form fields={mockFields} onSubmit={() => {}} />);

    // Submit to trigger validation
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Start typing in email field
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "t" } });

    // Error should not be visible anymore (or will be shown after blur)
    const emailError = screen.queryByText(/email is required/i);
    expect(emailError).not.toBeInTheDocument();
  });

  it("disables form fields when isLoading is true", () => {
    render(<Form fields={mockFields} onSubmit={() => {}} isLoading={true} />);

    expect(screen.getByLabelText(/username/i)).toBeDisabled();
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    expect(screen.getByLabelText(/password/i)).toBeDisabled();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows loading text on submit button when isLoading is true", () => {
    render(<Form fields={mockFields} onSubmit={() => {}} isLoading={true} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("populates form with initial values", () => {
    const initialValues = {
      username: "john",
      email: "john@example.com",
      password: "pass123",
    };

    render(
      <Form
        fields={mockFields}
        onSubmit={() => {}}
        initialValues={initialValues}
      />
    );

    expect(screen.getByLabelText(/username/i)).toHaveValue("john");
    expect(screen.getByLabelText(/email/i)).toHaveValue("john@example.com");
    expect(screen.getByLabelText(/password/i)).toHaveValue("pass123");
  });
});
