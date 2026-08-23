import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Trash2, MoreHorizontal } from 'lucide-react';
import axios from 'axios';

interface Patient {
  id: string;
  uhid: string;
  name: string;
  age: number;
  sex: string;
  bedNumber: string;
  admissionType: string;
  sofaScore: number;
  status: string;
  icuaw?: string;
  diagnosis: string[];
  DailyRecords?: any[];
}

export default function PatientsList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showConfirmId, setShowConfirmId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      const res = await axios.get('/api/patients');
      setPatients(res.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const nameVal = patient.name || '';
    const uhidVal = patient.uhid || '';
    const bedVal = patient.bedNumber || '';
    const matchesSearch = 
      nameVal.toLowerCase().includes(search.toLowerCase()) ||
      uhidVal.toLowerCase().includes(search.toLowerCase()) ||
      bedVal.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-slide-up select-none font-body">
      {/* Title Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Patients</h1>
          <p className="text-[#64748b] text-sm font-medium mt-1">Manage ICU patients</p>
        </div>
        <button 
          onClick={() => navigate('/new-patient')}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0ba5e9] hover:bg-[#38bdf8] text-black rounded-xl text-xs font-black shadow-md transition"
        >
          <Plus className="h-4.5 w-4.5 stroke-[3]" /> New Patient
        </button>
      </div>

      {/* Search Input */}
      <div className="relative rounded-xl max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-[#475569]" />
        </div>
        <input
          type="text"
          placeholder="Search by name, UHID, or bed number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full pl-10 pr-4 py-2.5 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white placeholder-[#475569] text-xs focus:outline-none focus:ring-2 focus:ring-[#0ba5e9]"
        />
      </div>

      {/* Desktop Patients Table */}
      {loading ? (
        <div className="text-center py-12 text-[#64748b] text-sm font-semibold">Loading patients list...</div>
      ) : filteredPatients.length === 0 ? (
        <div className="py-24 text-center bg-[#0f1b26] rounded-2xl border border-[#1e2e3d]/60 text-[#64748b] text-sm">
          No patients matching criteria.
        </div>
      ) : (
        <div className="overflow-x-auto bg-[#0f1b26] rounded-2xl border border-[#1e2e3d]/60 shadow-xl">
          <table className="min-w-full text-left text-xs text-[#e2e8f0]">
            <thead className="bg-[#0b131a] font-heading text-[11px] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#1e2e3d]/60">
              <tr>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">UHID</th>
                <th className="px-6 py-4">Bed</th>
                <th className="px-6 py-4">Age/Sex</th>
                <th className="px-6 py-4">Diagnosis</th>
                <th className="px-6 py-4">ICUAW</th>
                <th className="px-6 py-4">Data Collection</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2e3d]/40">
              {filteredPatients.map((patient) => {
                return (
                  <tr key={patient.id} className="hover:bg-[#132230]/35 transition">
                    <td className="px-6 py-4 font-bold text-white leading-normal">{patient.name}</td>
                    <td className="px-6 py-4 font-semibold text-[#94a3b8]">{patient.uhid}</td>
                    <td className="px-6 py-4 font-semibold text-[#94a3b8]">{patient.bedNumber || 'N/A'}</td>
                    <td className="px-6 py-4 font-semibold uppercase">{patient.age}Y / {patient.sex === 'male' ? 'M' : patient.sex === 'female' ? 'F' : 'O'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {Array.isArray(patient.diagnosis) && patient.diagnosis.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2.5 py-0.5 bg-[#142332] text-[#64748b] rounded-md font-bold text-[10px]">
                            {tag}
                          </span>
                        ))}
                        {Array.isArray(patient.diagnosis) && patient.diagnosis.length > 2 && (
                          <span className="px-2 py-0.5 bg-[#142332] text-[#0ba5e9] rounded-md font-bold text-[10px]">
                            +{patient.diagnosis.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                         patient.icuaw === 'positive'
                           ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                           : patient.icuaw === 'negative'
                           ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                           : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                       }`}>
                         {patient.icuaw || 'Pending'}
                       </span>
                     </td>
                     <td className="px-6 py-4">
                       <span className={`inline-flex px-3 py-1 rounded-full font-bold text-[10px] ${
                         patient.status === 'active'
                           ? 'bg-[#142332] text-[#94a3b8] border border-[#1e2e3d]/40'
                           : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                       }`}>
                         {patient.status === 'active' ? 'Ongoing' : 'Complete'}
                       </span>
                     </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-[#94a3b8]">
                        <button 
                          onClick={() => navigate(`/patient/${patient.id}`)}
                          className="p-1.5 hover:bg-[#132230] rounded-lg transition hover:text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setShowConfirmId(patient.id)}
                          className="p-1.5 hover:bg-[#132230] rounded-lg transition hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in select-none">
          <div className="bg-[#0f1b26] border border-[#1e2e3d] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Discharge/Remove Patient</h3>
            </div>
            
            <p className="text-xs text-[#94a3b8] font-medium leading-relaxed">
              Are you sure you want to discharge or remove this patient? This action will permanently delete all daily logs and laboratory entries associated with them.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmId(null)}
                className="px-4 py-2 border border-[#1e2e3d] text-[#e2e8f0] text-xs font-bold rounded-xl hover:bg-[#132230] transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const id = showConfirmId;
                  setShowConfirmId(null);
                  try {
                    await axios.delete(`/api/patients/${id}`);
                    setPatients(patients.filter(p => p.id !== id));
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
