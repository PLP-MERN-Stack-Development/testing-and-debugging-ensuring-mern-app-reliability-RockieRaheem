// Unit Tests for Input Component

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from '../../components/Input';

describe('Input Component', () => {
  it('renders with label', () => {
    render(
      <Input
        label="Email"
        name="email"
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(
      <Input
        name="email"
        value=""
        onChange={() => {}}
        placeholder="Enter email"
      />
    );

    expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
  });

  it('displays required asterisk when required prop is true', () => {
    render(
      <Input
        label="Email"
        name="email"
        value=""
        onChange={() => {}}
        required
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('calls onChange handler when input value changes', () => {
    const handleChange = jest.fn();
    render(
      <Input
        label="Email"
        name="email"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('calls onBlur handler when input loses focus', () => {
    const handleBlur = jest.fn();
    render(
      <Input
        label="Email"
        name="email"
        value=""
        onChange={() => {}}
        onBlur={handleBlur}
      />
    );

    const input = screen.getByLabelText(/email/i);
    fireEvent.blur(input);

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('displays error message after blur when error prop is provided', () => {
    render(
      <Input
        label="Email"
        name="email"
        value=""
        onChange={() => {}}
        error="Email is required"
      />
    );

    const input = screen.getByLabelText(/email/i);
    fireEvent.blur(input);

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it('applies error class when error is shown', () => {
    render(
      <Input
        label="Email"
        name="email"
        value=""
        onChange={() => {}}
        error="Email is required"
      />
    );

    const input = screen.getByLabelText(/email/i);
    fireEvent.blur(input);

    expect(input).toHaveClass('input-error');
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <Input
        label="Email"
        name="email"
        value=""
        onChange={() => {}}
        disabled
      />
    );

    expect(screen.getByLabelText(/email/i)).toBeDisabled();
  });

  it('accepts different input types', () => {
    const { rerender } = render(
      <Input
        label="Password"
        name="password"
        type="password"
        value=""
        onChange={() => {}}
      />
    );

    let input = screen.getByLabelText(/password/i);
    expect(input).toHaveAttribute('type', 'password');

    rerender(
      <Input
        label="Email"
        name="email"
        type="email"
        value=""
        onChange={() => {}}
      />
    );

    input = screen.getByLabelText(/email/i);
    expect(input).toHaveAttribute('type', 'email');
  });

  it('passes additional props to input element', () => {
    render(
      <Input
        label="Email"
        name="email"
        value=""
        onChange={() => {}}
        data-testid="email-input"
        maxLength={50}
      />
    );

    const input = screen.getByTestId('email-input');
    expect(input).toHaveAttribute('maxLength', '50');
  });
});
