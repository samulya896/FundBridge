import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { StartupSubmissionForm, Industry } from '../../types';

const INDUSTRIES: Industry[] = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Energy",
  "Real Estate",
  "Consumer Goods",
  "Other"
];

const StartupSubmission = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<StartupSubmissionForm>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onDrop = (acceptedFiles: File[]) => {
    console.log(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 2
  });

  const onSubmit = async (data: StartupSubmissionForm) => {
    setLoading(true);
    setError('');

    try {
      // Insert startup profile
      const { data: profile, error: profileError } = await supabase
        .from('startup_profiles')
        .insert([{
          ...data,
          funding_needed: parseFloat(data.funding_needed.toString()),
          equity_offered: parseFloat(data.equity_offered.toString()),
          current_revenue: parseFloat(data.current_revenue.toString()),
          market_size: parseFloat(data.market_size.toString()),
        }])
        .select()
        .single();

      if (profileError) throw profileError;

      // Trigger AI evaluation
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/evaluate-startup`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ startup_id: profile.id }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to evaluate startup');
      }

      navigate(`/evaluation/${profile.id}`);
    } catch (err) {
      setError('Failed to submit startup profile. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Submit Your Startup</h2>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company_name"
                  {...register('company_name', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.company_name && (
                  <p className="mt-1 text-sm text-red-600">Company name is required</p>
                )}
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                  Industry
                </label>
                <select
                  id="industry"
                  {...register('industry', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select an industry</option>
                  {INDUSTRIES.map((industry) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-600">Industry is required</p>
                )}
              </div>

              <div>
                <label htmlFor="founding_date" className="block text-sm font-medium text-gray-700">
                  Founding Date
                </label>
                <input
                  type="date"
                  id="founding_date"
                  {...register('founding_date', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.founding_date && (
                  <p className="mt-1 text-sm text-red-600">Founding date is required</p>
                )}
              </div>

              <div>
                <label htmlFor="team_size" className="block text-sm font-medium text-gray-700">
                  Team Size
                </label>
                <input
                  type="number"
                  id="team_size"
                  min="1"
                  {...register('team_size', { required: true, min: 1 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.team_size && (
                  <p className="mt-1 text-sm text-red-600">Valid team size is required</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="business_model" className="block text-sm font-medium text-gray-700">
                Business Model
              </label>
              <textarea
                id="business_model"
                rows={4}
                {...register('business_model', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Describe your business model..."
              />
              {errors.business_model && (
                <p className="mt-1 text-sm text-red-600">Business model description is required</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="funding_needed" className="block text-sm font-medium text-gray-700">
                  Funding Needed ($)
                </label>
                <input
                  type="number"
                  id="funding_needed"
                  min="0"
                  step="1000"
                  {...register('funding_needed', { required: true, min: 0 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.funding_needed && (
                  <p className="mt-1 text-sm text-red-600">Valid funding amount is required</p>
                )}
              </div>

              <div>
                <label htmlFor="equity_offered" className="block text-sm font-medium text-gray-700">
                  Equity Offered (%)
                </label>
                <input
                  type="number"
                  id="equity_offered"
                  min="0"
                  max="100"
                  step="0.1"
                  {...register('equity_offered', { required: true, min: 0, max: 100 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.equity_offered && (
                  <p className="mt-1 text-sm text-red-600">Valid equity percentage is required</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="team_experience" className="block text-sm font-medium text-gray-700">
                Team Experience
              </label>
              <textarea
                id="team_experience"
                rows={3}
                {...register('team_experience', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Describe your team's relevant experience..."
              />
              {errors.team_experience && (
                <p className="mt-1 text-sm text-red-600">Team experience description is required</p>
              )}
            </div>

            <div>
              <label htmlFor="traction_metrics" className="block text-sm font-medium text-gray-700">
                Traction Metrics
              </label>
              <textarea
                id="traction_metrics"
                rows={3}
                {...register('traction_metrics', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Describe your current traction (users, revenue, growth)..."
              />
              {errors.traction_metrics && (
                <p className="mt-1 text-sm text-red-600">Traction metrics are required</p>
              )}
            </div>

            <div>
              <label htmlFor="competition_analysis" className="block text-sm font-medium text-gray-700">
                Competition Analysis
              </label>
              <textarea
                id="competition_analysis"
                rows={3}
                {...register('competition_analysis', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Describe your competitors and your competitive advantage..."
              />
              {errors.competition_analysis && (
                <p className="mt-1 text-sm text-red-600">Competition analysis is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Documents
              </label>
              <div
                {...getRootProps()}
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${
                  isDragActive ? 'border-blue-500 bg-blue-50' : ''
                }`}
              >
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <input {...getInputProps()} />
                    <p className="pl-1">
                      Drag 'n' drop pitch deck and financial projections here, or click to select files
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC up to 10MB</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Startup'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StartupSubmission;