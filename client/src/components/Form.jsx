// Form Component - Reusable form with validation

import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';
import './Form.css';

const Form = ({
  fields,
  onSubmit,
  submitText = 'Submit',
  isLoading = false,
  initialValues = {}
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    fields.forEach(field => {
      const value = formData[field.name] || '';

      if (field.required && !value.trim()) {
        newErrors[field.name] = `${field.label} is required`;
      }

      if (field.validation && value) {
        const validationError = field.validation(value);
        if (validationError) {
          newErrors[field.name] = validationError;
        }
      }
    });

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form" noValidate>
      {fields.map(field => (
        <Input
          key={field.name}
          label={field.label}
          type={field.type || 'text'}
          name={field.name}
          value={formData[field.name] || ''}
          onChange={handleChange}
          error={errors[field.name]}
          placeholder={field.placeholder}
          required={field.required}
          disabled={isLoading}
        />
      ))}
      <Button
        type="submit"
        variant="primary"
        disabled={isLoading}
        className="form-submit-button"
      >
        {isLoading ? 'Loading...' : submitText}
      </Button>
    </form>
  );
};

export default Form;
