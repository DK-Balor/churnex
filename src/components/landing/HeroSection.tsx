import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const HeroSection: React.FC<{ onLearnMore: () => void }> = ({ onLearnMore }) => {
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative isolate overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-brand-green/10 px-3 py-1 text-sm font-semibold leading-6 text-brand-green ring-1 ring-inset ring-brand-green/20">
                What's new
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                <span>Just shipped v1.0</span>
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </span>
            </a>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Stop Customer Churn Before It Happens
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Churnex uses AI to predict customer churn and help you take proactive action. Get real-time insights, automated alerts, and actionable recommendations.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              to="/demo"
              className="rounded-md bg-brand-green px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-green/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              Try Revenue Recovery Dashboard
            </Link>
            <Link to="/contact" className="text-sm font-semibold leading-6 text-gray-900">
              Contact Sales <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <img
              src="/dashboard-preview.png"
              alt="App screenshot"
              width={2432}
              height={1442}
              className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 