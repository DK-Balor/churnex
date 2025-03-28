import { Brain, TrendingUp, CreditCard, Users, Bell, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Predictions',
    description: 'Predict customer churn with up to 94% accuracy using our advanced machine learning models.',
  },
  {
    icon: TrendingUp,
    title: 'Revenue Recovery',
    description: 'Automatically recover failed payments and reduce involuntary churn with smart retry logic.',
  },
  {
    icon: CreditCard,
    title: 'Smart Dunning',
    description: 'Optimize payment recovery with personalized dunning campaigns and intelligent retry timing.',
  },
  {
    icon: Users,
    title: 'Customer Segmentation',
    description: 'Segment customers by risk level and behavior to create targeted retention strategies.',
  },
  {
    icon: Bell,
    title: 'Early Warning System',
    description: 'Get alerted to at-risk customers before they churn with our early warning system.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track key metrics and get actionable insights with our comprehensive analytics dashboard.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark-900 mb-4">
            Everything you need to reduce churn
          </h2>
          <p className="text-lg text-brand-dark-600 max-w-2xl mx-auto">
            Our platform combines AI-powered predictions with powerful tools to help you identify,
            prevent, and reduce customer churn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-lg border border-gray-100 hover:border-brand-green/20 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-brand-green-50 flex items-center justify-center mb-4 group-hover:bg-brand-green-100 transition-colors">
                  <Icon className="w-6 h-6 text-brand-green" />
                </div>
                <h3 className="text-xl font-semibold text-brand-dark-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-brand-dark-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 