import React, { useState } from 'react';
import { X, Mic, Camera, MapPin, CheckCircle, ArrowRight, ArrowLeft, Sparkles, Volume2, Upload, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../utils/speech';

export default function ReportModal() {
  const { isReportModalOpen, setIsReportModalOpen, createIssue } = useApp();
  const { elderMode, kidMode, readAloud } = useAccessibility();

  const [step, setStep] = useState(1); // 1: Category, 2: Details & Photo, 3: Location & Submit
  const [category, setCategory] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [address, setAddress] = useState('');
  const [urgency, setUrgency] = useState('Medium');
  const [reporterName, setReporterName] = useState('');
  const [reporterType, setReporterType] = useState(() => (kidMode ? 'kid' : elderMode ? 'elder' : 'citizen'));
  
  const [isRecording, setIsRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdResult, setCreatedResult] = useState(null);

  if (!isReportModalOpen) return null;

  const categories = [
    { name: 'Roads & Potholes', icon: '🚧', desc: 'Broken street, big pothole, uneven curb' },
    { name: 'Street Lighting & Electricity', icon: '💡', desc: 'Dark street, flickering light, hanging wire' },
    { name: 'Water Supply & Leakage', icon: '💧', desc: 'Broken pipe, leaking water, blocked drain' },
    { name: 'Sanitation & Waste', icon: '🗑️', desc: 'Overflowing dustbin, garbage pile, litter' },
    { name: 'Parks & Playgrounds', icon: '🛝', desc: 'Broken swing, unsafe slide, park fence' },
    { name: 'Public Safety & Obstructions', icon: '⚠️', desc: 'Fallen tree branch, open manhole, hazard' },
  ];

  const samplePhotos = {
    'Roads & Potholes': 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    'Street Lighting & Electricity': 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    'Water Supply & Leakage': 'https://images.unsplash.com/photo-1527066579998-dbbae57f45ce?auto=format&fit=crop&w=800&q=80',
    'Sanitation & Waste': 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    'Parks & Playgrounds': 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
    'Public Safety & Obstructions': 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=800&q=80',
  };

  const handleSelectCategory = (cat) => {
    setCategory(cat.name);
    setCategoryIcon(cat.icon);
    if (!photo) {
      setPhoto(samplePhotos[cat.name] || samplePhotos['Roads & Potholes']);
    }
    if (!title) {
      setTitle(`${cat.name} issue in our neighborhood`);
    }
    setStep(2);
  };

  // Voice Dictation
  const handleVoiceRecord = () => {
    if (!isSpeechRecognitionSupported()) {
      alert('Voice dictation is supported in modern browsers like Chrome or Edge.');
      return;
    }

    setIsRecording(true);
    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setDescription(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      },
      (err) => {
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );

    if (recognizer) {
      recognizer.start();
    }
  };

  // Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-detect location
  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setAddress(`Near ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (Current GPS location)`);
        },
        () => {
          setAddress('Main Street, Ward 4, Neighborhood Center');
        }
      );
    } else {
      setAddress('Main Street, Ward 4, Neighborhood Center');
    }
  };

  // Submit Issue
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      setStep(1);
      return;
    }

    setSubmitting(true);
    const newIssue = await createIssue({
      title: title || `${category} reported`,
      description: description || 'Reported by local resident for municipal repair.',
      category,
      categoryIcon,
      urgency,
      location: {
        address: address || 'Community Area, Ward 4',
        lat: 12.9716 + (Math.random() - 0.5) * 0.02,
        lng: 77.5946 + (Math.random() - 0.5) * 0.02
      },
      reporter: {
        name: reporterName.trim() || (reporterType === 'kid' ? 'Junior Hero Leo' : reporterType === 'elder' ? 'Community Elder' : 'Active Citizen'),
        type: reporterType,
        badge: reporterType === 'kid' ? 'Junior Civic Hero ⭐' : reporterType === 'elder' ? 'Community Elder' : 'Active Citizen'
      },
      photo: photo || samplePhotos[category] || samplePhotos['Roads & Potholes']
    });

    setSubmitting(false);
    if (newIssue) {
      setCreatedResult(newIssue);
      readAloud(`Great job! Your problem has been reported successfully with tracking code ${newIssue.id}. Municipal authorities have been notified.`);
    }
  };

  const handleClose = () => {
    setIsReportModalOpen(false);
    setCreatedResult(null);
    setStep(1);
    setTitle('');
    setDescription('');
    setAddress('');
    setPhoto('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className={`font-extrabold text-slate-900 ${kidMode ? 'text-xl text-pink-600' : 'text-lg'}`}>
              {kidMode ? '🦸 Spot & Report a Problem!' : elderMode ? 'Report a Problem to Authorities' : 'Report Community Issue'}
            </h3>
            <p className="text-xs text-slate-500">
              {createdResult ? 'Action Initiated' : `Step ${step} of 3 • Quick & Easy`}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto">
          {createdResult ? (
            /* Success Confirmation Screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner animate-bounce">
                ✅
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                  Successfully Submitted!
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                  Thank You for Helping Our Community!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto mt-1">
                  Your report has been logged in the municipal triage queue. You can check updates anytime using this tracking code:
                </p>
              </div>

              {/* Big Tracking Code Card */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl max-w-sm mx-auto shadow-md">
                <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Your Tracking ID</span>
                <span className="text-2xl font-mono font-extrabold tracking-widest text-emerald-400 block mt-1">
                  {createdResult.id}
                </span>
              </div>

              {/* What happens next box */}
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-left max-w-md mx-auto text-xs space-y-2">
                <p className="font-bold text-sky-900">What happens next?</p>
                <div className="flex items-center gap-2 text-sky-800">
                  <span className="w-5 h-5 rounded-full bg-sky-200 font-bold flex items-center justify-center text-[10px]">1</span>
                  <span>Helpdesk reviews the problem & priority</span>
                </div>
                <div className="flex items-center gap-2 text-sky-800">
                  <span className="w-5 h-5 rounded-full bg-sky-200 font-bold flex items-center justify-center text-[10px]">2</span>
                  <span>Dispatches repair team to the location</span>
                </div>
                <div className="flex items-center gap-2 text-sky-800">
                  <span className="w-5 h-5 rounded-full bg-sky-200 font-bold flex items-center justify-center text-[10px]">3</span>
                  <span>Uploads proof photo here once fixed!</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition"
              >
                Done & View on Feed
              </button>
            </div>
          ) : (
            /* 3-Step Wizard Form */
            <div>
              {/* Step 1: Pick Category */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="text-center sm:text-left">
                    <h4 className="text-base sm:text-lg font-bold text-slate-900">
                      Step 1: What is the problem?
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Tap the card that matches what you saw in your street or park.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => handleSelectCategory(cat)}
                        className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all hover:border-sky-500 hover:shadow-md ${
                          category === cat.name
                            ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-300'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-3xl p-2 bg-slate-100 rounded-xl shrink-0">
                          {cat.icon}
                        </span>
                        <div>
                          <p className="font-bold text-sm text-slate-900">{cat.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{cat.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Details, Voice & Photo */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900">
                        Step 2: Tell us what is wrong
                      </h4>
                      <p className="text-xs text-slate-500">
                        Category: {categoryIcon} {category}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs text-sky-600 hover:text-sky-700 font-semibold"
                    >
                      Change Category
                    </button>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Problem Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Deep pothole near crossing"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  {/* Description with Voice Dictation */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Description (Details)
                      </label>
                      {/* Voice Dictation Button */}
                      <button
                        type="button"
                        onClick={handleVoiceRecord}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                          isRecording
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                        title="Dictate description with your voice"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>{isRecording ? 'Listening (Speak now)...' : '🎙️ Dictate with Voice'}</span>
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Explain what is broken or dangerous (You can tap the microphone button above to speak!)..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  {/* Photo Preview & Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Photo of Problem
                    </label>
                    <div className="flex items-center gap-4">
                      {photo ? (
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                          <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setPhoto('')}
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0">
                          <Camera className="w-6 h-6" />
                          <span className="text-[10px] mt-1">No Photo</span>
                        </div>
                      )}

                      <div className="flex-1 space-y-2">
                        <label className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload From Phone / Device</span>
                          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                        </label>
                        <p className="text-[11px] text-slate-500">
                          (Preset community photo is automatically attached if no camera image is selected)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reporter Identity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Your Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        placeholder="e.g. Leo (Age 9) or Grandpa Joe"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Reporting As
                      </label>
                      <select
                        value={reporterType}
                        onChange={(e) => setReporterType(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="citizen">Active Citizen 👤</option>
                        <option value="elder">Senior Citizen 👵👴</option>
                        <option value="kid">Junior Civic Hero ⭐ (Kids)</option>
                      </select>
                    </div>
                  </div>

                  {/* Step Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md flex items-center gap-1.5"
                    >
                      <span>Next: Location</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Location & Urgency */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900">
                      Step 3: Where is this problem?
                    </h4>
                    <p className="text-xs text-slate-500">
                      Help municipal workers find and fix it quickly.
                    </p>
                  </div>

                  {/* Location Address */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Street Address or Landmark
                      </label>
                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                      >
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>Use My GPS</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Corner of 4th Ave & Oak Street, Ward 5"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  {/* Urgency Level */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      How urgent is this?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Normal', value: 'Low', desc: 'Can be scheduled' },
                        { label: 'Moderate', value: 'Medium', desc: 'Needs attention soon' },
                        { label: 'Urgent Hazard', value: 'High', desc: 'Danger to seniors/kids' },
                      ].map((u) => (
                        <button
                          key={u.value}
                          type="button"
                          onClick={() => setUrgency(u.value)}
                          className={`p-2.5 rounded-xl border text-center transition ${
                            urgency === u.value
                              ? u.value === 'High'
                                ? 'bg-red-50 border-red-500 ring-2 ring-red-300 font-bold text-red-900'
                                : 'bg-sky-50 border-sky-500 ring-2 ring-sky-300 font-bold text-sky-900'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          <span className="block text-xs sm:text-sm">{u.label}</span>
                          <span className="text-[10px] text-slate-400 block">{u.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary Review Card */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                    <p className="font-bold text-slate-800">Review Summary:</p>
                    <p className="text-slate-600">
                      <strong>Category:</strong> {categoryIcon} {category}
                    </p>
                    <p className="text-slate-600">
                      <strong>Title:</strong> {title || 'Community issue'}
                    </p>
                    <p className="text-slate-600">
                      <strong>Location:</strong> {address || 'Community Area'}
                    </p>
                  </div>

                  {/* Submit Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleSubmit}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-sm font-extrabold shadow-lg shadow-emerald-200 flex items-center gap-2 transition"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      <span>{submitting ? 'Submitting Report...' : 'Submit Report to Authorities!'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
