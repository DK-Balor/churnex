import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

const tiers = [
  {
    name: 'Growth',
    price: '£59',
    description: 'Perfect for startups and small businesses',
    features: [
      'Up to 500 subscribers',
      'Basic churn predictions',
      'Email recovery campaigns',
      'Standard analytics',
      'Email support'
    ],
  },
  {
    name: 'Scale',
    price: '£119',
    description: 'For growing businesses with more subscribers',
    features: [
      'Up to 2,000 subscribers',
      'Advanced AI predictions',
      'Multi-channel recovery',
      'Advanced analytics',
      'Priority support',
      'Custom integrations',
      'Dedicated success manager'
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with custom needs',
    features: [
      'Unlimited subscribers',
      'Custom AI models',
      'Full integration suite',
      'White-label options',
      'Custom reporting',
      'Dedicated account manager',
      '99.9% SLA',
      '24/7 phone support'
    ],
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-brand-dark-600 max-w-2xl mx-auto">
            Start with our free trial, no credit card required. Scale your plan as your business grows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col h-full bg-white rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl",
                tier.popular
                  ? "ring-2 ring-brand-green shadow-lg scale-105 md:scale-110"
                  : "border border-gray-200"
              )}
            >
              {tier.popular && (
                <div className="bg-brand-green text-white py-2 px-4 text-center text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="p-8 flex-grow">
                <h3 className="text-xl font-semibold text-brand-dark-900 mb-2">{tier.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-brand-dark-900">{tier.price}</span>
                  {tier.price !== 'Custom' && (
                    <span className="text-brand-dark-600 ml-2">/month</span>
                  )}
                </div>
                <p className="text-brand-dark-600 mb-6">{tier.description}</p>
                
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-brand-green shrink-0 mr-3" />
                      <span className="text-brand-dark-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 pt-0">
                <Link
                  to="/contact"
                  className={cn(
                    "block text-center py-3 px-6 rounded-lg font-medium transition-all duration-200",
                    tier.popular
                      ? "bg-brand-green text-white hover:bg-brand-green-600"
                      : "bg-white text-brand-dark-900 border-2 border-brand-dark-200 hover:border-brand-green hover:text-brand-green"
                  )}
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-brand-dark-500">
            Contact our sales team to learn more about our pricing plans and get started.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection; 