'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Loader2, Image as ImageIcon, UploadCloud, Eye } from 'lucide-react';

export default function AdminMembersDashboard() {
  const [members, setMembers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    memberNumber: '',
    name: '',
    designation: '',
    facebook: '',
    instagram: '',
    linkedin: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');

  const safeJsonParse = async (response: Response) => {
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch (e) {
      return {};
    }
  };

  // Fetch Members (নতুনগুলো ফার্স্টে রাখার জন্য সর্টিং নিশ্চিত করা হয়েছে)
  const fetchMembers = async () => {
    try {
      setFetching(true);
      const res = await fetch(`/api/members?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
      const data = await safeJsonParse(res);

      let fetchedData = [];
      if (data.success && Array.isArray(data.data)) {
        fetchedData = data.data;
      } else if (Array.isArray(data)) {
        fetchedData = data;
      }

      setMembers(fetchedData);
    } catch (error) {
      console.error('Failed to fetch members:', error);
      setMembers([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFilePreview(null);
    setCurrentImageUrl('');
    setFormData({
      memberNumber: String(members.length + 1).padStart(2, '0'),
      name: '',
      designation: '',
      facebook: '',
      instagram: '',
      linkedin: '',
    });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setEditingId(item._id);
    setCurrentImageUrl(item.image || item.imageUrl || '');
    setFormData({
      memberNumber: item.memberNumber || '',
      name: item.name || '',
      designation: item.designation || '',
      facebook: item.facebook || '',
      instagram: item.instagram || '',
      linkedin: item.linkedin || '',
    });
    setFile(null);
    setFilePreview(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      let imageUrl = currentImageUrl;

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

        const cloudData = await safeJsonParse(cloudRes);
        if (!cloudRes.ok) throw new Error(cloudData.error?.message || 'Image upload failed');
        imageUrl = cloudData.secure_url;
      }

      if (!imageUrl) {
        alert('Please select or upload a member image!');
        setLoading(false);
        return;
      }

      const payload = {
        memberNumber: formData.memberNumber,
        name: formData.name,
        designation: formData.designation,
        facebook: formData.facebook,
        instagram: formData.instagram,
        linkedin: formData.linkedin,
        image: imageUrl,
        imageUrl: imageUrl,
      };

      if (editingId) {
        const res = await fetch(`/api/members/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const resData = await safeJsonParse(res);
        if (!res.ok || resData.success === false) {
          throw new Error(resData.error || resData.message || 'Failed to update member');
        }
      } else {
        const res = await fetch('/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const resData = await safeJsonParse(res);
        if (!res.ok || resData.success === false) {
          throw new Error(resData.error || resData.message || 'Failed to add member');
        }
      }

      await fetchMembers();
      setIsModalOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Submit Error:', error);
      alert(error.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/members/${id}`, { method: 'DELETE' });
      const resData = await safeJsonParse(res);

      if (res.ok && resData.success !== false) {
        await fetchMembers();
      } else {
        alert(resData.error || 'Failed to delete member.');
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      alert(err.message || 'Delete failed!');
    } finally {
      setDeletingId(null);
    }
  };

  const previewImg =
    filePreview ||
    currentImageUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="w-full space-y-6 text-slate-800 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Board & Team Members</h1>
          <p className="text-sm text-slate-500 mt-0.5">Total Members: {members.length}</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-[#52132e] hover:bg-[#3e0e22] text-white text-sm px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} /> Add New Member
        </button>
      </div>

      {fetching ? (
        <div className="flex justify-center py-20 text-slate-400 gap-2 items-center">
          <Loader2 className="animate-spin" size={20} /> Loading members...
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3">
          <ImageIcon className="mx-auto text-slate-300" size={48} />
          <p className="text-slate-500 text-sm font-medium">No Board Members added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="h-56 bg-slate-100 border-b relative flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image || item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover object-top"
                  />
                  {item.memberNumber && (
                    <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-2.5 py-0.5 rounded-md shadow-sm">
                      #{item.memberNumber}
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-1">
                  <h2 className="font-bold text-slate-900 leading-snug line-clamp-1">
                    {item.name}
                  </h2>
                  <p className="text-xs text-purple-700 font-semibold line-clamp-1">
                    {item.designation}
                  </p>

                  <div className="flex items-center gap-2 pt-2 text-slate-400">
                    {item.facebook && <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">FB</span>}
                    {item.instagram && <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">IG</span>}
                    {item.linkedin && <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">IN</span>}
                  </div>
                </div>
              </div>

              <div className="p-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-[11px] font-medium text-slate-400">Actions</span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm active:scale-95"
                    title="Edit Member"
                  >
                    <Edit size={13} />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    disabled={deletingId === item._id}
                    onClick={() => handleDelete(item._id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200/60 rounded-lg hover:bg-rose-600 hover:text-white transition-all duration-200 shadow-sm active:scale-95 disabled:opacity-50"
                    title="Delete Member"
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-800">
                {editingId ? 'Edit Member Details' : 'Add New Member'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
              <form
                onSubmit={handleSubmit}
                className="lg:col-span-7 p-6 space-y-4 border-r border-slate-100"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Member Photo {editingId ? '(Optional)' : '*'}
                  </label>
                  {filePreview || currentImageUrl ? (
                    <div className="relative border border-slate-200 rounded-xl p-2 bg-slate-50 flex items-center justify-center h-36">
                      <img
                        src={filePreview || currentImageUrl}
                        alt="preview"
                        className="h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setFilePreview(null);
                          setCurrentImageUrl('');
                        }}
                        className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-200 hover:border-[#52132e] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
                      <UploadCloud className="text-slate-400 mb-1" size={28} />
                      <span className="text-xs font-semibold text-slate-700">
                        Click to upload photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        required={!editingId && !currentImageUrl}
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

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Order / #
                    </label>
                    <input
                      type="text"
                      placeholder="01"
                      value={formData.memberNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, memberNumber: e.target.value })
                      }
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#52132e]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Eleanor Pena"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#52132e]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chief Executive Officer"
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#52132e]"
                    required
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-800 block">
                    Social Media Profiles
                  </span>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      placeholder="Facebook Profile URL"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      className="w-full border border-slate-200 p-2 rounded-lg text-xs focus:outline-none focus:border-[#52132e]"
                    />
                    <input
                      type="text"
                      placeholder="Instagram Profile URL"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      className="w-full border border-slate-200 p-2 rounded-lg text-xs focus:outline-none focus:border-[#52132e]"
                    />
                    <input
                      type="text"
                      placeholder="LinkedIn Profile URL"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="w-full border border-slate-200 p-2 rounded-lg text-xs focus:outline-none focus:border-[#52132e]"
                    />
                  </div>
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
                    {loading ? 'Saving...' : editingId ? 'Update Member' : 'Save Member'}
                  </button>
                </div>
              </form>

              <div className="lg:col-span-5 bg-slate-900 p-6 text-white flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                      <Eye size={14} className="text-emerald-400" /> LIVE WEBSITE CARD
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                      Frontend State
                    </span>
                  </div>

                  <div className="bg-[#f8fafc] text-slate-900 p-4 rounded-xl space-y-3">
                    <div className="w-full h-64 bg-slate-200 overflow-hidden">
                      <img
                        src={previewImg}
                        alt="Member Preview"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">
                        {formData.name || 'Member Name'}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {formData.designation || 'Designation Title'}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 text-center italic border-t border-slate-800/80 pt-3">
                  * Live preview shows real-time changes as you type or upload images.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}