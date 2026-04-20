import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from '../components/JobForm';
import api from '../services/api';

const CreateJob = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    await api.post('/jobs', formData);
    alert('Job created successfully!');
    navigate('/jobs');
  };

  return (
    <div className="page">
      <JobForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateJob;