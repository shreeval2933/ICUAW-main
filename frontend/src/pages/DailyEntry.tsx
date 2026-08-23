import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ClipboardList, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface Patient {
  id: string;
  uhid: string;
  name: string;
  bedNumber: string;
}

export default function DailyEntry() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState<'vitals' | 'treatment' | 'practices' | 'nutrition'>('vitals');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Tab State Values
  const [vitals, setVitals] = useState({
    sofaScore: '',
    hrMin: '', hrMax: '',
    sbpMin: '', sbpMax: '',
    dbpMin: '', dbpMax: '',
    rrMin: '', rrMax: '',
    spo2Min: '', spo2Max: '',
    tempMin: '', tempMax: '',
    rassMin: '', rassMax: '',
    urineMin: '', urineMax: '',
    gcs: '',
  });

  const [treatment, setTreatment] = useState({
    mechVentDuration: '',
    sedationDuration: '',
    neuromuscularDuration: '',
    corticosteroidDuration: '',
    vasopressorDuration: '',
  });

  const [practices, setPractices] = useState({
    mobilizationTime: '',
    immobilizationDuration: '',
  });

  const [nutrition, setNutrition] = useState({
    nutritionRoute: 'oral',
    proteinIntake: '',
  });

  useEffect(() => {
    async function loadPatients() {
      try {
        const res = await axios.get('/api/patients');
        const activeList = res.data.filter((p: any) => p.status === 'active');
        setPatients(activeList);
        
        if (location.state?.patientId) {
          setSelectedPatientId(location.state.patientId);
        } else if (activeList.length > 0) {
          setSelectedPatientId(activeList[0].id);
        }
      } catch (err) {
        console.error('Error load patients list:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      setErrorMsg('Please select a patient first.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const data = {
        date: entryDate,
        // Tab 1: Vitals
        sofaScore: vitals.sofaScore ? parseInt(vitals.sofaScore) : undefined,
        hrMin: vitals.hrMin ? parseInt(vitals.hrMin) : undefined,
        hrMax: vitals.hrMax ? parseInt(vitals.hrMax) : undefined,
        sbpMin: vitals.sbpMin ? parseInt(vitals.sbpMin) : undefined,
        sbpMax: vitals.sbpMax ? parseInt(vitals.sbpMax) : undefined,
        dbpMin: vitals.dbpMin ? parseInt(vitals.dbpMin) : undefined,
        dbpMax: vitals.dbpMax ? parseInt(vitals.dbpMax) : undefined,
        rrMin: vitals.rrMin ? parseInt(vitals.rrMin) : undefined,
        rrMax: vitals.rrMax ? parseInt(vitals.rrMax) : undefined,
        spo2Min: vitals.spo2Min ? parseInt(vitals.spo2Min) : undefined,
        spo2Max: vitals.spo2Max ? parseInt(vitals.spo2Max) : undefined,
        tempMin: vitals.tempMin ? parseFloat(vitals.tempMin) : undefined,
        tempMax: vitals.tempMax ? parseFloat(vitals.tempMax) : undefined,
        rassMin: vitals.rassMin ? parseInt(vitals.rassMin) : undefined,
        rassMax: vitals.rassMax ? parseInt(vitals.rassMax) : undefined,
        urineMin: vitals.urineMin ? parseFloat(vitals.urineMin) : undefined,
        urineMax: vitals.urineMax ? parseFloat(vitals.urineMax) : undefined,
        gcs: vitals.gcs ? parseInt(vitals.gcs) : undefined,

        // Tab 2: Treatment
        mechVentDuration: treatment.mechVentDuration ? parseFloat(treatment.mechVentDuration) : undefined,
        sedationDuration: treatment.sedationDuration ? parseFloat(treatment.sedationDuration) : undefined,
        neuromuscularDuration: treatment.neuromuscularDuration ? parseFloat(treatment.neuromuscularDuration) : undefined,
        corticosteroidDuration: treatment.corticosteroidDuration ? parseFloat(treatment.corticosteroidDuration) : undefined,
        vasopressorDuration: treatment.vasopressorDuration ? parseFloat(treatment.vasopressorDuration) : undefined,

        // Tab 3: Practices
        mobilizationTime: practices.mobilizationTime ? parseFloat(practices.mobilizationTime) : undefined,
        immobilizationDuration: practices.immobilizationDuration ? parseFloat(practices.immobilizationDuration) : undefined,

        // Tab 4: Nutrition
        nutritionRoute: nutrition.nutritionRoute,
        proteinIntake: nutrition.proteinIntake ? parseFloat(nutrition.proteinIntake) : undefined,
      };

      await axios.post(`/api/patients/${selectedPatientId}/daily-record`, data);
      navigate(`/patient/${selectedPatientId}`);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Error saving clinical record.');
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: 'vitals', label: 'VITAL SIGNS' },
    { id: 'treatment', label: 'TREATMENT VARIABLES' },
    { id: 'practices', label: 'ICU PRACTICES' },
    { id: 'nutrition', label: 'NUTRITION' },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-slide-up select-none font-body text-[#e2e8f0]">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Daily Data Entry</h1>
        <p className="text-[#64748b] text-sm font-medium mt-1">Record daily patient parameters</p>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          <p className="text-xs text-emerald-400 font-bold">{successMsg}</p>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-xs text-red-400 font-bold">{errorMsg}</p>
        </div>
      )}

      {/* Selectors */}
      <div className="bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#94a3b8] uppercase tracking-wider">Select Patient</label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="w-full px-4 py-3 pr-10 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0ba5e9] appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%230ba5e9%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-[position:right_16px_center] bg-no-repeat"
          >
            {loading ? (
              <option>Loading patients...</option>
            ) : patients.length === 0 ? (
              <option>No active patients found</option>
            ) : (
              patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.uhid}) {p.bedNumber ? ` - ${p.bedNumber}` : ''}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#94a3b8] uppercase tracking-wider">Date</label>
          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            className="w-full px-4 py-3 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0ba5e9]"
          />
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex flex-row overflow-x-auto whitespace-nowrap bg-[#0b131a] rounded-xl border border-[#1e2e3d]/60 p-1.5 gap-1.5 text-center scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 shrink-0 min-w-[140px] sm:min-w-0 py-2.5 px-4 rounded-lg text-xs font-black transition text-center ${
              activeTab === tab.id 
                ? 'bg-[#132230] text-[#0ba5e9] border border-[#1e2e3d]/80' 
                : 'text-[#64748b] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form content */}
      <form onSubmit={handleSubmit} className="bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl p-6 space-y-6">
        
        {/* Tab 1: Vitals */}
        {activeTab === 'vitals' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-base font-bold text-white border-b border-[#1e2e3d]/40 pb-2">VITAL SIGNS</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* SOFA */}
              <div className="bg-[#0a131a] p-4 rounded-xl border border-[#1e2e3d]/60 space-y-2">
                <label className="block text-xs font-bold text-white">SOFA Score</label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={vitals.sofaScore}
                  onChange={(e) => setVitals({ ...vitals, sofaScore: e.target.value })}
                  placeholder="0 - 24"
                  className="w-full px-3.5 py-2.5 bg-[#070f15] border border-[#1e2e3d] rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
                />
              </div>

              {/* GCS */}
              <div className="bg-[#0a131a] p-4 rounded-xl border border-[#1e2e3d]/60 space-y-2">
                <label className="block text-xs font-bold text-white">GCS (3 - 15)</label>
                <input
                  type="number"
                  min="3"
                  max="15"
                  value={vitals.gcs}
                  onChange={(e) => setVitals({ ...vitals, gcs: e.target.value })}
                  placeholder="3 - 15"
                  className="w-full px-3.5 py-2.5 bg-[#070f15] border border-[#1e2e3d] rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
                />
              </div>

              {/* Heart rate */}
              <div className="bg-[#0a131a] p-4 rounded-xl border border-[#1e2e3d]/60 space-y-2">
                <label className="block text-xs font-bold text-white">Heart Rate (beats/min) min-max</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Min" value={vitals.hrMin} onChange={(e)=>setVitals({...vitals, hrMin: e.target.value})} className="bg-[#070f15] border border-[#1e2e3d] rounded p-2 text-xs text-white" />
                  <input type="number" placeholder="Max" value={vitals.hrMax} onChange={(e)=>setVitals({...vitals, hrMax: e.target.value})} className="bg-[#070f15] border border-[#1e2e3d] rounded p-2 text-xs text-white" />
                </div>
              </div>

              {/* Blood Pressure */}
              <div className="bg-[#0a131a] p-4 rounded-xl border border-[#1e2e3d]/60 space-y-2">
                <label className="block text-xs font-bold text-white">Blood Pressure (mmHg) Systolic min-max</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Min" value={vitals.sbpMin} onChange={(e)=>setVitals({...vitals, sbpMin: e.target.value})} className="bg-[#070f15] border border-[#1e2e3d] rounded p-2 text-xs text-white" />
                  <input type="number" placeholder="Max" value={vitals.sbpMax} onChange={(e)=>setVitals({...vitals, sbpMax: e.target.value})} className="bg-[#070f15] border border-[#1e2e3d] rounded p-2 text-xs text-white" />
                </div>
              </div>

              <div className="bg-[#0a131a] p-4 rounded-xl border border-[#1e2e3d]/60 space-y-2">
                <label className="block text-xs font-bold text-white">Blood Pressure (mmHg) Diastolic min-max</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Min" value={vitals.dbpMin} onChange={(e)=>setVitals({...vitals, dbpMin: e.target.value})} className="bg-[#070f15] border border-[#1e2e3d] rounded p-2 text-xs text-white" />
                  <input type="number" placeholder="Max" value={vitals.dbpMax} onChange={(e)=>setVitals({...vitals, dbpMax: e.target.value})} className="bg-[#070f15] border border-[#1e2e3d] rounded p-2 text-xs text-white" />
                </div>
              </div>

              {/* Respiratory Rate */}
              <div className="bg-[#0a131a] p-4 rounded-xl border border-[#1e2e3d]/60 space-y-2">
                <label className="block text-xs font-bold text-white">Respiratory Rate (breaths/min) min-max</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Min" value={vitals.rrMin} onChange={(e)=>setVitals({...vitals, rrMin: e.target.value})} className="bg-[#070f15] border border-[#1e2e3d] rounded p-2 text-xs text-white" />
                  <input type="number" placeholder="Max" value={vitals.rrMax} onChange={(e)=>setVitals({...vitals, rrMax: e.target.value})} className="bg-[#070f15] border border-[#1e2e3d] rounded p-2 text-xs text-white" />
                </div>
              </div>

              {/* SpO2 */}
              <div className="bg-[#0a131a] p-4 rounded-xl border border-[#1e2e3d]/60 space-y-2">
                <label className="block text-xs font-bold text-white">SpO2 (%) min-max</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Min" value={vitals.spo2Min} onChange={(e)=>setVitals({...vitals, spo2Min: e.target.value})} className="bg-[#070f15] border border-[#1e2e3d] rounded p-2 text-xs text-white" />
                  <input type="number" placeholder="Max" value={vitals.spo2Max} onChange={(e)=>setVitals({...vitals, spo2Max: e.target.value})} className="bg-[#070f15] border border-[#1e2e3d] rounded p-2 text-xs text-white" />
                </div>
              </div>

              {/* Temperature */}
              <div className="bg-[#0a131a] p-4 rounded-xl border border-[#1e2e3d]/60 space-y-2">
                <label className="block text-xs font-bold text-white">Temperature (F) min-max</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Min" value={vitals.tempMin} onChange={(e)=>setVitals({...vitals, tempMin: e.target.value})} className="bg-[#070f15] border border-[#1e2e3d] rounded p-2 text-xs text-white" />
                  <input type="text" placeholder="Max" value={vitals.tempMax} onChange={(e)=>setVitals({...vitals, tempMax: e.target.value})} className="bg-[#070f15] border border-[#1e2e3d] rounded p-2 text-xs text-white" />
                </div>
              </div>

              {/* RASS Score */}
              <div className="bg-[#0a131a] p-4 rounded-xl border border-[#1e2e3d]/60 space-y-2">
                <label className="block text-xs font-bold text-white">RASS Score min-max</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" min="-5" max="4" placeholder="Min" value={vitals.rassMin} onChange={(e)=>setVitals({...vitals, rassMin: e.target.value})} className="bg-[#070f15] border border-[#1e2e3d] rounded p-2 text-xs text-white" />
                  <input type="number" min="-5" max="4" placeholder="Max" value={vitals.rassMax} onChange={(e)=>setVitals({...vitals, rassMax: e.target.value})} className="bg-[#070f15] border border-[#1e2e3d] rounded p-2 text-xs text-white" />
                </div>
              </div>

              {/* Urine Output */}
              <div className="bg-[#0a131a] p-4 rounded-xl border border-[#1e2e3d]/60 space-y-2">
                <label className="block text-xs font-bold text-white">Urine Output (mL/hour) min-max</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Min" value={vitals.urineMin} onChange={(e)=>setVitals({...vitals, urineMin: e.target.value})} className="bg-[#070f15] border border-[#1e2e3d] rounded p-2 text-xs text-white" />
                  <input type="text" placeholder="Max" value={vitals.urineMax} onChange={(e)=>setVitals({...vitals, urineMax: e.target.value})} className="bg-[#070f15] border border-[#1e2e3d] rounded p-2 text-xs text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Treatment Variables */}
        {activeTab === 'treatment' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-base font-bold text-white border-b border-[#1e2e3d]/40 pb-2">TREATMENT VARIABLES</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-[#0a131a] p-4 rounded-xl border border-[#1e2e3d]/60 space-y-1">
                <label className="block text-xs font-bold text-white">Duration of Mechanical Ventilation (hours)</label>
                <input
                  type="text"
                  placeholder="hours"
                  value={treatment.mechVentDuration}
                  onChange={(e) => setTreatment({ ...treatment, mechVentDuration: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#070f15] border border-[#1e2e3d] rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
                />
              </div>

              <div className="bg-[#0a131a] p-4 rounded-xl border border-[#1e2e3d]/60 space-y-1">
                <label className="block text-xs font-bold text-white">Duration of Sedation (dose/kg/day)</label>
                <input
                  type="text"
                  placeholder="dose/kg/day"
                  value={treatment.sedationDuration}
                  onChange={(e) => setTreatment({ ...treatment, sedationDuration: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#070f15] border border-[#1e2e3d] rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
                />
              </div>

              <div className="bg-[#0a131a] p-4 rounded-xl border border-[#1e2e3d]/60 space-y-1">
                <label className="block text-xs font-bold text-white">Neuromuscular Blocking Agents (dose/kg/day)</label>
                <input
                  type="text"
                  placeholder="dose/kg/day"
                  value={treatment.neuromuscularDuration}
                  onChange={(e) => setTreatment({ ...treatment, neuromuscularDuration: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#070f15] border border-[#1e2e3d] rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
                />
              </div>

              <div className="bg-[#0a131a] p-4 rounded-xl border border-[#1e2e3d]/60 space-y-1">
                <label className="block text-xs font-bold text-white">Corticosteroid Therapy (dose/kg/day)</label>
                <input
                  type="text"
                  placeholder="dose/kg/day"
                  value={treatment.corticosteroidDuration}
                  onChange={(e) => setTreatment({ ...treatment, corticosteroidDuration: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#070f15] border border-[#1e2e3d] rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
                />
              </div>

              <div className="bg-[#0a131a] p-4 rounded-xl border border-[#1e2e3d]/60 space-y-1">
                <label className="block text-xs font-bold text-white">Vasopressor Use (dose/kg/day)</label>
                <input
                  type="text"
                  placeholder="dose/kg/day"
                  value={treatment.vasopressorDuration}
                  onChange={(e) => setTreatment({ ...treatment, vasopressorDuration: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#070f15] border border-[#1e2e3d] rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: ICU Practices */}
        {activeTab === 'practices' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-base font-bold text-white border-b border-[#1e2e3d]/40 pb-2">ICU PRACTICES</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-[#0a131a] p-4 rounded-xl border border-[#1e2e3d]/60 space-y-1">
                <label className="block text-xs font-bold text-white">Time to Mobilization (hours)</label>
                <input
                  type="text"
                  placeholder="hours"
                  value={practices.mobilizationTime}
                  onChange={(e) => setPractices({ ...practices, mobilizationTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#070f15] border border-[#1e2e3d] rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
                />
              </div>

              <div className="bg-[#0a131a] p-4 rounded-xl border border-[#1e2e3d]/60 space-y-1">
                <label className="block text-xs font-bold text-white">Duration of Immobilization (hours)</label>
                <input
                  type="text"
                  placeholder="hours"
                  value={practices.immobilizationDuration}
                  onChange={(e) => setPractices({ ...practices, immobilizationDuration: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#070f15] border border-[#1e2e3d] rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Nutrition */}
        {activeTab === 'nutrition' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-base font-bold text-white border-b border-[#1e2e3d]/40 pb-2">NUTRITION</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-[#0a131a] p-4 rounded-xl border border-[#1e2e3d]/60 space-y-2">
                <label className="block text-xs font-bold text-white">Route</label>
                <select
                  value={nutrition.nutritionRoute}
                  onChange={(e) => setNutrition({ ...nutrition, nutritionRoute: e.target.value })}
                  className="w-full px-3 py-2.5 pr-10 bg-[#070f15] border border-[#1e2e3d] rounded-lg text-white text-xs focus:ring-1 focus:ring-[#0ba5e9] focus:outline-none appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%230ba5e9%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-[position:right_12px_center] bg-no-repeat"
                >
                  <option value="oral" className="bg-[#0a131a] text-white">Oral</option>
                  <option value="ryles tube" className="bg-[#0a131a] text-white">Ryles Tube</option>
                  <option value="TPN" className="bg-[#0a131a] text-white">TPN</option>
                </select>
              </div>

              <div className="bg-[#0a131a] p-4 rounded-xl border border-[#1e2e3d]/60 space-y-1">
                <label className="block text-xs font-bold text-white">Daily Protein Intake (gm/day)</label>
                <input
                  type="text"
                  placeholder="gm/day"
                  value={nutrition.proteinIntake}
                  onChange={(e) => setNutrition({ ...nutrition, proteinIntake: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#070f15] border border-[#1e2e3d] rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#0ba5e9]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#1e2e3d]/40">
          <button
            type="submit"
            disabled={submitting || !selectedPatientId}
            className="px-6 py-3 bg-[#0ba5e9] hover:bg-[#38bdf8] text-black text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Save Parameters'}
          </button>
        </div>
      </form>
    </div>
  );
}
