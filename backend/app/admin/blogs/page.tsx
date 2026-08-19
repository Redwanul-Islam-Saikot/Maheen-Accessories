'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Loader2, Image as ImageIcon, UploadCloud, Eye } from 'lucide-react';

interface BlogItem {
  _id: string;
  title: string;
  dateBadge: string;
  imageUrl: string;
  description?: string;
}

export default function AdminBlogsDashboard() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    dateBadge: '',
    description: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');

  const fetchBlogs = async () => {
    try {
      setFetching(true);
      const res = await fetch(`/api/blogs?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setBlogs(data.data);
      } else if (Array.isArray(data)) {
        setBlogs(data);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      setBlogs([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFile(null);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(null);
    setCurrentImageUrl('');
    setFormData({ title: '', dateBadge: '', description: '' });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: BlogItem) => {
    setEditingId(item._id);
    setCurrentImageUrl(item.imageUrl || '');
    setFormData({
      title: item.title || '',
      dateBadge: item.dateBadge || '',
      description: item.description || '',
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

        const cloudData = await cloudRes.json();
        if (!cloudRes.ok) throw new Error(cloudData.error?.message || 'Image upload failed');
        imageUrl = cloudData.secure_url;
      }

      if (!imageUrl) {
        alert('Please upload a blog image!');
        setLoading(false);
        return;
      }

      const payload = {
        title: formData.title,
        dateBadge: formData.dateBadge,
        description: formData.description,
        imageUrl: imageUrl,
      };

      if (editingId) {
        const res = await fetch(`/api/blogs/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.error || 'Failed to update blog');
      } else {
        const res = await fetch('/api/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.error || 'Failed to create blog');
      }

      await fetchBlogs();
      setIsModalOpen(false);
      resetForm();
    } catch (error: any) {
      alert(error.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      const resData = await res.json();

      if (res.ok) {
        await fetchBlogs();
      } else {
        alert(resData.error || 'Failed to delete blog.');
      }
    } catch (err) {
      alert('Delete failed!');
    } finally {
      setDeletingId(null);
    }
  };

  const previewImg = filePreview || currentImageUrl || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="w-full space-y-6 text-slate-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activity & Blog Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Total Posts: {blogs.length}</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-[#52132e] hover:bg-[#3e0e22] text-white text-sm px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} /> Add New Activity
        </button>
      </div>

      {/* Grid List */}
      {fetching ? (
        <div className="flex justify-center py-20 text-slate-400 gap-2 items-center">
          <Loader2 className="animate-spin" size={20} /> Loading activities...
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3">
          <ImageIcon className="mx-auto text-slate-300" size={48} />
          <p className="text-slate-500 text-sm font-medium">No activity or blog added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {blogs.map((item) => (
            <div key={item._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-3 left-3 bg-[#7152f3] text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider rounded">
                    {item.dateBadge}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h2 className="font-bold text-slate-900 leading-snug line-clamp-2">{item.title}</h2>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-[11px] font-medium text-slate-400">Actions</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    <Edit size={13} /> Edit
                  </button>

                  <button
                    disabled={deletingId === item._id}
                    onClick={() => handleDelete(item._id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    {deletingId === item._id ? <Loader2 className="animate-spin" size={13} /> : <Trash2 size={13} />}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-800">{editingId ? 'Edit Activity/Blog' : 'Add New Activity/Blog'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
              <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 space-y-4 border-r border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Activity Photo</label>
                  {filePreview || currentImageUrl ? (
                    <div className="relative border border-slate-200 rounded-xl overflow-hidden h-40">
                      <img src={filePreview || currentImageUrl} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setFile(null); setFilePreview(null); setCurrentImageUrl(''); }}
                        className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded-full hover:bg-rose-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-200 hover:border-[#52132e] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50">
                      <UploadCloud className="text-slate-400 mb-1" size={32} />
                      <span className="text-xs font-semibold text-slate-700">Click to upload photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        required={!editingId && !currentImageUrl}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) { setFile(f); setFilePreview(URL.createObjectURL(f)); }
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date Badge Text</label>
                  <input
                    type="text"
                    placeholder="e.g. 20-22 SEP 2023"
                    value={formData.dateBadge}
                    onChange={(e) => setFormData({ ...formData, dateBadge: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#52132e]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="Enter activity title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#52132e]"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-[#52132e] hover:bg-[#3e0e22] text-white rounded-lg text-xs font-medium disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && <Loader2 className="animate-spin" size={14} />}
                    {loading ? 'Saving...' : editingId ? 'Update Activity' : 'Save Activity'}
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
                  </div>

                  <div className="bg-white text-slate-900 border border-slate-300 p-3 rounded-lg space-y-3">
                    <div className="relative h-40 bg-slate-100 overflow-hidden rounded">
                      <img src={previewImg} alt="preview" className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 bg-[#7152f3] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                        {formData.dateBadge || 'DATE BADGE'}
                      </span>
                    </div>
                    <h3 className="font-bold text-xs leading-snug line-clamp-2">
                      {formData.title || 'Activity Title Preview'}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                      Read More &rarr;
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}