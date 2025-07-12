import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Search, 
  ArrowRight, 
  Users, 
  Star, 
  Zap, 
  Shield, 
  Globe, 
  Heart,
  ChevronRight,
  PlayCircle
} from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import SkillCard from '../components/ui/SkillCard'

function Home() {
  const { skills, isAuthenticated, sendSwapRequest } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const featuredSkills = skills.slice(0, 6)

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`)
    } else {
      navigate('/browse')
    }
  }

  const handleRequestSwap = (skill) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    // Create swap request
    const requestData = {
      requester: {
        id: 1, // Current user ID
        name: 'Current User',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      skillRequested: skill.title,
      skillOffered: 'Your Skill', // This would come from a modal/form
      status: 'pending',
      message: `Hi! I'm interested in learning ${skill.title}. Would you like to exchange skills?`,
      createdAt: new Date().toISOString()
    }
    
    sendSwapRequest(requestData)
    navigate('/requests')
  }

  const handleMessage = (skill) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    navigate('/messages')
  }

  const features = [
    {
      icon: Users,
      title: 'Connect with Experts',
      description: 'Find skilled individuals in your area ready to share their knowledge and learn new skills.'
    },
    {
      icon: Zap,
      title: 'Instant Skill Exchange',
      description: 'Quick and easy skill swapping with our intuitive matching system and real-time messaging.'
    },
    {
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'Verified profiles, ratings, and reviews ensure safe and reliable skill exchanges.'
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Connect with learners and teachers worldwide, expanding your network and opportunities.'
    }
  ]

  const stats = [
    { label: 'Active Users', value: '10,000+' },
    { label: 'Skills Exchanged', value: '25,000+' },
    { label: 'Success Rate', value: '95%' },
    { label: 'Countries', value: '50+' }
  ]

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 md:pb-32">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-secondary-500/5 to-accent-500/10" />
        <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 md:w-48 md:h-48 bg-gradient-to-r from-accent-400 to-primary-400 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6"
            >
              Exchange Skills,
              <span className="block text-gradient">Build Community</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto px-4"
            >
              Connect with like-minded individuals, share your expertise, and learn new skills 
              through our innovative peer-to-peer learning platform.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-2xl mx-auto mb-8 md:mb-12 px-4"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="What skill do you want to learn today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full px-4 md:px-6 py-3 md:py-4 pr-12 md:pr-16 text-base md:text-lg border border-gray-300 dark:border-gray-600 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all duration-200"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 md:p-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Search className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6 px-4"
            >
              <Link
                to={isAuthenticated ? "/browse" : "/signup"}
                className="btn-primary text-base md:text-lg px-6 md:px-8 py-3 md:py-4 flex items-center space-x-2 group w-full sm:w-auto justify-center"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 group w-full sm:w-auto justify-center">
                <PlayCircle className="h-5 w-5 md:h-6 md:w-6" />
                <span className="text-base md:text-lg font-medium">Watch Demo</span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-4"
            >
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gradient mb-1 md:mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4"
          >
            Why Choose SkillSwap?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4"
          >
            Experience the future of peer-to-peer learning with our innovative platform
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card p-4 md:p-6 text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-shadow duration-300">
                <feature.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Skills Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4"
            >
              Featured Skills
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-4 md:mb-0"
            >
              Discover amazing skills shared by our community
            </motion.p>
          </div>
          <Link
            to="/browse"
            className="flex md:hidden lg:flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 group self-start md:self-auto"
          >
            <span className="font-medium">View All</span>
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {featuredSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <SkillCard
                skill={skill}
                onRequestSwap={handleRequestSwap}
                onMessage={handleMessage}
              />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <Link to="/browse" className="btn-secondary inline-flex items-center space-x-2">
            <span>Explore More Skills</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
              What Our Community Says
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300">
              Real stories from real people who've transformed their skills
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'UX Designer',
                avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
                quote: 'SkillSwap helped me learn React development in exchange for my design skills. The community is amazing!',
                rating: 5
              },
              {
                name: 'Mike Chen',
                role: 'Musician',
                avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
                quote: 'I taught guitar and learned photography. The skill exchange opened up new creative possibilities for me.',
                rating: 5
              },
              {
                name: 'Emma Rodriguez',
                role: 'Marketing Specialist',
                avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
                quote: 'The platform is intuitive and the matching system is incredible. Found the perfect language exchange partner!',
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-4 md:p-6"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4 md:mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="card p-6 md:p-8 lg:p-12 text-center bg-gradient-to-r from-primary-600 to-secondary-600 text-white"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-base md:text-lg lg:text-xl opacity-90 mb-6 md:mb-8 max-w-2xl mx-auto">
            Join thousands of learners and teachers who are transforming their skills 
            through meaningful exchanges
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
            <Link
              to="/signup"
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-2 md:py-3 px-6 md:px-8 rounded-xl transition-all duration-200 transform hover:scale-105 w-full sm:w-auto text-center"
            >
              Join SkillSwap Today
            </Link>
            <Link
              to="/browse"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-2 md:py-3 px-6 md:px-8 rounded-xl transition-all duration-200 w-full sm:w-auto text-center"
            >
              Explore Skills
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default Home