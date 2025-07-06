import {
  EJS_PRIVATE_KEY,
  EJS_PUBLIC_KEY,
  EJS_SERVICE_ID,
  EJS_TEMPLATE_ID,
} from '@/config/env.config';
import emailjs from '@emailjs/nodejs';

interface EmailResponse {
  status: number;
  text: string;
}

export default class EmailJS {
  #email: string;
  #message: string = '';

  constructor(email: string) {
    this.#email = email;
  }

  setMessage(message: string) {
    this.#message = message;
  }

  #validateAttributes() {
    if (!this.#message) throw new Error('Please include a message');
  }

  async send(): Promise<EmailResponse> {
    try {
      const serviceId = EJS_SERVICE_ID;
      const templateId = EJS_TEMPLATE_ID;
      const publicKey = EJS_PUBLIC_KEY;
      const privateKey = EJS_PRIVATE_KEY;

      this.#validateAttributes();

      const result = await emailjs.send(
        serviceId,
        templateId,
        {
          email: this.#email,
          message: this.#message,
        },
        {
          publicKey,
          privateKey,
        },
      );
      return result;
    } catch (error) {
      console.error(error);
      const { status, text } = error as EmailResponse;
      return { status, text };
    }
  }
}
