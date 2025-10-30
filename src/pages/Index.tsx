import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users, TrendingUp, Upload } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      icon: BookOpen,
      title: 'Comprehensive Resources',
      description: 'Access notes, videos, past papers, and tutorials all in one place',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Share and discover resources contributed by fellow students',
    },
    {
      icon: TrendingUp,
      title: 'Smart Analytics',
      description: 'Track important topics and trending resources for exam prep',
    },
    {
      icon: Upload,
      title: 'Easy Contribution',
      description: 'Upload and organize your resources to help the community',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-primary-foreground lg:text-6xl">
              Your Academic Success Hub
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/90 lg:text-xl">
              LearnLink connects students with the best study resources, mentorship opportunities,
              and collaborative learning tools to excel in academics.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90">
                <Link to="/login">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                <Link to="/signup">Create Account</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">Why Choose LearnLink?</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Everything you need to succeed academically, organized and accessible
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="rounded-lg border bg-card p-6 text-center transition-shadow hover:shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">Ready to Transform Your Learning?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of students already using LearnLink to achieve their academic goals
            </p>
            <Button size="lg" asChild>
              <Link to="/signup">
                Start Learning Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
