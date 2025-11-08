/**
 * Form validation rules for service request form
 */

export const validationRules = {
  emergencyType: {
    required: 'Emergency type is required',
  },

  'contact.name': {
    required: 'Name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters',
    },
    maxLength: {
      value: 100,
      message: 'Name must be less than 100 characters',
    },
    pattern: {
      value: /^[a-zA-Z\s\-()]+$/,
      message: 'Name can only contain letters, spaces, hyphens, and parentheses',
    },
  },

  'contact.email': {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    },
  },

  'contact.phone': {
    required: 'Phone number is required',
    pattern: {
      value: /^010-\d{4}-\d{4}$/,
      message: 'Phone must be in format: 010-XXXX-XXXX',
    },
  },

  'location.address': {
    required: 'Address is required',
    minLength: {
      value: 10,
      message: 'Address must be at least 10 characters',
    },
  },

  'location.district': {
    required: 'District is required',
  },

  'location.crossStreets': {
    maxLength: {
      value: 200,
      message: 'Cross streets must be less than 200 characters',
    },
  },

  'location.landmarks': {
    maxLength: {
      value: 500,
      message: 'Landmarks must be less than 500 characters',
    },
  },

  description: {
    maxLength: {
      value: 2000,
      message: 'Description must be less than 2000 characters',
    },
  },
};
