'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Upload, Sparkles, AlertCircle, CheckCircle2, 
  ShieldAlert, RefreshCw, Leaf, Bug, FileText, Camera, Zap, 
  BookOpen, ChevronRight, Stethoscope, Beaker, Check, Copy, 
  Printer, Info, Activity, AlertTriangle, Layers, Droplets, Sun, 
  Sprout, Share2, CheckSquare, Square
} from 'lucide-react';
import { detectCropDisease } from '@/services/farmerService';
import AppLayout from '@/components/AppLayout';

interface ChemicalTreatment {
  name: string;
  dosage: string;
  timing: string;
  precautions?: string;
}

interface StructuredAdvisoryData {
  summary?: string;
  immediateActions?: string[];
  organicCure?: string[];
  chemicalCure?: ChemicalTreatment[];
  prevention?: string[];
  fertilizerWateringAdvice?: string;
  recommendationMarkdown?: string;
}

interface DetectionResult {
  detected?: boolean;
  crop: string | null;
  issue: string | null;
  severity?: string;
  category?: string;
  confidence: number;
  affectedParts?: string[];
  symptoms?: string[];
  description: string;
}

interface DiseaseAgentResponse {
  success: boolean;
  message?: string;
  detection: DetectionResult;
  structuredData?: StructuredAdvisoryData;
  recommendation?: string;
  sources?: string[];
}

// Preset sample photos for quick 1-click testing
const PRESET_SAMPLES = [
  {
    id: 'sample-tomato-blight',
    title: 'Tomato Leaf Blight',
    crop: 'Tomato',
    issue: 'Early Blight (Alternaria solani)',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1626f?auto=format&fit=crop&w=800&q=80',
    description: 'Dark brown spots with concentric ring halos on lower tomato leaves.'
  },
  {
    id: 'sample-corn-rust',
    title: 'Maize Common Rust',
    crop: 'Maize / Corn',
    issue: 'Common Rust (Puccinia sorghi)',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
    description: 'Golden-brown pustules spreading along corn leaf blades.'
  },
  {
    id: 'sample-cotton-aphid',
    title: 'Cotton Aphid Infestation',
    crop: 'Cotton',
    issue: 'Aphid Damage (Aphis gossypii)',
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80',
    description: 'Curled leaves with sticky honeydew and small green insect colonies.'
  },
  {
    id: 'sample-rice-blast',
    title: 'Paddy Rice Leaf Blast',
    crop: 'Rice',
    issue: 'Rice Blast (Magnaporthe oryzae)',
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
    description: 'Spindle-shaped necrotic lesions with greyish-white centers.'
  }
];

