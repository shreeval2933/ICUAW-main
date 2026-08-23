import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Activity, 
  Calendar,
  Bed,
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
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
  apacheIIScore: number;
  status: string;
  admissionDate: string;
  diagnosis: string[];
  comorbidities: string[];
}

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPatients() {
      try {
        const res = await axios.get('/api/patients');
        setPatients(res.data);
      } catch (err) {
        console.error('Error fetching patients:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, []);

  const activePatients = patients.filter(p => p.status === 'active');
  const completedCount = patients.filter(p => p.status === 'discharged').length;

  return (
    <div className="space-y-8 animate-slide-up select-none">
      {/* Title block */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-white tracking-wide">Dashboard</h1>
        <p className="text-[#64748b] text-sm font-medium mt-1">ICU Patient Overview</p>
      </div>

      {/* Stats Card Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0f1b26] p-6 rounded-2xl border border-[#1e2e3d]/60 shadow-lg flex justify-between items-center">
          <div>
            <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Total Patients</span>
            <h2 className="text-3xl font-extrabold text-[#0ba5e9] mt-2">{activePatients.length}</h2>
            <p className="text-xs font-semibold text-[#64748b] mt-1">
              {activePatients.length} Active, {completedCount} Completed
            </p>
          </div>
          <div className="p-3.5 bg-[#132839] text-[#0ba5e9] rounded-xl">
            <Users className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Active Patients Grid Title */}
      <div className="space-y-5">
        <h2 className="text-lg font-bold font-heading text-white tracking-wide border-b border-[#1e2e3d]/60 pb-3">
          Active Patients
        </h2>

        {loading ? (
          <div className="text-center py-12 text-[#64748b] text-sm font-semibold">Loading patients list...</div>
        ) : activePatients.length === 0 ? (
          <div className="text-center py-20 bg-[#0f1b26] rounded-2xl border border-dashed border-[#1e2e3d]/60 text-[#64748b] text-sm">
            No active patients in ICU.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePatients.map((patient) => (
              <div 
                key={patient.id}
                className="bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-[#0ba5e9]/40 transition duration-150"
              >
                {/* Header: User Icon and Name / Bed information */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#132839] text-[#0ba5e9] flex items-center justify-center shrink-0">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base leading-snug truncate max-w-[180px] sm:max-w-none">{patient.name}</h3>
                      <p className="text-[11px] font-semibold text-[#64748b] mt-0.5 break-all">{patient.uhid}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right text-[#94a3b8] flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto border-t border-[#1e2e3d]/30 sm:border-0 pt-2 sm:pt-0 mt-1 sm:mt-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#94a3b8]">
                      <Bed className="h-3.5 w-3.5" />
                      <span>{patient.bedNumber || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#64748b] mt-0.5 sm:mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(patient.admissionDate).toLocaleDateString('en-GB')}</span>
                    </div>
                  </div>
                </div>

                {/* Demographics and SOFA badges */}
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-[#132839] text-[#0ba5e9] rounded-lg text-xs font-bold uppercase">
                    {patient.age}Y / {patient.sex === 'male' ? 'M' : patient.sex === 'female' ? 'F' : 'O'}
                  </span>
                  <span className="px-2.5 py-1 bg-[#221c17] text-[#ea580c] rounded-lg text-xs font-bold">
                    SOFA: {patient.sofaScore || 0}
                  </span>
                </div>

                {/* Tag Diagnoses list */}
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(patient.diagnosis) && patient.diagnosis.length > 0 ? (
                    patient.diagnosis.map((tag) => (
                      <span 
                        key={tag} 
                        className="text-[11px] font-bold px-2 py-0.5 bg-[#142332] text-[#94a3b8] rounded-md"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-[#64748b] font-medium italic">No diagnoses listed</span>
                  )}
                </div>

                {/* Actions row */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#1e2e3d]/40">
                  <button 
                    onClick={() => navigate(`/patient/${patient.id}`)}
                    className="w-full py-2.5 px-3 border border-[#1e2e3d] rounded-xl text-xs font-bold text-white hover:bg-[#132230] transition text-center"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => navigate('/daily-entry', { state: { patientId: patient.id } })}
                    className="w-full py-2.5 px-3 bg-[#0ba5e9] hover:bg-[#38bdf8] text-black rounded-xl text-xs font-black transition flex items-center justify-center gap-1"
                  >
                    Add Entry <ChevronRight className="h-3.5 w-3.5 stroke-[3]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
