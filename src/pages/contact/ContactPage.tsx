import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '@/components/common/Header';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    contactInfo: true,
    nextSteps: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Handle form submission here
    console.log('Form submitted:', formData);
    setTimeout(() => setIsLoading(false), 1000); // Simulate API call
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center py-20 px-4">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Contact Us</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-brand-dark-700 mb-1">
                      Full name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-brand-dark-700 mb-1">
                      Email address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-brand-dark-700 mb-1">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-brand-dark-700 mb-1">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full min-h-[100px]"
                      disabled={isLoading}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-brand-green text-white hover:bg-brand-green-600"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <button
                    onClick={() => toggleSection('contactInfo')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div>
                      <CardTitle>Get in Touch</CardTitle>
                      <CardDescription>Here's how you can reach us</CardDescription>
                    </div>
                    {expandedSections.contactInfo ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </CardHeader>
                {expandedSections.contactInfo && (
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <Mail className="w-5 h-5 text-brand-green mt-1" />
                      <div>
                        <h3 className="font-medium text-brand-dark-900">Email</h3>
                        <p className="text-brand-dark-600">sales@churnex.com</p>
                        <p className="text-brand-dark-600">support@churnex.com</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Phone className="w-5 h-5 text-brand-green mt-1" />
                      <div>
                        <h3 className="font-medium text-brand-dark-900">Phone</h3>
                        <p className="text-brand-dark-600">+44 (0) 20 1234 5678</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <MapPin className="w-5 h-5 text-brand-green mt-1" />
                      <div>
                        <h3 className="font-medium text-brand-dark-900">Office</h3>
                        <p className="text-brand-dark-600">
                          123 Tech Street<br />
                          London, EC2A 1NT<br />
                          United Kingdom
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Clock className="w-5 h-5 text-brand-green mt-1" />
                      <div>
                        <h3 className="font-medium text-brand-dark-900">Business Hours</h3>
                        <p className="text-brand-dark-600">
                          Monday - Friday: 9:00 AM - 6:00 PM GMT<br />
                          Saturday - Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              <Card>
                <CardHeader>
                  <button
                    onClick={() => toggleSection('nextSteps')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div>
                      <CardTitle>What Happens Next?</CardTitle>
                      <CardDescription>Our sales process is simple and fast</CardDescription>
                    </div>
                    {expandedSections.nextSteps ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </CardHeader>
                {expandedSections.nextSteps && (
                  <CardContent>
                    <ol className="space-y-4">
                      <li className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center">1</span>
                        <p className="text-brand-dark-600">We'll review your message within 24 hours</p>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center">2</span>
                        <p className="text-brand-dark-600">Our sales team will contact you to discuss your needs</p>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center">3</span>
                        <p className="text-brand-dark-600">We'll prepare a custom demo and proposal for your business</p>
                      </li>
                    </ol>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 