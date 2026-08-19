'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Loader2, UploadCloud, Eye, ShieldCheck, FileText, ExternalLink } from 'lucide-react';

// --- Types ---
interface Policy {
  _id?: string;
  id?: string;
  policyNumber?: string;
  title: string;
  category?: string;
  shortDesc: string;
  iconUrl?: string;
  icon?: string;
  docUrl?: string;
  updatedDate?: string;
  isFeatured?: boolean;
}

interface PolicyFormData {
  title: string;
  category: string;
  shortDesc: string;
  docUrl: string;
  updatedDate: string;
  isFeatured: boolean;
}

const INITIAL_FORM_STATE: PolicyFormData = {
  title: '',
  category: 'General',
  shortDesc: '',
  docUrl: '',
  updatedDate: new Date().toISOString().split('T')[0],
  isFeatured: false,
};

export default function AdminPolicyDashboard() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState<PolicyFormData>(INITIAL_FORM_STATE);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [currentIconUrl, setCurrentIconUrl] = useState<string>('');

  const fetchPolicies = async () => {
    try {
      setFetching(true);
      const res = await fetch('/api/policies', { cache: 'no-store' });
      
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (data.success && Array.isArray(data.data)) {
        setPolicies(data.data);
      } else if (Array.isArray(data)) {
        setPolicies(data);
      } else {
        setPolicies([]);
      }
    } catch (error) {
      console.error('Failed to fetch policies:', error);
      setPolicies([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const resetForm = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setEditingId(null);
    setFile(null);
    setFilePreview(null);
    setCurrentIconUrl('');
    setFormData(INITIAL_FORM_STATE);
  };

  const handleInputChange = (field: keyof PolicyFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }

    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setFilePreview(null);
    }
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: Policy) => {
    const id = item._id || item.id || null;
    setEditingId(id);
    setCurrentIconUrl(item.iconUrl || item.icon || '');
    setFormData({
      title: item.title || '',
      category: item.category || 'General',
      shortDesc: item.shortDesc || '',
      docUrl: item.docUrl || '',
      updatedDate: item.updatedDate || new Date().toISOString().split('T')[0],
      isFeatured: Boolean(item.isFeatured),
    });
    setFile(null);
    setFilePreview(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      let iconUrl = currentIconUrl;

      // 1. Cloudinary Upload
      if (file) {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'bylxfdh4';
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'maheen-accessories';

        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('upload_preset', uploadPreset);

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: 'POST', body: uploadData }
        );

        const cloudText = await cloudRes.text();
        const cloudData = cloudText ? JSON.parse(cloudText) : {};

        if (!cloudRes.ok) {
          throw new Error(cloudData.error?.message || 'Cloudinary upload failed!');
        }

        iconUrl = cloudData.secure_url;
      }

      // policyNumber জেনারেট করা হচ্ছে ডাটাবেজের validation error আটকানোর জন্য
      const generatedPolicyNumber = `POL-${String(policies.length + 1).padStart(2, '0')}`;

      const payload = { 
        ...formData, 
        iconUrl,
        policyNumber: generatedPolicyNumber 
      };

      // 2. Edit (PUT) or Create (POST) Policy
      if (editingId) {
        const res = await fetch(`/api/policies/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const text = await res.text();
        const result = text ? JSON.parse(text) : {};

        if (res.ok && (result.success || result._id)) {
          alert('Policy updated successfully!');
          const updatedData = result.data || result;
          setPolicies((prev) =>
            prev.map((p) => ((p._id || p.id) === editingId ? updatedData : p))
          );
          setIsModalOpen(false);
          resetForm();
        } else {
          alert(result.error || `Failed to update policy! (Status: ${res.status})`);
        }
      } else {
        const res = await fetch('/api/policies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const text = await res.text();
        const result = text ? JSON.parse(text) : {};

        if (res.ok && (result.success || result._id)) {
          alert('Policy created successfully!');
          const newPolicy = result.data || result;
          setPolicies((prev) => [newPolicy, ...prev]);
          setIsModalOpen(false);
          resetForm();
        } else {
          alert(result.error || `Failed to save policy! (Status: ${res.status})`);
        }
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this policy?')) return;
    try {
      const res = await fetch(`/api/policies/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPolicies((prev) => prev.filter((item) => (item._id || item.id) !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-100/70 p-6 md:p-10 font-sans text-slate-800">
      <div className="w-full space-y-8 max-w-[1600px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="text-[#52132e]" size={32} />
              Policy & Terms Management
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Active Store Policies: <span className="text-[#52132e] font-bold">{policies.length}</span>
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-[#52132e] hover:bg-[#3e0e22] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>Add New Policy</span>
          </button>
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-24 text-slate-400 gap-3">
            <Loader2 className="animate-spin text-[#52132e]" size={28} />
            <span className="font-semibold text-slate-600">Loading Policies...</span>
          </div>
        ) : policies.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl border-2 border-dashed border-slate-300 text-center space-y-4">
            <FileText className="mx-auto text-slate-300" size={56} />
            <p className="text-slate-600 text-base font-semibold">No Policy added yet.</p>
          </div>
        ) : (
          /* Policies Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {policies.map((item) => {
              const policyId = item._id || item.id || '';
              return (
                <div
                  key={policyId}
                  className="group bg-white border-2 border-slate-200/90 hover:border-[#52132e]/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase tracking-wider rounded-md border border-slate-200">
                        {item.category || 'General'}
                      </span>
                      {item.isFeatured && (
                        <span className="px-2 py-0.5 bg-[#52132e]/10 text-[#52132e] text-[10px] font-bold rounded-md">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.iconUrl || item.icon ? (
                          <img
                            src={item.iconUrl || item.icon}
                            alt={item.title}
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <ShieldCheck size={24} className="text-[#52132e]" />
                        )}
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-[#52132e] transition-colors">
                        {item.title}
                      </h2>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-normal pt-1">
                      {item.shortDesc}
                    </p>

                    {item.updatedDate && (
                      <p className="text-[10px] font-medium text-slate-400">
                        Last Updated: {item.updatedDate}
                      </p>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="p-4 border-t-2 border-slate-100 flex items-center justify-between gap-3 bg-slate-50/80">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-200/80 hover:bg-[#52132e] text-slate-800 hover:text-white rounded-xl transition-all duration-200 text-xs font-bold group/btn shadow-sm"
                    >
                      <Edit size={15} className="text-slate-600 group-hover/btn:text-white transition-colors" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(policyId)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-100/70 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200/60 hover:border-rose-600 rounded-xl transition-all duration-200 text-xs font-bold group/btn shadow-sm"
                    >
                      <Trash2 size={15} className="text-rose-600 group-hover/btn:text-white transition-colors" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal with Live Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-bold text-slate-900 text-lg">
                {editingId ? 'Edit Policy' : 'Add New Policy'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-200/60"
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              
              {/* Form Controls */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 space-y-4">
                
                {/* Policy Icon / Badge Image */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Policy Badge / Icon Image (Optional)
                  </label>

                  {filePreview || currentIconUrl ? (
                    <div className="relative border-2 border-slate-200 rounded-xl p-2 bg-slate-50 flex items-center justify-center group h-28">
                      <img
                        src={filePreview || currentIconUrl}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (filePreview) URL.revokeObjectURL(filePreview);
                          setFile(null);
                          setFilePreview(null);
                          setCurrentIconUrl('');
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-md"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-300 hover:border-[#52132e] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50">
                      <UploadCloud className="text-slate-400 mb-1" size={24} />
                      <span className="text-xs font-bold text-slate-700">Click to upload icon</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">PNG, SVG, WEBP</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Title & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Policy Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Return & Refund Policy"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-[#52132e] focus:ring-1 focus:ring-[#52132e]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-[#52132e] focus:ring-1 focus:ring-[#52132e] bg-white"
                    >
                      <option value="General">General</option>
                      <option value="Privacy">Privacy & Security</option>
                      <option value="Refund">Refund & Return</option>
                      <option value="Shipping">Shipping & Delivery</option>
                      <option value="Terms">Terms of Service</option>
                    </select>
                  </div>
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Short Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Brief summary for card preview..."
                    value={formData.shortDesc}
                    onChange={(e) => handleInputChange('shortDesc', e.target.value)}
                    className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-[#52132e] focus:ring-1 focus:ring-[#52132e]"
                  />
                </div>

                {/* PDF Link & Updated Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">PDF Link (Optional)</label>
                    <input
                      type="text"
                      placeholder="https://.../policy.pdf"
                      value={formData.docUrl}
                      onChange={(e) => handleInputChange('docUrl', e.target.value)}
                      className="w-full border border-slate-200 p-2 rounded-xl text-xs focus:outline-none focus:border-[#52132e]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Effective Date</label>
                    <input
                      type="date"
                      value={formData.updatedDate}
                      onChange={(e) => handleInputChange('updatedDate', e.target.value)}
                      className="w-full border border-slate-200 p-2 rounded-xl text-xs focus:outline-none focus:border-[#52132e]"
                    />
                  </div>
                </div>

                {/* Featured Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                    className="rounded border-slate-300 text-[#52132e] focus:ring-[#52132e]"
                  />
                  <label htmlFor="isFeatured" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Show as Featured Policy on Homepage
                  </label>
                </div>

                {/* Modal Action Buttons */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-[#52132e] hover:bg-[#3e0e22] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>{editingId ? 'Updating...' : 'Saving...'}</span>
                      </>
                    ) : (
                      <span>{editingId ? 'Update Policy' : 'Save Policy'}</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Real-time Preview */}
              <div className="lg:col-span-5 bg-slate-900 p-6 flex flex-col justify-between text-white">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold tracking-wider text-[#98d2e6] uppercase flex items-center gap-2">
                      <Eye size={16} /> Card Preview
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-medium">Realtime</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-inner relative overflow-hidden">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 bg-slate-800 text-[#98d2e6] text-[10px] font-bold uppercase rounded-md border border-slate-700">
                        {formData.category || 'CATEGORY'}
                      </span>
                      {formData.isFeatured && (
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-md">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {filePreview || currentIconUrl ? (
                          <img
                            src={filePreview || currentIconUrl}
                            alt="Preview"
                            className="w-7 h-7 object-contain"
                          />
                        ) : (
                          <ShieldCheck className="text-[#98d2e6]" size={20} />
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug">
                        {formData.title || 'Policy Title Here'}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {formData.shortDesc || 'Policy summary will render here in real-time as you type.'}
                    </p>

                    {formData.docUrl && (
                      <div className="pt-1 flex items-center gap-1.5 text-[11px] text-[#98d2e6]">
                        <ExternalLink size={12} />
                        <span className="underline truncate">{formData.docUrl}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Effective: {formData.updatedDate || 'YYYY-MM-DD'}</span>
                      <span>Verified Policy</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 text-center mt-4">
                  * Live preview of the policy component card.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}