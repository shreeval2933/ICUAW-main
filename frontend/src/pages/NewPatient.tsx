import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft, Heart, Sparkles, ClipboardList } from 'lucide-react';
import axios from 'axios';

export default function NewPatient() {
  const [formData, setFormData] = useState({
    uhid: '',
    name: '',
    bedNumber: '',
    age: '',
    sex: '',
    bmi: '',
    apacheIIScore: '',
    sofaScore: '',
    diagnosisInput: '',
    comorbiditiesInput: '',
    addictionInput: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const diagnosis = formData.diagnosisInput
        ? formData.diagnosisInput.split(',').map((x) => x.trim()).filter(Boolean)
        : [];
      const comorbidities = formData.comorbiditiesInput
        ? formData.comorbiditiesInput.split(',').map((x) => x.trim()).filter(Boolean)
        : [];
      const addiction = formData.addictionInput
        ? formData.addictionInput.split(',').map((x) => x.trim()).filter(Boolean)
        : [];

      const submissionData = {
        uhid: formData.uhid,
        name: formData.name,
        age: parseInt(formData.age, 10),
        sex: formData.sex || 'male',
        bmi: parseFloat(formData.bmi) || 22.0,
        bedNumber: formData.bedNumber,
        apacheIIScore: formData.apacheIIScore ? parseInt(formData.apacheIIScore, 10) : 0,
        sofaScore: formData.sofaScore ? parseInt(formData.sofaScore, 10) : 0,
        diagnosis,
        comorbidities,
        addiction,
        status: 'active',
      };

      await axios.post('/api/patients', submissionData);
      navigate('/patients');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to register patient. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up select-none font-body">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Register New Patient</h1>
        <p className="text-[#64748b] text-sm font-medium mt-1">Enter patient demographics and admission details</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-xs font-bold text-red-400">
          {error}
        </div>
      )}

      {/* Main Register Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Basic Information */}
        <div className="bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1e2e3d]/40 pb-2">
            <ClipboardList className="h-4.5 w-4.5 text-[#0ba5e9]" /> Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#94a3b8]">UHID *</label>
              <input
                type="text"
                name="uhid"
                required
                value={formData.uhid}
                onChange={handleInputChange}
                placeholder="AIIMS-JDH-2024-XXX"
                className="w-full px-3.5 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569] focus:ring-1 focus:ring-[#0ba5e9]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#94a3b8]">Patient Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full name"
                className="w-full px-3.5 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#94a3b8]">Bed Number</label>
              <input
                type="text"
                name="bedNumber"
                value={formData.bedNumber}
                onChange={handleInputChange}
                placeholder="ICU-01"
                className="w-full px-3.5 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#94a3b8]">Age (years) *</label>
              <input
                type="number"
                name="age"
                required
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Age"
                className="w-full px-3.5 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#94a3b8]">Sex *</label>
              <select
                name="sex"
                required
                value={formData.sex}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 pr-10 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs focus:ring-1 focus:ring-[#0ba5e9] focus:outline-none appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%230ba5e9%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-[position:right_12px_center] bg-no-repeat"
              >
                <option value="">Select sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#94a3b8]">BMI (kg/m²)</label>
              <input
                type="text"
                name="bmi"
                value={formData.bmi}
                onChange={handleInputChange}
                placeholder="BMI"
                className="w-full px-3.5 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Admission Details */}
        <div className="bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1e2e3d]/40 pb-2">
            <Heart className="h-4.5 w-4.5 text-[#0ba5e9]" /> Admission Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#94a3b8]">APACHE II Score</label>
              <input
                type="number"
                name="apacheIIScore"
                value={formData.apacheIIScore}
                onChange={handleInputChange}
                placeholder="Score"
                className="w-full px-3.5 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#94a3b8]">SOFA Score</label>
              <input
                type="number"
                name="sofaScore"
                value={formData.sofaScore}
                onChange={handleInputChange}
                placeholder="Score"
                className="w-full px-3.5 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Diagnoses / Medical Background */}
        <div className="bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1e2e3d]/40 pb-2">
            <Sparkles className="h-4.5 w-4.5 text-[#0ba5e9]" /> Diagnosis & Comorbidity
          </h2>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#94a3b8]">Diagnosis (Comma Separated)</label>
              <input
                type="text"
                name="diagnosisInput"
                value={formData.diagnosisInput}
                onChange={handleInputChange}
                placeholder="sepsis, renal failure, respiratory failure"
                className="w-full px-3.5 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#94a3b8]">Comorbidities (Comma Separated)</label>
              <input
                type="text"
                name="comorbiditiesInput"
                value={formData.comorbiditiesInput}
                onChange={handleInputChange}
                placeholder="hypertension, diabetes, CAD, COPD"
                className="w-full px-3.5 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#94a3b8]">Addiction History (Comma Separated)</label>
              <input
                type="text"
                name="addictionInput"
                value={formData.addictionInput}
                onChange={handleInputChange}
                placeholder="alcohol, smoking, others"
                className="w-full px-3.5 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-xs placeholder-[#475569]"
              />
            </div>
          </div>
        </div>

        {/* Submit Blocks */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/patients')}
            className="px-5 py-2.5 border border-[#1e2e3d] rounded-xl text-xs font-bold text-white hover:bg-[#132230] transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#0ba5e9] hover:bg-[#38bdf8] text-black text-xs font-black rounded-xl shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register Patient'}
          </button>
        </div>
      </form>
    </div>
  );
}
