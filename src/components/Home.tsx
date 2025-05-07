import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartupSubmit = () => {
    if (user) {
      navigate('/submit');
    } else {
      navigate('/register');
    }
  };

  const handleExplore = () => {
    if (user?.role === 'investor') {
      navigate('/investor/dashboard');
    } else {
      navigate('/register');
    }
  };

  const successStories = [
    {
      id: 1,
      title: "TechVision AI",
      description: "Raised $2M seed round through FundBridge connections",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "GreenEnergy Solutions",
      description: "Connected with 5 strategic investors in renewable energy",
      image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "HealthTech Innovations",
      description: "Successfully closed $5M Series A after platform match",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <main className="flex-grow">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Where Innovation Meets Investment
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Connect with investors who believe in your vision and help bring your startup to life.
            </p>
            <div className="space-x-4">
              <button
                onClick={handleStartupSubmit}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
              >
                Submit Your Startup
              </button>
              <button
                onClick={handleExplore}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Explore Startups
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose FundBridge?</h2>
            <p className="text-xl text-gray-600">We make the connection between startups and investors seamless.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Transparent Process</h3>
              <p className="text-gray-600">Our unique transparency scoring system helps investors make informed decisions.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Smart Matching</h3>
              <p className="text-gray-600">Advanced algorithms connect startups with the most suitable investors.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Secure Platform</h3>
              <p className="text-gray-600">Enterprise-grade security protecting your sensitive business information.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Join hundreds of successful startups who found their perfect investors.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <div key={story.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover rounded-lg transform hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{story.title}</h3>
                <p className="text-gray-600">
                  {story.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join our platform today and connect with the right partners for your startup journey.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
          >
            Create Your Account
          </button>
        </div>
      </section>
    </main>
  );
}

export default Home;