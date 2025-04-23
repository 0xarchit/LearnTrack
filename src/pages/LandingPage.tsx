import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, Award, Lightbulb, CheckCircle, Bookmark, BarChart, Settings, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 } 
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-white" />,
      title: 'Course Management',
      description: 'Organize and access course materials, syllabi, and schedules all in one place.',
      color: 'bg-primary-500',
    },
    {
      icon: <Users className="h-6 w-6 text-white" />,
      title: 'Streamlined Collaboration',
      description: 'Connect with instructors and peers through integrated communication tools.',
      color: 'bg-secondary-500',
    },
    {
      icon: <Award className="h-6 w-6 text-white" />,
      title: 'Progress Tracking',
      description: 'Track grades, assignments, and academic progress with intuitive analytics.',
      color: 'bg-accent-500',
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-white" />,
      title: 'Smart Recommendations',
      description: 'Receive personalized study recommendations based on your performance.',
      color: 'bg-warning-500',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Computer Science Student',
      content: 'LearnTrack has completely transformed how I manage my coursework. The intuitive interface and progress tracking features help me stay organized and focused.',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Professor of Engineering',
      content: 'As an instructor, LearnTrack makes it incredibly easy to manage multiple courses, grade assignments, and communicate with my students all in one platform.',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Academic Administrator',
      content: 'The administrative features in LearnTrack have significantly reduced our workload. Generating reports and managing academic records is now seamless and efficient.',
      avatar: 'https://images.pexels.com/photos/3921861/pexels-photo-3921861.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-md dark:bg-gray-900 dark:bg-opacity-90 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-500 rounded-lg p-1.5">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">LearnTrack</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">Features</a>
              <a href="#testimonials" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">Testimonials</a>
              <a href="#pricing" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">Pricing</a>
            </div>
            
            <div>
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button>
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login">
                    <Button variant="outline">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" className="hidden md:block">
                    <Button>
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 md:pr-12"
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                variants={fadeIn}
              >
                Empower Your <span className="text-primary-600 dark:text-primary-400">Academic</span> Journey
              </motion.h1>
              <motion.p 
                className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-xl"
                variants={fadeIn}
              >
                LearnTrack streamlines course management, assignment tracking, and grade monitoring in one unified platform for students, faculty, and administrators.
              </motion.p>
              <motion.div 
                className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
                variants={fadeIn}
              >
                <Link to="/register">
                  <Button size="lg" rightIcon={<ChevronRight size={20} />}>
                    Get Started for Free
                  </Button>
                </Link>
                <a href="#features">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </a>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 mt-12 md:mt-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="LearnTrack Dashboard" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 to-transparent pointer-events-none"></div>
              </div>
            </motion.div>
          </div>
          
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center"
            >
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">200+</div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Institutions</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col items-center"
            >
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">50k+</div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Active Users</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col items-center"
            >
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">5k+</div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Courses</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col items-center"
            >
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">97%</div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Everything you need to succeed
            </motion.h2>
            <motion.p 
              className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Our comprehensive platform helps students, faculty, and administrators streamline the educational process.
            </motion.p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className={`rounded-lg p-3 w-12 h-12 flex items-center justify-center ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">For Students</h3>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Stay on top of your academic journey with intuitive tools designed to help you succeed.
                </p>
                <ul className="mt-6 space-y-4">
                  {[
                    'View course schedules and syllabi',
                    'Submit assignments and track grades',
                    'Access study materials and resources',
                    'Monitor academic progress analytics',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start"
                      >
                        <CheckCircle className="h-6 w-6 text-primary-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div
                className="rounded-xl overflow-hidden shadow-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src="https://images.pexels.com/photos/4050342/pexels-photo-4050342.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Student Dashboard" 
                  className="w-full h-auto"
                />
              </motion.div>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                className="rounded-xl overflow-hidden shadow-xl md:order-1"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src="https://images.pexels.com/photos/5212703/pexels-photo-5212703.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Faculty Dashboard" 
                  className="w-full h-auto"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="md:order-2"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">For Faculty</h3>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Streamline your teaching workflow and focus more on what matters—educating your students.
                </p>
                <ul className="mt-6 space-y-4">
                  {[
                    'Create and manage course content',
                    'Grade assignments and provide feedback',
                    'Track student performance and engagement',
                    'Communicate efficiently with students',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start"
                      >
                        <CheckCircle className="h-6 w-6 text-secondary-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <div className="mt-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                  className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Bookmark className="h-8 w-8 text-primary-500" />
                  <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Resource Management</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Centralized storage for all course materials, lecture notes, and additional resources.
                  </p>
                </motion.div>
                
                <motion.div
                  className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <BarChart className="h-8 w-8 text-secondary-500" />
                  <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Performance Analytics</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Detailed insights into academic progress with visual representations and key metrics.
                  </p>
                </motion.div>
                
                <motion.div
                  className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Settings className="h-8 w-8 text-accent-500" />
                  <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Customizable Workflows</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Adapt the platform to your specific needs with flexible configuration options.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Loved by students and educators
            </motion.h2>
            <motion.p 
              className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Hear what our users have to say about their experience with LearnTrack.
            </motion.p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img 
                      className="h-12 w-12 rounded-full object-cover" 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-700 dark:text-gray-300 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-800 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Simple, transparent pricing
            </motion.h2>
            <motion.p 
              className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Choose the plan that fits your institution's needs.
            </motion.p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Starter</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">$99</span>
                  <span className="ml-1 text-xl text-gray-500 dark:text-gray-400">/month</span>
                </div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Perfect for small educational institutions and individual instructors.
                </p>
              </div>
              <div className="px-6 pb-6">
                <ul className="mt-6 space-y-4">
                  {[
                    'Up to 500 users',
                    'Basic analytics',
                    'Course management',
                    'Assignment tracking',
                    'Email support',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link to="/register">
                    <Button fullWidth variant="outline">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-primary-600 rounded-xl shadow-lg overflow-hidden relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <div className="bg-warning-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Popular
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white">Professional</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold text-white">$249</span>
                  <span className="ml-1 text-xl text-primary-200">/month</span>
                </div>
                <p className="mt-4 text-primary-100">
                  Ideal for medium-sized schools and educational departments.
                </p>
              </div>
              <div className="px-6 pb-6">
                <ul className="mt-6 space-y-4">
                  {[
                    'Up to 2,000 users',
                    'Advanced analytics',
                    'Course management',
                    'Assignment tracking',
                    'Priority support',
                    'Custom branding',
                    'API access',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary-200 mr-2 flex-shrink-0" />
                      <span className="text-white">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link to="/register">
                    <Button
                      fullWidth
                      className="
                        bg-white text-primary-600 hover:bg-gray-100
                        dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700
                      "
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Enterprise</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">Custom</span>
                </div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Tailored solutions for large educational institutions and universities.
                </p>
              </div>
              <div className="px-6 pb-6">
                <ul className="mt-6 space-y-4">
                  {[
                    'Unlimited users',
                    'Comprehensive analytics',
                    'Advanced course management',
                    'Custom integrations',
                    '24/7 dedicated support',
                    'Custom branding',
                    'API access',
                    'Single sign-on',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button fullWidth>
                    Contact Sales
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            className="bg-primary-600 rounded-2xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-8 md:p-12 lg:flex lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Ready to transform your learning experience?</h2>
                <p className="mt-4 text-lg text-primary-100 max-w-lg">
                  Join thousands of students and educators who are already using LearnTrack to streamline their academic workflow.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:ml-8">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="
                      bg-white text-primary-600 
                      hover:bg-gray-100 
                      shadow-lg 
                      transition-colors duration-200
                      dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700
                    "
                  >
                    Get Started for Free
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2">
                <div className="bg-primary-500 rounded-lg p-1.5">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">LearnTrack</span>
              </div>
              <p className="mt-4 text-gray-400 text-sm">
                Empowering education through innovative technology.
              </p>
              <div className="mt-6 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white" title='blank'>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white" title='blank'>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white" title='blank'>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Product</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Testimonials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Case Studies</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Knowledge Base</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} LearnTrack. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm mr-4">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm mr-4">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;