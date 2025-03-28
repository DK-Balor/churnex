import { Mail, Phone, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark-900 mb-6">
              Ready to reduce churn?
            </h2>
            <p className="text-lg text-brand-dark-600 mb-8">
              Get in touch with our team to learn how Churnex can help your business retain more customers
              and increase revenue.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-brand-green mt-1" />
                <div>
                  <h3 className="font-semibold text-brand-dark-900 mb-1">Email Us</h3>
                  <p className="text-brand-dark-600">
                    <a href="mailto:hello@churnex.com" className="hover:text-brand-green transition-colors">
                      hello@churnex.com
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-brand-green mt-1" />
                <div>
                  <h3 className="font-semibold text-brand-dark-900 mb-1">Call Us</h3>
                  <p className="text-brand-dark-600">
                    <a href="tel:+442012345678" className="hover:text-brand-green transition-colors">
                      +44 20 1234 5678
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <MessageSquare className="w-6 h-6 text-brand-green mt-1" />
                <div>
                  <h3 className="font-semibold text-brand-dark-900 mb-1">Live Chat</h3>
                  <p className="text-brand-dark-600">
                    Available Monday to Friday<br />9am - 6pm GMT
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-semibold text-brand-dark-900 mb-6">
              Get Started Today
            </h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-brand-dark-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brand-dark-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                  placeholder="you@company.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-brand-dark-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                  placeholder="Tell us about your needs..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-green text-white py-3 px-6 rounded-lg font-medium hover:bg-brand-green-600 transition-colors"
              >
                Send Message
              </button>
            </form>

            <p className="mt-6 text-sm text-brand-dark-500 text-center">
              Or{' '}
              <Link to="/demo/dashboard" className="text-brand-green hover:text-brand-green-600">
                explore our demo dashboard
              </Link>{' '}
              to see Churnex in action.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 