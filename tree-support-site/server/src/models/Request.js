/**
 * Request data model for tree service requests
 */

export class Request {
  constructor(data) {
    this.requestId = data.requestId || this.generateRequestId();
    this.emergencyType = data.emergencyType;
    this.contact = {
      name: data.contact.name,
      email: data.contact.email,
      phone: data.contact.phone
    };
    this.location = {
      address: data.location.address,
      crossStreets: data.location.crossStreets || '',
      district: data.location.district,
      coordinates: data.location.coordinates || null,
      landmarks: data.location.landmarks || ''
    };
    this.description = data.description || '';
    this.submittedAt = data.submittedAt || new Date().toISOString();
    this.status = data.status || 'Submitted';
  }

  generateRequestId() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `REQ-${year}-${random}`;
  }

  static validate(data) {
    const errors = [];

    // Validate emergency type
    const validTypes = ['Fallen or Leaning Tree', 'Branch Hazard', 'Root Damage'];
    if (!data.emergencyType || !validTypes.includes(data.emergencyType)) {
      errors.push('Invalid emergency type');
    }

    // Validate contact info
    if (!data.contact) {
      errors.push('Contact information is required');
    } else {
      if (!data.contact.name || data.contact.name.length < 2 || data.contact.name.length > 100) {
        errors.push('Name must be between 2 and 100 characters');
      }
      if (!data.contact.email || !this.isValidEmail(data.contact.email)) {
        errors.push('Valid email is required');
      }
      if (!data.contact.phone || !this.isValidKoreanPhone(data.contact.phone)) {
        errors.push('Valid Korean phone number is required (010-XXXX-XXXX)');
      }
    }

    // Validate location
    if (!data.location) {
      errors.push('Location information is required');
    } else {
      if (!data.location.address || data.location.address.length < 10) {
        errors.push('Address must be at least 10 characters');
      }
      if (!data.location.district) {
        errors.push('District is required');
      }
      if (data.location.crossStreets && data.location.crossStreets.length > 200) {
        errors.push('Cross streets must be less than 200 characters');
      }
      if (data.location.landmarks && data.location.landmarks.length > 500) {
        errors.push('Landmarks must be less than 500 characters');
      }
    }

    // Validate description
    if (data.description && data.description.length > 2000) {
      errors.push('Description must be less than 2000 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidKoreanPhone(phone) {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
  }

  toJSON() {
    return {
      requestId: this.requestId,
      emergencyType: this.emergencyType,
      contact: this.contact,
      location: this.location,
      description: this.description,
      submittedAt: this.submittedAt,
      status: this.status
    };
  }
}
