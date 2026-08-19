'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Loader2, UploadCloud, X, ChevronRight, Eye } from 'lucide-react';

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ title: '', subtitle: '', order: 0 });
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  const fetchItems = async () => {
    try {
      setFetching(true);
      const res = await fetch(`/api/portfolio?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', subtitle: '', order: items.length + 1 });
    setFile(null);
    setFilePreview(null);
    setCurrentImageUrl('');
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item._id);
    setFormData({ title: item.title, subtitle: item.subtitle || '', order: item.order || 0 });
    setCurrentImageUrl(item.image);
    setFile(null);
    setFilePreview(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      let imgUrl = currentImageUrl;

      if (file) {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'bylxfdh4';
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'maheen-accessories';

        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('upload_preset', uploadPreset);

        const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: uploadData,
        });

        const cloudData = await cloudRes.json();
        if (!cloudRes.ok) throw new Error(cloudData.error?.message || 'Image upload failed');
        imgUrl = cloudData.secure_url;
      }

      if (!imgUrl) {
        alert('Please upload an image!');
        setLoading(false);
        return;
      }

      const payload = { ...formData, image: imgUrl };

      const res = await fetch(editingId ? `/api/portfolio/${editingId}` : '/api/portfolio', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) throw new Error(resData.error || 'Operation failed');

      await fetchItems();
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      alert(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      if (res.ok) fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 text-slate-800 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Portfolio Showcase</h1>
          <p className="text-xs text-slate-500 mt-1">Manage, upload, and organize showcase images for frontend slider</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-[#52132e] hover:bg-[#3d0e22] text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md active:scale-95"
        >
          <Plus size={16} /> Add New Photo
        </button>
      </div>

      {/* Grid List */}
      {fetching ? (
        <div className="flex justify-center items-center py-24"><Loader2 className="animate-spin text-[#52132e] h-8 w-8" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-sm text-slate-500">No items found in portfolio. Add one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
              <div>
                <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 space-y-1">
                  <h3 className="font-bold text-slate-900 text-base leading-snug">{item.title}</h3>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{item.subtitle || 'NO SUBTITLE'}</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex justify-end gap-2">
                <button onClick={() => handleOpenEdit(item)} className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5">
                  <Edit size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(item._id)} className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal with Live Card Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                {editingId ? <Edit size={18} className="text-[#52132e]" /> : <Plus size={18} className="text-[#52132e]" />}
                {editingId ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
              </h3>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                {/* Left Side: Form Controls */}
                <div className="space-y-4">
                  {/* Image Upload Input Area */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Card Image *
                    </label>
                    <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-[#52132e] transition-colors bg-slate-50/50 group cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) { 
                            setFile(f); 
                            setFilePreview(URL.createObjectURL(f)); 
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <div className="p-3 bg-white rounded-full shadow-sm text-slate-500 group-hover:text-[#52132e] transition-colors">
                          <UploadCloud size={20} />
                        </div>
                        <p className="text-xs font-semibold text-slate-700">
                          {file ? file.name : 'Click or Drag & Drop image'}
                        </p>
                        <p className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 5MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Title Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Main Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Customize Button"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border border-slate-200 focus:border-[#52132e] focus:ring-1 focus:ring-[#52132e] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400"
                      required
                    />
                  </div>

                  {/* Subtitle / Brand Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Subtitle / Brand Tag
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BY MAHEEN ACCESSORIES LIMITED."
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full border border-slate-200 focus:border-[#52132e] focus:ring-1 focus:ring-[#52132e] rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Right Side: Live Frontend Card Preview */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye size={14} className="text-[#52132e]" /> Live Card Preview
                  </label>
                  
                  {/* Simulated Frontend Card */}
                  <div className="relative w-full h-[260px] rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900">
                    {filePreview || currentImageUrl ? (
                      <img 
                        src={filePreview || currentImageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-800 text-xs">
                        <span>No image selected</span>
                      </div>
                    )}

                    {/* Circle Arrow Action Button Mock */}
                    <div className="absolute top-4 right-4 z-20">
                      <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                        <ChevronRight size={16} className="text-slate-800 ml-0.5" />
                      </div>
                    </div>

                    {/* Bottom Title & Subtitle Badge Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 z-20 text-slate-900 bg-white/50 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/40">
                      <h3 className="text-sm font-bold leading-tight truncate">
                        {formData.title || 'Your Title Here'}
                      </h3>
                      <p className="text-[9px] font-semibold tracking-wider text-slate-800 uppercase mt-0.5 truncate">
                        {formData.subtitle || 'BY MAHEEN ACCESSORIES LIMITED.'}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Action Buttons */}
              <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="px-6 py-2 bg-[#52132e] hover:bg-[#3d0e22] text-white rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving Changes...' : editingId ? 'Update Item' : 'Create Item'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}