import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Beaker } from 'lucide-react';
import axios from 'axios';

export default function LabRecordDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [labRecord, setLabRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLabRecord() {
      try {
        const res = await axios.get(`/api/patients`);
        let foundRecord: any = null;
        let foundPatient: any = null;
        for (const p of res.data) {
          const detailRes = await axios.get(`/api/patients/${p.id}`);
          const rec = (detailRes.data.LaboratoryValues || []).find((r: any) => r.id === id);
          if (rec) {
            foundRecord = rec;
            foundPatient = detailRes.data;
            break;
          }
        }
        
        if (foundRecord) {
          setLabRecord({ ...foundRecord, patient: foundPatient });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLabRecord();
  }, [id]);

  if (loading) {
    return <div className="text-center py-12 text-[#64748b] text-sm font-semibold">Loading lab values details...</div>;
  }

  if (!labRecord) {
    return (
      <div className="text-center py-24 bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl">
        <h2 className="text-lg font-bold text-white">Lab Record Not Found</h2>
        <button onClick={() => navigate('/patients')} className="mt-4 text-[#0ba5e9] font-bold hover:underline">
          Return to Patients Directory
        </button>
      </div>
    );
  }

  const listItems = [
    { label: 'Hemoglobin (Hb)', val: labRecord.hb ? `${labRecord.hb} g/dL` : '-' },
    { label: 'Total Leukocyte Count (TLC)', val: labRecord.tlc ? `${labRecord.tlc} cells/mm³` : '-' },
    { label: 'Platelet Count', val: labRecord.plt ? `${labRecord.plt} cells/mm³` : '-' },
    { label: 'Glucose Variability', val: labRecord.glucoseMin || labRecord.glucoseMax ? `${labRecord.glucoseMin ?? '-'} to ${labRecord.glucoseMax ?? '-'} mg/dL` : '-' },
    { label: 'Phosphate', val: labRecord.phosphate ? `${labRecord.phosphate} mEq/L` : '-' },
    { label: 'Potassium', val: labRecord.potassium ? `${labRecord.potassium} mEq/L` : '-' },
    { label: 'Albumin', val: labRecord.albumin ? `${labRecord.albumin} mg/dL` : '-' },
    { label: 'CRP', val: labRecord.crp ? `${labRecord.crp} mg/dL` : '-' },
    { label: 'Procalcitonin', val: labRecord.procalcitonin ? `${labRecord.procalcitonin} ng/mL` : '-' },
    { label: 'Creatinine', val: labRecord.creatinine ? `${labRecord.creatinine} mg/dL` : '-' },
    { label: 'AST', val: labRecord.ast ? `${labRecord.ast} mg/dL` : '-' },
    { label: 'ALT', val: labRecord.alt ? `${labRecord.alt} mg/dL` : '-' },
    { label: 'Total Bilirubin', val: labRecord.bilirubin ? `${labRecord.bilirubin} mg/L` : '-' },
    { label: 'Lactate', val: labRecord.lactate ? `${labRecord.lactate} g/dL` : '-' },
    { label: 'Thyroid TSH', val: labRecord.tsh ? `${labRecord.tsh} U` : '-' },
    { label: 'Thyroid T3', val: labRecord.t3 ? `${labRecord.t3} U` : '-' },
    { label: 'Thyroid T4', val: labRecord.t4 ? `${labRecord.t4} U` : '-' },
  ];

  return (
    <div className="space-y-6 animate-slide-up select-none font-body text-[#e2e8f0]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/patient/${labRecord.patient.id}`)}
            className="p-2 bg-[#0b131a] border border-[#1e2e3d] rounded-xl hover:bg-[#132230] text-[#94a3b8] hover:text-white transition"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <h1 className="text-xl font-bold font-heading text-white">Lab Record Details</h1>
            <p className="text-[#64748b] text-xs font-semibold mt-1">
              Logged on: {new Date(labRecord.createdAt).toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>

        {/* Right Patient Profile Widget */}
        <div className="bg-[#0b131a] border border-[#1e2e3d]/60 px-4 py-2.5 rounded-xl flex items-center gap-6 text-xs text-[#94a3b8]">
          <div>
            <span className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider block">Patient</span>
            <span className="text-white font-bold">{labRecord.patient.name}</span>
          </div>
          <div className="border-l border-[#1e2e3d] pl-6">
            <span className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider block">UHID</span>
            <span className="text-white font-bold">{labRecord.patient.uhid}</span>
          </div>
        </div>
      </div>

      {/* Laboratory Results */}
      <div className="bg-[#0f1b26] border border-[#1e2e3d]/60 rounded-2xl p-6 space-y-6">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1e2e3d]/40 pb-2">
          <Beaker className="h-4.5 w-4.5 text-[#0ba5e9]" /> Laboratory Results
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
          {listItems.map((item) => (
            <div key={item.label} className="flex justify-between border-b border-[#1e2e3d]/20 pb-2 text-xs font-semibold">
              <span className="text-[#64748b]">{item.label}</span>
              <span className="text-white font-bold">{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
