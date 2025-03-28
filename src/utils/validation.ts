export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (password.length < 8) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 8 characters long',
    });
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one uppercase letter',
    });
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one lowercase letter',
    });
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one number',
    });
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one special character (!@#$%^&*)',
    });
  }
  
  return errors;
};

export const validateName = (name: string): boolean => {
  return name.length >= 2 && /^[a-zA-Z\s-]+$/.test(name);
};

export const validateCompanyName = (name: string): boolean => {
  return name.length >= 2;
};

export const validateSubject = (subject: string): boolean => {
  return subject.length >= 5;
};

export const validateMessage = (message: string): boolean => {
  return message.length >= 10;
}; 