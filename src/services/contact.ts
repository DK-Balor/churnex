import { validateEmail, validateName, validateSubject, validateMessage } from '../utils/validation';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface ContactError {
  field: string;
  message: string;
}

class ContactService {
  private readonly MESSAGES_KEY = 'churnex_contact_messages';

  private getMessages(): ContactMessage[] {
    const messages = localStorage.getItem(this.MESSAGES_KEY);
    return messages ? JSON.parse(messages) : [];
  }

  private saveMessages(messages: ContactMessage[]): void {
    localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(messages));
  }

  async submitMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; errors?: ContactError[] }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const errors: ContactError[] = [];

    if (!validateName(data.name)) {
      errors.push({
        field: 'name',
        message: 'Please enter a valid name (at least 2 characters, letters only)',
      });
    }

    if (!validateEmail(data.email)) {
      errors.push({
        field: 'email',
        message: 'Please enter a valid email address',
      });
    }

    if (!validateSubject(data.subject)) {
      errors.push({
        field: 'subject',
        message: 'Subject must be at least 5 characters long',
      });
    }

    if (!validateMessage(data.message)) {
      errors.push({
        field: 'message',
        message: 'Message must be at least 10 characters long',
      });
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    const newMessage: ContactMessage = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date().toISOString(),
    };

    const messages = this.getMessages();
    messages.push(newMessage);
    this.saveMessages(messages);

    // In a real app, we would send this to a server and possibly send an email notification
    return { success: true };
  }
}

export const contactService = new ContactService(); 