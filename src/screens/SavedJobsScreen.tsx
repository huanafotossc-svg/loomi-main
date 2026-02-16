import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Header, JobCard, EmptySaved } from '../components';
import { mockJobs, getHotelById } from '../data/mock';
import type { Job } from '../types';

export function SavedJobsScreen() {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState<Job[]>([mockJobs[0], mockJobs[2], mockJobs[4]]);

  const handleRemoveSave = (jobId: string) => {
    setSavedJobs(prev => prev.filter(j => j.id !== jobId));
  };

  return (
    <div className="min-h-screen bg-porcelain pb-24">
      <Header
        title="Vagas Salvas"
        subtitle={`${savedJobs.length} ${savedJobs.length === 1 ? 'vaga' : 'vagas'}`}
        showBack
      />

      <div className="px-4 pt-4">
        {savedJobs.length === 0 ? (
          <EmptySaved onAction={() => navigate('/feed')} />
        ) : (
          <div className="space-y-4">
            {savedJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <JobCard
                  job={job}
                  hotel={getHotelById(job.hotelId)}
                  onClick={() => navigate(`/job/${job.id}`)}
                  onSave={() => handleRemoveSave(job.id)}
                  isSaved={true}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
