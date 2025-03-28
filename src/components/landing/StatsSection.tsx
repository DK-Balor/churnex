import { cn } from '../../utils/cn';

const stats = [
  {
    value: '43%',
    label: 'Average Churn Reduction',
    description: 'Our customers see significant drops in churn rates within 3 months',
  },
  {
    value: '92%',
    label: 'Payment Recovery Rate',
    description: 'Industry-leading success rate in recovering failed payments',
  },
  {
    value: '3.2x',
    label: 'ROI Improvement',
    description: 'Average return on investment improvement for our customers',
  },
  {
    value: '500+',
    label: 'Active Businesses',
    description: 'Growing number of companies trust Churnex with their retention',
  },
];

const StatsSection = () => {
  return (
    <section id="proven-results" className="py-20 bg-brand-dark-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_#10B981,_transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_#10B981,_transparent_50%)]"></div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Proven Results
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Join hundreds of businesses that have transformed their retention metrics with Churnex
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={cn(
                "p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm",
                "hover:border-brand-green/30 hover:bg-white/10 transition-all"
              )}
            >
              <div className="text-3xl md:text-4xl font-bold text-brand-green mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-white mb-2">
                {stat.label}
              </div>
              <p className="text-gray-300 text-sm">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection; 