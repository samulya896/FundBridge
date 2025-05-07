import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StartupEvaluation = () => {
  const overallScore = 68;
  
  // Circular progress data
  const progressData = {
    datasets: [{
      data: [overallScore, 100 - overallScore],
      backgroundColor: ['#3B82F6', '#E5E7EB'],
      borderWidth: 0,
      cutout: '80%'
    }]
  };

  // Bar chart data
  const barData = {
    labels: ['Uniqueness', 'Market Demand', 'Scalability', 'Team Experience', 'Financial Model'],
    datasets: [{
      label: 'Score',
      data: [75, 82, 65, 90, 60],
      backgroundColor: '#3B82F6',
      borderRadius: 6,
    }]
  };

  const barOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const keyMetrics = [
    { name: 'Funding Team & Experience', score: 80 },
    { name: 'Market Research & Analysis', score: 75 },
    { name: 'Product Development Stage', score: 65 },
    { name: 'Financial Planning', score: 70 },
    { name: 'Competition Analysis', score: 85 }
  ];

  const insights = {
    strengths: [
      'Strong founding team with relevant industry experience',
      'Clear market opportunity with significant growth potential',
      'Well-developed MVP with positive user feedback'
    ],
    weaknesses: [
      'Limited financial runway without additional funding',
      'High customer acquisition costs',
      'Complex regulatory environment'
    ],
    recommendations: [
      'Focus on reducing CAC through optimization of marketing channels',
      'Strengthen partnerships with key industry players',
      'Develop a clear regulatory compliance roadmap'
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Startup Evaluation Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Overall Score */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Overall Score</h2>
          <div className="relative w-48 h-48 mx-auto">
            <Doughnut data={progressData} options={{ plugins: { legend: { display: false } } }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl font-bold text-blue-600">{overallScore}%</span>
                <p className="text-sm text-gray-500">Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
          <div className="space-y-4">
            {keyMetrics.map((metric) => (
              <div key={metric.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{metric.name}</span>
                  <span className="font-semibold">{metric.score}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-blue-600 rounded-full"
                    style={{ width: `${metric.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <div>
                <p className="font-medium text-green-700">Strong Team Fit</p>
                <p className="text-sm text-green-600">90% alignment with industry</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-500 mr-3" />
              <div>
                <p className="font-medium text-blue-700">Growth Potential</p>
                <p className="text-sm text-blue-600">82% market opportunity</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-3" />
              <div>
                <p className="font-medium text-yellow-700">Risk Assessment</p>
                <p className="text-sm text-yellow-600">Medium risk profile</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-6">Detailed Metrics</h2>
        <div className="h-80">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-green-600">Strengths</h2>
          <ul className="space-y-2">
            {insights.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Weaknesses</h2>
          <ul className="space-y-2">
            {insights.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Recommendations</h2>
          <ul className="space-y-2">
            {insights.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <TrendingUp className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StartupEvaluation;