function DiseaseDetectorContent() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseAgentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'organic' | 'chemical' | 'prevention' | 'sources'>('overview');
  const [copied, setCopied] = useState(false);
  const [checkedActions, setCheckedActions] = useState<{ [key: number]: boolean }>({});

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }
    setError(null);
    setResult(null);
    setSelectedImage(file);
    setCheckedActions({});
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Helper to load sample preset images into File objects
  const handleSelectPresetSample = async (sample: typeof PRESET_SAMPLES[0]) => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      setCheckedActions({});

      // Create a canvas-generated synthetic image buffer matching the sample for instant analysis
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw agricultural leaf background
        const grad = ctx.createLinearGradient(0, 0, 600, 400);
        grad.addColorStop(0, '#15803d');
        grad.addColorStop(0.5, '#166534');
        grad.addColorStop(1, '#064e3b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 600, 400);

        // Draw leaf vein patterns
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(300, 400);
        ctx.quadraticCurveTo(280, 200, 300, 0);
        ctx.stroke();

        // Draw disease spots
        ctx.fillStyle = '#78350f';
        ctx.beginPath(); ctx.arc(220, 150, 24, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(360, 240, 30, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(220, 150, 28, 0, Math.PI * 2); ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`${sample.crop} - ${sample.title}`, 30, 50);
      }

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setImagePreview(sample.image || dataUrl);

      // Convert canvas blob to File
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `${sample.id}.jpg`, { type: 'image/jpeg' });
          setSelectedImage(file);
        }
        setLoading(false);
      }, 'image/jpeg');

    } catch (err) {
      console.error('Preset sample error:', err);
      setError('Could not load sample image. Please upload a photo.');
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      const response = await detectCropDisease(selectedImage);
      setResult(response);
      setActiveTab('overview');
    } catch (err: any) {
      console.error('Disease detection error:', err);
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        'Failed to analyze the crop image. Please check backend connections.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    setCheckedActions({});
  };

  const toggleActionCheck = (index: number) => {
    setCheckedActions(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleCopyReport = () => {
    if (!result) return;
    const det = result.detection;
    const struct = result.structuredData;

    let text = `🌾 AI CROP DOCTOR DIAGNOSTIC REPORT\n`;
    text += `====================================\n`;
    text += `Crop: ${det?.crop || 'Crop'}\n`;
    text += `Diagnosis: ${det?.issue || 'Condition'}\n`;
    text += `Severity: ${det?.severity || 'Moderate'} | Confidence: ${det?.confidence || 0}%\n`;
    text += `Category: ${det?.category || 'N/A'}\n\n`;

    if (det?.description) {
      text += `VISUAL OBSERVATION:\n${det.description}\n\n`;
    }

    if (struct?.summary) {
      text += `ADVISORY SUMMARY:\n${struct.summary}\n\n`;
    }

    if (struct?.immediateActions && struct.immediateActions.length > 0) {
      text += `IMMEDIATE ACTION PLAN:\n` + struct.immediateActions.map((a, i) => `${i + 1}. ${a}`).join('\n') + `\n\n`;
    }

    if (struct?.organicCure && struct.organicCure.length > 0) {
      text += `ORGANIC & BIOLOGICAL CURES:\n` + struct.organicCure.map(c => `• ${c}`).join('\n') + `\n\n`;
    }

    if (struct?.chemicalCure && struct.chemicalCure.length > 0) {
      text += `CHEMICAL TREATMENTS & DOSAGE:\n` + struct.chemicalCure.map(c => `• ${c.name}: ${c.dosage} (${c.timing})`).join('\n') + `\n\n`;
    }

    if (result.recommendation) {
      text += `FULL RECOMMENDATION:\n${result.recommendation}\n`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Severity color helpers
  const getSeverityStyle = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-800',
          badge: 'bg-rose-600 text-white',
          icon: <ShieldAlert size={16} className="text-rose-600 shrink-0" />
        };
      case 'high':
        return {
          bg: 'bg-orange-50 border-orange-200 text-orange-800',
          badge: 'bg-orange-600 text-white',
          icon: <AlertTriangle size={16} className="text-orange-600 shrink-0" />
        };
      case 'moderate':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-900',
          badge: 'bg-amber-500 text-white',
          icon: <AlertCircle size={16} className="text-amber-600 shrink-0" />
        };
      case 'low':
      case 'healthy':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          badge: 'bg-emerald-600 text-white',
          icon: <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
        };
      default:
        return {
          bg: 'bg-slate-50 border-slate-200 text-slate-800',
          badge: 'bg-slate-700 text-white',
          icon: <Info size={16} className="text-slate-600 shrink-0" />
        };
    }
  };

  return (
    <div className="max-w-screen-md mx-auto min-h-screen bg-slate-50/60 pb-32">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all text-gray-700"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-base font-black text-gray-900 tracking-tight flex items-center gap-2">
              AI Crop Doctor <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">RAG Multimodal 2.0</span>
            </h1>
          </div>
        </div>
        <button 
          onClick={resetScanner} 
          className="text-xs font-bold text-gray-500 hover:text-emerald-700 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-xl hover:bg-emerald-50 active:scale-95"
        >
          <RefreshCw size={14} /> Reset
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Banner Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-green-900 to-slate-900 rounded-[32px] p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/20">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-16 w-48 h-48 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles size={14} className="animate-pulse text-amber-300" /> Vision AI + RAG Agricultural Vector DB
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Instant Crop Disease & Pest Diagnosis
            </h2>
            <p className="text-emerald-100/80 text-xs sm:text-sm font-medium leading-relaxed max-w-lg">
              Upload a crop photo or test a sample image below. Our AI identifies symptoms and retrieves verified scientific treatments with exact chemical & organic dosages.
            </p>
          </div>
        </div>

        {/* Scanner / Upload Area */}
        {!imagePreview ? (
          <div className="space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-[32px] p-8 sm:p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[280px] ${
                dragActive 
                  ? 'border-emerald-500 bg-emerald-50/80 scale-[0.99]' 
                  : 'border-emerald-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/30 shadow-sm'
              }`}
            >
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />

              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-green-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 mb-5 group-hover:scale-110 transition-transform">
                <Camera size={36} />
              </div>

              <h3 className="text-lg font-black text-gray-900 tracking-tight mb-1">
                Upload Affected Crop Photo
              </h3>
              <p className="text-xs font-semibold text-gray-500 mb-6 max-w-xs">
                Drag & drop leaf or crop image, or tap to pick from gallery
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-bold">
                  <Leaf size={13} className="text-emerald-600" /> Fungal & Leaf Blights
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-bold">
                  <Bug size={13} className="text-amber-600" /> Pests & Insects
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-bold">
                  <Beaker size={13} className="text-purple-600" /> Nutrient Deficiencies
                </span>
              </div>
            </div>

            {/* Quick Preset Samples Section */}
            <div className="bg-white rounded-[28px] border border-gray-100 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} className="text-amber-500" /> Or Test Instant Preset Samples:
                </h4>
                <span className="text-[10px] font-bold text-gray-400">Tap to load</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRESET_SAMPLES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectPresetSample(sample)}
                    className="group relative rounded-2xl overflow-hidden border border-gray-200 hover:border-emerald-500 bg-slate-900 aspect-square text-left p-2 flex flex-col justify-end transition-all hover:shadow-md active:scale-95"
                  >
                    <img 
                      src={sample.image} 
                      alt={sample.title} 
                      className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="relative z-10">
                      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-black/60 px-1.5 py-0.5 rounded-md backdrop-blur-xs block w-max mb-1">
                        {sample.crop}
                      </span>
                      <p className="text-[11px] font-black text-white leading-snug line-clamp-2">
                        {sample.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Image Selected & Preview Area */
          <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm space-y-6">
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video max-h-72 flex items-center justify-center group shadow-inner">
              <img 
                src={imagePreview} 
                alt="Selected Crop" 
                className="w-full h-full object-contain"
              />
              
              {/* Scanning Overlay Animation */}
              {loading && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-4 p-4">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
                    <div className="w-16 h-16 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
                    <Sparkles size={24} className="text-emerald-400 absolute" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-black text-sm text-emerald-300 tracking-wide uppercase">Analyzing Image with Gemini Vision...</p>
                    <p className="text-xs text-gray-300">Searching scientific vector database for verified remedies</p>
                  </div>
                </div>
              )}

              {!loading && !result && (
                <button 
                  onClick={resetScanner} 
                  className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white text-xs font-bold px-3.5 py-1.5 rounded-full backdrop-blur-md transition-all shadow-md active:scale-95"
                >
                  Change Photo
                </button>
              )}
            </div>

            {!result && (
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-700 via-green-600 to-teal-600 text-white rounded-2xl py-4 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg shadow-emerald-700/25 active:scale-[0.98] transition-all hover:opacity-95 disabled:opacity-50 cursor-pointer"
              >
                <Stethoscope size={20} /> Run Diagnostic & Remedy Scan
              </button>
            )}
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold flex items-start gap-3 animate-in fade-in">
            <AlertCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-extrabold uppercase tracking-wide">Analysis Error</p>
              <p className="text-rose-700 font-semibold">{error}</p>
            </div>
          </div>
        )}

        {/* Diagnostic Results Dashboard */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Result Summary Card */}
            {(() => {
              const det = result.detection;
              const sev = getSeverityStyle(det?.severity);
              return (
                <div className={`p-6 sm:p-8 rounded-[32px] border shadow-sm ${
                  det?.detected ? 'bg-white border-emerald-200' : 'bg-amber-50/80 border-amber-200'
                }`}>
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {det?.detected ? (
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${sev.badge} inline-flex items-center gap-1`}>
                            {sev.icon} Severity: {det?.severity || 'High'}
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                            Uncertain / Healthy
                          </span>
                        )}

                        {det?.category && (
                          <span className="bg-slate-100 text-slate-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-slate-200">
                            Category: {det.category}
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                        {det?.issue || 'No Specific Issue Detected'}
                      </h3>

                      {det?.crop && (
                        <p className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Leaf size={15} className="text-emerald-600" /> Target Crop: <span className="text-gray-900 font-extrabold">{det.crop}</span>
                        </p>
                      )}
                    </div>

                    {det?.confidence > 0 && (
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-2 flex flex-col items-center justify-center text-center shadow-lg shadow-emerald-500/20 shrink-0">
                        <span className="text-2xl font-black leading-none">{det.confidence}%</span>
                        <span className="text-[9px] font-extrabold uppercase tracking-widest mt-1 opacity-90">Match</span>
                      </div>
                    )}
                  </div>

                  {/* Affected Plant Parts */}
                  {det?.affectedParts && det.affectedParts.length > 0 && (
                    <div className="pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                        <Layers size={12} className="text-emerald-600" /> Affected Organs:
                      </span>
                      {det.affectedParts.map((part, idx) => (
                        <span key={idx} className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-lg border border-emerald-100">
                          {part}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Visual Observation */}
                  {det?.description && (
                    <div className="mt-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 leading-relaxed space-y-1">
                      <span className="font-extrabold text-slate-900 block uppercase tracking-wider text-[10px]">
                        AI Visual Inspection Summary:
                      </span>
                      <p>{det.description}</p>

                      {det.symptoms && det.symptoms.length > 0 && (
                        <div className="pt-2 mt-2 border-t border-slate-200/80 space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Key Visual Symptoms:</span>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                            {det.symptoms.map((sym, sIdx) => (
                              <li key={sIdx} className="flex items-center gap-1.5 text-slate-800 font-bold">
                                <Check size={12} className="text-emerald-600 shrink-0" /> {sym}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Action Bar (Copy & Print & Share) */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
              <span className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={15} className="text-emerald-600" /> Diagnostic Prescription
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyReport}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center gap-1.5 transition-all active:scale-95"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Report'}
                </button>

                <button
                  onClick={handlePrint}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Printer size={14} /> Print Report
                </button>
              </div>
            </div>

            {/* Structured Treatment Dashboard Tabs */}
            <div className="bg-white rounded-[32px] border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
              {/* Tabs Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-gray-100">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
                    activeTab === 'overview'
                      ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <BookOpen size={14} /> Overview
                </button>

                <button
                  onClick={() => setActiveTab('actions')}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
                    activeTab === 'actions'
                      ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <CheckSquare size={14} /> Immediate Actions
                </button>

                <button
                  onClick={() => setActiveTab('organic')}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
                    activeTab === 'organic'
                      ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Sprout size={14} /> Organic Remedies
                </button>

                <button
                  onClick={() => setActiveTab('chemical')}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
                    activeTab === 'chemical'
                      ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Beaker size={14} /> Chemical Cure & Dosage
                </button>

                <button
                  onClick={() => setActiveTab('prevention')}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
                    activeTab === 'prevention'
                      ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <ShieldAlert size={14} /> Prevention & Care
                </button>

                {result.sources && result.sources.length > 0 && (
                  <button
                    onClick={() => setActiveTab('sources')}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
                      activeTab === 'sources'
                        ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <FileText size={14} /> RAG Sources ({result.sources.length})
                  </button>
                )}
              </div>

              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-5 animate-in fade-in">
                  {result.structuredData?.summary && (
                    <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-xs font-semibold text-emerald-950 leading-relaxed">
                      <span className="font-extrabold text-emerald-900 block mb-1 uppercase tracking-wider text-[10px]">
                        Diagnostic Brief:
                      </span>
                      {result.structuredData.summary}
                    </div>
                  )}

                  {/* Render Full Markdown Text */}
                  <div className="prose prose-sm max-w-none text-gray-800 font-medium leading-relaxed whitespace-pre-line text-xs sm:text-sm bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                    {result.recommendation}
                  </div>
                </div>
              )}

              {/* Tab 2: Immediate Actions Checklist */}
              {activeTab === 'actions' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2">
                      <CheckSquare size={18} className="text-emerald-600" /> Urgency Field Checklist
                    </h4>
                    <span className="text-[11px] font-bold text-gray-400">Check off as you complete</span>
                  </div>

                  {result.structuredData?.immediateActions && result.structuredData.immediateActions.length > 0 ? (
                    <div className="space-y-2.5">
                      {result.structuredData.immediateActions.map((action, idx) => (
                        <div 
                          key={idx}
                          onClick={() => toggleActionCheck(idx)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                            checkedActions[idx] 
                              ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900 line-through opacity-75' 
                              : 'bg-white border-gray-200 text-gray-800 hover:border-emerald-400 hover:bg-emerald-50/20'
                          }`}
                        >
                          <button className="mt-0.5 text-emerald-600 shrink-0">
                            {checkedActions[idx] ? <CheckSquare size={18} /> : <Square size={18} className="text-gray-400" />}
                          </button>
                          <span className="text-xs font-bold leading-relaxed">{action}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-semibold text-gray-500 italic p-4 bg-slate-50 rounded-2xl">
                      Follow general sanitation and isolate infected plant parts immediately.
                    </p>
                  )}
                </div>
              )}

              {/* Tab 3: Organic Cures */}
              {activeTab === 'organic' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center gap-2 text-sm font-black text-gray-900">
                    <Sprout size={18} className="text-emerald-600" /> Eco-Friendly & Organic Treatments
                  </div>

                  {result.structuredData?.organicCure && result.structuredData.organicCure.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {result.structuredData.organicCure.map((cure, idx) => (
                        <div key={idx} className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl text-xs font-bold text-emerald-950 flex items-start gap-3">
                          <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <span className="font-black text-emerald-900 block">Organic Remedy #{idx + 1}</span>
                            <p className="text-emerald-800 font-semibold leading-relaxed">{cure}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-semibold text-gray-500 italic p-4 bg-slate-50 rounded-2xl">
                      Apply Neem oil spray (10,000 PPM @ 3ml/L) or biological bio-fungicides like Trichoderma.
                    </p>
                  )}
                </div>
              )}

              {/* Tab 4: Chemical Cure & Dosage */}
              {activeTab === 'chemical' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2">
                      <Beaker size={18} className="text-purple-600" /> Chemical Products & Exact Dosage
                    </h4>
                    <span className="text-[10px] font-extrabold bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Targeted Cure
                    </span>
                  </div>

                  {result.structuredData?.chemicalCure && result.structuredData.chemicalCure.length > 0 ? (
                    <div className="space-y-3">
                      {result.structuredData.chemicalCure.map((chem, idx) => (
                        <div key={idx} className="p-5 bg-white border border-purple-200 rounded-2xl shadow-xs space-y-3">
                          <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                            <span className="text-sm font-black text-purple-950">{chem.name}</span>
                            <span className="text-[10px] font-black bg-purple-50 text-purple-700 px-2 py-0.5 rounded-lg">
                              Chemical #{idx + 1}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Recommended Dosage:</span>
                              <span className="font-extrabold text-slate-900">{chem.dosage}</span>
                            </div>
                            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Spray Timing & Frequency:</span>
                              <span className="font-extrabold text-slate-900">{chem.timing}</span>
                            </div>
                          </div>

                          {chem.precautions && (
                            <div className="text-[11px] font-semibold text-rose-800 bg-rose-50 p-2.5 rounded-xl border border-rose-100 flex items-center gap-1.5">
                              <AlertCircle size={14} className="text-rose-600 shrink-0" />
                              <span><strong>Precaution:</strong> {chem.precautions}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-semibold text-gray-500 italic p-4 bg-slate-50 rounded-2xl">
                      Consult local agricultural officer or refer to complete advisory markdown text for specific chemical formulations.
                    </p>
                  )}
                </div>
              )}

              {/* Tab 5: Prevention & Care */}
              {activeTab === 'prevention' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center gap-2 text-sm font-black text-gray-900">
                    <ShieldAlert size={18} className="text-emerald-600" /> Long-Term Prevention & Field Care
                  </div>

                  {result.structuredData?.prevention && result.structuredData.prevention.length > 0 && (
                    <div className="space-y-2">
                      {result.structuredData.prevention.map((prevItem, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-800 flex items-start gap-2.5">
                          <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{prevItem}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {result.structuredData?.fertilizerWateringAdvice && (
                    <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs text-teal-950 font-semibold space-y-1">
                      <span className="font-extrabold text-teal-900 block uppercase tracking-wider text-[10px] flex items-center gap-1">
                        <Droplets size={14} className="text-teal-600" /> Irrigation & Fertilizer Adjustments:
                      </span>
                      <p className="leading-relaxed">{result.structuredData.fertilizerWateringAdvice}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 6: Scientific Sources */}
              {activeTab === 'sources' && result.sources && result.sources.length > 0 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center gap-2 text-sm font-black text-gray-900">
                    <FileText size={18} className="text-emerald-600" /> Cited Scientific Advisory Sources
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {result.sources.map((src, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        <span>{src}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Re-scan Action */}
            <div className="pt-4 text-center">
              <button
                onClick={resetScanner}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest inline-flex items-center gap-2 hover:bg-slate-800 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <RefreshCw size={16} /> Scan Another Crop Photo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DiseaseDetectorPage() {
  return (
    <AppLayout>
      <DiseaseDetectorContent />
    </AppLayout>
  );
}
