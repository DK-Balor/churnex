import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="relative isolate overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/20">
                What's new
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-muted-foreground">
                <span>Just shipped v1.0</span>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </a>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            AI-Powered Customer Retention Platform
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Predict and prevent customer churn with our advanced AI analytics. Get actionable insights to keep your customers happy and loyal.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Button size="lg" onClick={() => navigate('/signup')}>
              Get started
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/demo')}>
              Try demo
            </Button>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <Brain className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
} 