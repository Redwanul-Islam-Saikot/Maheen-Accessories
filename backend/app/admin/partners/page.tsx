'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Loader2, Image as ImageIcon, UploadCloud, Eye } from 'lucide-react';

export default function AdminPartnersDashboard() {
  const [partners, setPartners] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string>('');

  // Fetch Partners from Database
  const fetchPartners = async () => {
    try {
      setFetching(true);
      const res = await fetch(`/api/partners?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setPartners(data.data);
      } else if (Array.isArray(data)) {
        setPartners(data);
      } else {
        setPartners([]);
      }
    } catch (error) {
      console.error('Failed to fetch partners:', error);
      setPartners([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // Form Reset Function
  const resetForm = () => {
    setEditingId(null);
    setFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFilePreview(null);
    setCurrentLogoUrl('');
    setFormData({
      name: '',
    });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setEditingId(item._id);
    setCurrentLogoUrl(item.logoUrl || '');
    setFormData({
      name: item.name || '',
    });
    setFile(null);
    setFilePreview(null);
    setIsModalOpen(true);
  };

  // Create & Update Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      let logoUrl = currentLogoUrl;

      // Cloudinary Upload Logic
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

        const cloudData = await cloudRes.json();
        if (!cloudRes.ok) throw new Error(cloudData.error?.message || 'Logo upload failed');
        logoUrl = cloudData.secure_url;
      }

      if (!logoUrl) {
        alert('Please select or upload a partner logo!');
        setLoading(false);
        return;
      }

      const payload = {
        name: formData.name,
        logoUrl: logoUrl,
      };

      if (editingId) {
        const res = await fetch(`/api/partners/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const resData = await res.json();
        if (!res.ok) throw new Error(resData.error || 'Failed to update partner');
      } else {
        const res = await fetch('/api/partners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const resData = await res.json();
        if (!res.ok) throw new Error(resData.error || 'Failed to create partner');
      }

      await fetchPartners();
      setIsModalOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Submit Error:', error);
      alert(error.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/partners/${id}`, { method: 'DELETE' });
      const resData = await res.json();

      if (res.ok) {
        await fetchPartners();
      } else {
        alert(resData.error || 'Failed to delete partner.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Delete failed!');
    } finally {
      setDeletingId(null);
    }
  };

  const previewImg = filePreview || currentLogoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="w-full space-y-6 text-slate-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Partners Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Total Partners: {partners.length}</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-[#52132e] hover:bg-[#3e0e22] text-white text-sm px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} /> Add New Partner
        </button>
      </div>

      {/* Grid List */}
      {fetching ? (
        <div className="flex justify-center py-20 text-slate-400 gap-2 items-center">
          <Loader2 className="animate-spin" size={20} /> Loading partners...
        </div>
      ) : partners.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3">
          <ImageIcon className="mx-auto text-slate-300" size={48} />
          <p className="text-slate-500 text-sm font-medium">No Partners added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {partners.map((item) => (
            <div key={item._id} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="h-40 bg-slate-50 border-b relative flex items-center justify-center p-6">
                  <img src={item.logoUrl} alt={item.name} className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
                <div className="p-4 space-y-1">
                  <h2 className="font-bold text-slate-900 leading-snug line-clamp-1">{item.name}</h2>
                </div>
              </div>

              {/* Styled Action Buttons */}
              <div className="p-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-[11px] font-medium text-slate-400">Actions</span>

                <div className="flex items-center gap-1.5">
                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 rounded-lg hover:bg-blue-600 hover:text-white hover:border-transparent transition-all duration-200 shadow-sm active:scale-95"
                    title="Edit Partner"
                  >
                    <Edit size={13} />
                    <span>Edit</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    disabled={deletingId === item._id}
                    onClick={() => handleDelete(item._id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200/60 rounded-lg hover:bg-rose-600 hover:text-white hover:border-transparent transition-all duration-200 shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Partner"
                  >
                    {deletingId === item._id ? (
                      <>
                        <Loader2 className="animate-spin" size={13} />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal with Live Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-800">{editingId ? 'Edit Partner' : 'Add New Partner'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
            </div>

            {/* Modal Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">

              {/* Form Side */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 space-y-4 border-r border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Partner Logo {editingId ? '(Optional)' : '*'}</label>
                  {filePreview || currentLogoUrl ? (
                    <div className="relative border border-slate-200 rounded-xl p-2 bg-slate-50 flex items-center justify-center h-36">
                      <img src={filePreview || currentLogoUrl} alt="preview" className="max-h-full max-w-full object-contain rounded-lg" />
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setFilePreview(null);
                          setCurrentLogoUrl('');
                        }}
                        className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-200 hover:border-[#52132e] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
                      <UploadCloud className="text-slate-400 mb-1" size={32} />
                      <span className="text-xs font-semibold text-slate-700">Click to upload logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        required={!editingId && !currentLogoUrl}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setFile(f);
                            setFilePreview(URL.createObjectURL(f));
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Partner Name</label>
                  <input
                    type="text"
                    placeholder="e.g. H&M / M&S"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#52132e]"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-[#52132e] hover:bg-[#3e0e22] text-white rounded-lg text-xs font-medium disabled:opacity-50 flex items-center gap-2 transition-all active:scale-95"
                  >
                    {loading && <Loader2 className="animate-spin" size={14} />}
                    {loading ? 'Saving...' : editingId ? 'Update Partner' : 'Save Partner'}
                  </button>
                </div>
              </form>

              {/* Live Preview Side */}
              <div className="lg:col-span-5 bg-slate-900 p-6 text-white flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                      <Eye size={14} className="text-emerald-400" /> LIVE CARD PREVIEW
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                      Frontend State
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-medium text-slate-400">Website Partner Box View</p>
                      <div className="w-full aspect-[4/3] border border-slate-300 p-6 flex items-center justify-center bg-white rounded-lg shadow-sm">
                        <img
                          src={previewImg}
                          alt="preview logo"
                          className="max-w-[80%] max-h-[70%] object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <p className="text-xs font-semibold text-slate-300">{formData.name || 'Partner Name'}</p>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 text-center italic border-t border-slate-800/80 pt-3">
                  * Shows how the logo will render on your live website's Partners Grid.
                </p>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}