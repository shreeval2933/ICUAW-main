import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileSpreadsheet, 
  Plus, 
  User, 
  Bed, 
  Activity, 
  Calendar,
  Clipboard,
  Beaker,
  FileText
} from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';

interface Patient {
  id: string;
  uhid: string;
  name: string;
  age: number;
  sex: string;
  bmi: number;
  bedNumber: string;
  admissionType: string;
  sofaScore: number;
  apacheIIScore: number;
  status: string;
  icuaw?: string;
  admissionDate: string;
  diagnosis: string[];
  comorbidities: string[];
  addiction: string[];
  DailyRecords?: any[];
  LaboratoryValues?: any[];
}

export default function PatientDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPatientDetails = async () => {
    try {
      const res = await axios.get(`/api/patients/${id}`);
      setPatient(res.data);
    } catch (err) {
      console.error('Error fetching patient details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientDetails();
  }, [id]);

  const exportPatientChart = () => {
    if (!patient) return;
    
    // Sheet 1: General Profile details
    const profileData = [
      ['AIIMS Jodhpur ICU Patient Profile Chart'],
      [],
      ['Name', patient.name],
      ['UHID', patient.uhid],
      ['Age/Sex', `${patient.age}Y / ${patient.sex.toUpperCase()}`],
      ['Bed Number', patient.bedNumber || 'N/A'],
      ['Initial SOFA Score', patient.sofaScore],
      ['Initial APACHE II Score', patient.apacheIIScore],
      ['BMI', `${patient.bmi} kg/m²`],
      ['ICUAW Outcome', (patient.icuaw || 'pending').toUpperCase()],
      ['Admission Date', new Date(patient.admissionDate).toLocaleDateString()],
      [],
      ['Diagnoses', (patient.diagnosis || []).join(', ')],
      ['Comorbidities', (patient.comorbidities || []).join(', ')],
      ['Addictions', (patient.addiction || []).join(', ')],
    ];

    // Sheet 2: Daily record entries for this patient
    const dailyRecordsData = (patient.DailyRecords || []).map((d) => ({
      Date: d.date,
      'SOFA Score': d.sofaScore ?? '',
      'Heart Rate Min': d.hrMin ?? '',
      'Heart Rate Max': d.hrMax ?? '',
      'SBP Min': d.sbpMin ?? '',
      'SBP Max': d.sbpMax ?? '',
      'DBP Min': d.dbpMin ?? '',
      'DBP Max': d.dbpMax ?? '',
      'Respiratory Rate Min': d.rrMin ?? '',
      'Respiratory Rate Max': d.rrMax ?? '',
      'SpO2 Min': d.spo2Min ?? '',
      'SpO2 Max': d.spo2Max ?? '',
      'Temperature Min': d.tempMin ?? '',
      'Temperature Max': d.tempMax ?? '',
      'RASS Min': d.rassMin ?? '',
      'RASS Max': d.rassMax ?? '',
      'Urine Output Min': d.urineMin ?? '',
      'Urine Output Max': d.urineMax ?? '',
      GCS: d.gcs ?? '',
      'Mechanical Vent Duration (hrs)': d.mechVentDuration ?? '',
      'Sedation Duration (hrs)': d.sedationDuration ?? '',
      'Neuromuscular Duration (hrs)': d.neuromuscularDuration ?? '',
      'Corticosteroid Duration (hrs)': d.corticosteroidDuration ?? '',
      'Vasopressor Duration (hrs)': d.vasopressorDuration ?? '',
      'Mobilization Time (hrs)': d.mobilizationTime ?? '',
      'Immobilization Duration (hrs)': d.immobilizationDuration ?? '',
      'Nutrition Route': d.nutritionRoute ?? '',
      'Protein Intake (gm/day)': d.proteinIntake ?? '',
    }));

    // Sheet 3: Lab value entries for this patient
    const labValuesData = (patient.LaboratoryValues || []).map((l) => ({
      Date: l.date,
      'Glucose Min': l.glucoseMin ?? '',
      'Glucose Max': l.glucoseMax ?? '',
      Phosphate: l.phosphate ?? '',
      Potassium: l.potassium ?? '',
      Albumin: l.albumin ?? '',
      CRP: l.crp ?? '',
      Procalcitonin: l.procalcitonin ?? '',
      Creatinine: l.creatinine ?? '',
      AST: l.ast ?? '',
      ALT: l.alt ?? '',
      Bilirubin: l.bilirubin ?? '',
      Lactate: l.lactate ?? '',
      Hb: l.hb ?? '',
      TLC: l.tlc ?? '',
      Platelets: l.plt ?? '',
      TSH: l.tsh ?? '',
      T3: l.t3 ?? '',
      T4: l.t4 ?? '',
    }));

    const workbook = XLSX.utils.book_new();

    const wsProfile = XLSX.utils.aoa_to_sheet(profileData);
    XLSX.utils.book_append_sheet(workbook, wsProfile, 'Patient Profile');

    const wsDaily = XLSX.utils.json_to_sheet(dailyRecordsData.length > 0 ? dailyRecordsData : [{ Date: 'No records available' }]);
    XLSX.utils.book_append_sheet(workbook, wsDaily, 'Daily Vitals & Treatment');

    const wsLabs = XLSX.utils.json_to_sheet(labValuesData.length > 0 ? labValuesData : [{ Date: 'No records available' }]);
    XLSX.utils.book_append_sheet(workbook, wsLabs, 'Lab Record Logs');

    XLSX.writeFile(workbook, `Patient_${patient.uhid}_Comprehensive_Chart.xlsx`);
  };

  if (loading) {
    return <div className="text-center py-12 text-[#64748b] text-sm font-semibold">Loading patient file...</div>;
  }

  if (!patient) {
    return (
      <div className="text-center py-24 bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl">
        <h2 className="text-lg font-bold text-white">Patient Record Not Found</h2>
        <button onClick={() => navigate('/patients')} className="mt-4 text-[#0ba5e9] font-bold hover:underline">
          Return to Patients Directory
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up select-none font-body text-[#e2e8f0]">
      {/* Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/patients')}
            className="p-2 bg-[#0b131a] border border-[#1e2e3d] rounded-xl hover:bg-[#132230] text-[#94a3b8] hover:text-white transition"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold font-heading text-white tracking-wide">{patient.name}</h1>
            <p className="text-[#64748b] text-xs font-semibold mt-0.5">{patient.uhid}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button 
            onClick={exportPatientChart}
            className="flex items-center gap-2 px-4 py-2 border border-[#1e2e3d] rounded-xl text-xs font-bold text-white hover:bg-[#132230] transition"
          >
            <FileSpreadsheet className="h-4 w-4" /> Download Excel
          </button>
          <button 
            onClick={() => navigate('/lab-entry')}
            className="flex items-center gap-2 px-4 py-2 border border-[#1e2e3d] rounded-xl text-xs font-bold text-white hover:bg-[#132230] transition"
          >
            <Beaker className="h-4 w-4 text-[#0ba5e9]" /> Add Lab Entry
          </button>
          <button 
            onClick={() => navigate('/daily-entry')}
            className="flex items-center gap-2 px-4 py-2 bg-[#0ba5e9] hover:bg-[#38bdf8] text-black rounded-xl text-xs font-black shadow-md transition"
          >
            <Plus className="h-4 w-4 stroke-[3]" /> Add Daily Entry
          </button>
        </div>
      </div>

      {/* Demographics Parameter Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Age/Sex */}
        <div className="bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#132839] text-[#0ba5e9] flex items-center justify-center shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">Age / Sex</span>
            <span className="text-sm font-bold text-white mt-1 block">{patient.age} years / {patient.sex === 'male' ? 'M' : patient.sex === 'female' ? 'F' : 'O'}</span>
          </div>
        </div>

        {/* Card 2: Bed */}
        <div className="bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#132839] text-[#0ba5e9] flex items-center justify-center shrink-0">
            <Bed className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">Bed Number</span>
            <span className="text-sm font-bold text-white mt-1 block">{patient.bedNumber || 'Unassigned'}</span>
          </div>
        </div>

        {/* Card 3: SOFA */}
        <div className="bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#132839] text-[#0ba5e9] flex items-center justify-center shrink-0">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">SOFA Score</span>
            <span className="text-sm font-bold text-[#10b981] mt-1 block">{patient.sofaScore || 0}</span>
          </div>
        </div>

        {/* Card 4: Date */}
        <div className="bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#132839] text-[#0ba5e9] flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">Admission Date</span>
            <span className="text-sm font-bold text-white mt-1 block">{new Date(patient.admissionDate).toLocaleDateString('en-GB')}</span>
          </div>
        </div>
      </div>

      {/* Profile Details dual-columns block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Column 1: Admission Details */}
        <div className="bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1e2e3d]/40 pb-2">
            <Clipboard className="h-4.5 w-4.5 text-[#0ba5e9]" /> Admission Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#64748b] font-bold block mb-1">BMI</span>
              <span className="text-white font-bold text-sm">{patient.bmi || 'N/A'} kg/m²</span>
            </div>
            <div>
              <span className="text-[#64748b] font-bold block mb-1">APACHE II Score</span>
              <span className="text-white font-bold text-sm">{patient.apacheIIScore || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[#64748b] font-bold block mb-1">ICU Stay Status</span>
              <select
                value={patient.status}
                onChange={async (e) => {
                  const newStatus = e.target.value;
                  try {
                    await axios.put(`/api/patients/${patient.id}`, { status: newStatus });
                    setPatient({ ...patient, status: newStatus });
                  } catch (err) {
                    console.error('Failed to update status:', err);
                  }
                }}
                className="px-2 py-1 bg-[#0a131a] border border-[#1e2e3d] rounded-lg text-white font-bold text-xs focus:outline-none focus:ring-1 focus:ring-[#0ba5e9] appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%230ba5e9%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:8px_8px] bg-[position:right_8px_center] bg-no-repeat pr-6"
              >
                <option value="active">Active</option>
                <option value="discharged">Discharged</option>
                <option value="deceased">Deceased</option>
              </select>
            </div>
            <div>
              <span className="text-[#64748b] font-bold block mb-1">ICUAW Outcome</span>
              <select
                value={patient.icuaw || 'pending'}
                onChange={async (e) => {
                  const newIcuaw = e.target.value;
                  try {
                    await axios.put(`/api/patients/${patient.id}`, { icuaw: newIcuaw });
                    setPatient({ ...patient, icuaw: newIcuaw });
                  } catch (err) {
                    console.error('Failed to update ICUAW outcome:', err);
                  }
                }}
                className="px-2 py-1 bg-[#0a131a] border border-[#1e2e3d] rounded-lg text-white font-bold text-xs focus:outline-none focus:ring-1 focus:ring-[#0ba5e9] appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%230ba5e9%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:8px_8px] bg-[position:right_8px_center] bg-no-repeat pr-6"
              >
                <option value="pending">Pending</option>
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <span className="text-xs font-bold text-[#64748b] block">Diagnosis</span>
            <div className="flex flex-wrap gap-1.5">
              {Array.isArray(patient.diagnosis) && patient.diagnosis.length > 0 ? (
                patient.diagnosis.map(tag => (
                  <span key={tag} className="text-[11px] font-bold px-2.5 py-1 bg-[#142332] text-[#94a3b8] rounded-lg">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-[#64748b] text-xs font-semibold italic">No primary diagnoses listed</span>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Medical History */}
        <div className="bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1e2e3d]/40 pb-2">
            <Activity className="h-4.5 w-4.5 text-[#0ba5e9]" /> Medical History
          </h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[#64748b] block">Comorbidities</span>
              <div className="flex flex-wrap gap-1.5">
                {Array.isArray(patient.comorbidities) && patient.comorbidities.length > 0 ? (
                  patient.comorbidities.map(tag => (
                    <span key={tag} className="text-[11px] font-bold px-2.5 py-1 bg-[#142332] text-[#94a3b8] rounded-lg">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-[#64748b] text-xs font-semibold italic">No comorbidities listed</span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[#64748b] block">Addiction History</span>
              <div className="flex flex-wrap gap-1.5">
                {Array.isArray(patient.addiction) && patient.addiction.length > 0 ? (
                  patient.addiction.map(tag => (
                    <span key={tag} className="text-[11px] font-bold px-2.5 py-1 bg-[#142332] text-[#94a3b8] rounded-lg">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-[#64748b] text-xs font-semibold italic">No addiction history</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Records & Lab Records logs timeline lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Daily records logs */}
        <div className="bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1e2e3d]/40 pb-2">
            <FileText className="h-4.5 w-4.5 text-[#0ba5e9]" /> Daily Records
          </h2>
          {(patient.DailyRecords || []).length === 0 ? (
            <div className="text-center py-8 text-[#64748b] text-xs font-semibold">No daily updates registered.</div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {patient.DailyRecords?.map((record) => (
                <div key={record.id} className="bg-[#0a131a] border border-[#1e2e3d]/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-white">{new Date(record.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="px-2 py-0.5 bg-[#142332] text-[#94a3b8] rounded text-[10px] font-bold">
                      SOFA: {record.sofaScore || 'N/A'}
                    </span>
                    <button 
                      onClick={() => navigate(`/daily-record/${record.id}`)}
                      className="px-3 py-1 border border-[#1e2e3d] text-[#e2e8f0] text-[10px] font-bold rounded-lg hover:bg-[#132230] transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
 
        {/* Lab records logs */}
        <div className="bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1e2e3d]/40 pb-2">
            <Beaker className="h-4.5 w-4.5 text-[#0ba5e9]" /> Lab Records
          </h2>
 
          {(patient.LaboratoryValues || []).length === 0 ? (
            <div className="text-center py-8 text-[#64748b] text-xs font-semibold">No lab entries registered.</div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {patient.LaboratoryValues?.map((val) => (
                <div key={val.id} className="bg-[#0a131a] border border-[#1e2e3d]/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-white">{new Date(val.date || val.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="px-2 py-0.5 bg-[#132839] text-[#0ba5e9] rounded text-[10px] font-bold">
                      Lab Record
                    </span>
                    <button 
                      onClick={() => navigate(`/lab-record/${val.id}`)}
                      className="px-3 py-1 border border-[#1e2e3d] text-[#e2e8f0] text-[10px] font-bold rounded-lg hover:bg-[#132230] transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
