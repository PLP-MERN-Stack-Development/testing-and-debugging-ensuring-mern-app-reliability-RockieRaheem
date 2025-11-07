// Validation Utilities for Client

export const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Please enter a valid email";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return "";
};

export const validateUsername = (username) => {
  if (!username) return "Username is required";
  if (username.length < 3) return "Username must be at least 3 characters";
  if (username.length > 30) return "Username cannot exceed 30 characters";
  return "";
};

export const validateRequired = (value, fieldName = "This field") => {
  if (!value || !value.toString().trim()) {
    return `${fieldName} is required`;
  }
  return "";
};

export const validateMinLength = (
  value,
  minLength,
  fieldName = "This field"
) => {
  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return "";
};

export const validateMaxLength = (
  value,
  maxLength,
  fieldName = "This field"
) => {
  if (value && value.length > maxLength) {
    return `${fieldName} cannot exceed ${maxLength} characters`;
  }
  return "";
};
