'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Loader2, Image as ImageIcon, UploadCloud, Eye } from 'lucide-react';

// Custom SVG Icons for Live Preview
const FacebookIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

export default function AdminHeroDashboard() {
  const [banners, setBanners] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    primaryBtnText: '',
    primaryBtnLink: '',
    secondaryBtnText: '',
    secondaryBtnLink: '',
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');

  const fetchBanners = async () => {
    try {
      setFetching(true);
      const res = await fetch('/api/hero-banners', { cache: 'no-store' });
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setBanners(data.data);
      } else if (Array.isArray(data)) {
        setBanners(data);
      } else {
        setBanners([]);
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error);
      setBanners([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFile(null);
    setFilePreview(null);
    setCurrentImageUrl('');
    setFormData({
      title: '',
      tagline: '',
      description: '',
      primaryBtnText: '',
      primaryBtnLink: '',
      secondaryBtnText: '',
      secondaryBtnLink: '',
      facebookUrl: '',
      instagramUrl: '',
      linkedinUrl: '',
    });
  };

  const handleFileChange = (selectedFile: File | null) => {
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

  const handleOpenEditModal = (item: any) => {
    setEditingId(item._id || item.id);
    setCurrentImageUrl(item.imageUrl || item.image || '');
    setFormData({
      title: item.title || '',
      tagline: item.tagline || '',
      description: item.description || '',
      primaryBtnText: item.primaryBtnText || item.buttonText || '',
      primaryBtnLink: item.primaryBtnLink || item.buttonLink || '',
      secondaryBtnText: item.secondaryBtnText || '',
      secondaryBtnLink: item.secondaryBtnLink || '',
      facebookUrl: item.facebookUrl || '',
      instagramUrl: item.instagramUrl || '',
      linkedinUrl: item.linkedinUrl || '',
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
          {
            method: 'POST',
            body: uploadData,
          }
        );

        const cloudData = await cloudRes.json();

        if (!cloudRes.ok) {
          throw new Error(cloudData.error?.message || 'Cloudinary upload failed!');
        }

        imageUrl = cloudData.secure_url;
      }

      if (!imageUrl && !editingId) {
        return alert('Please select an image!');
      }

      const payload = { ...formData, imageUrl };

      if (editingId) {
        const res = await fetch(`/api/hero-banners/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await res.json();

        if (res.ok && (result.success || result._id)) {
          alert('Hero Banner updated successfully!');
          const updatedData = result.data || result;
          setBanners((prev) =>
            prev.map((b) => ((b._id || b.id) === editingId ? updatedData : b))
          );
          setIsModalOpen(false);
          resetForm();
        } else {
          alert(result.error || 'Failed to update data!');
        }
      } else {
        const res = await fetch('/api/hero-banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await res.json();

        if (res.ok && (result.success || result._id)) {
          alert('Hero Banner added successfully!');
          const newBanner = result.data || result;
          setBanners((prev) => [newBanner, ...prev]);
          setIsModalOpen(false);
          resetForm();
        } else {
          alert(result.error || 'Failed to save data!');
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
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      const res = await fetch(`/api/hero-banners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBanners((prev) => prev.filter((item) => (item._id || item.id) !== id));
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
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Hero Section Management</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Total Active Sliders: <span className="text-[#52132e] font-bold">{banners.length}</span></p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-[#52132e] hover:bg-[#3e0e22] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>Add New Slide</span>
          </button>
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-24 text-slate-400 gap-3">
            <Loader2 className="animate-spin text-[#52132e]" size={28} />
            <span className="font-semibold text-slate-600">Loading Banners...</span>
          </div>
        ) : banners.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl border-2 border-dashed border-slate-300 text-center space-y-4">
            <ImageIcon className="mx-auto text-slate-300" size={56} />
            <p className="text-slate-600 text-base font-semibold">No Hero Section added yet.</p>
          </div>
        ) : (
          /* NEW THICK & BOLD CARDS GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {banners.map((item: any) => {
              const bannerId = item._id || item.id;
              return (
                <div
                  key={bannerId}
                  className="group bg-white border-2 border-slate-200/90 hover:border-[#52132e]/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Standalone Image View - Thick Framing */}
                    <div className="p-3 bg-gradient-to-b from-slate-100 to-slate-50 border-b-2 border-slate-100 relative aspect-[16/10] flex items-center justify-center overflow-hidden">
                      <img
                        src={item.imageUrl || item.image || '/placeholder.jpg'}
                        alt={item.title}
                        className="max-h-full max-w-full object-contain rounded-lg drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-5 space-y-3">
                      {item.tagline && (
                        <span className="inline-block px-2.5 py-1 bg-[#52132e]/10 text-[#52132e] text-[10px] font-extrabold uppercase tracking-wider rounded-md">
                          {item.tagline}
                        </span>
                      )}
                      
                      <h2 className="text-lg font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-[#52132e] transition-colors">
                        {item.title}
                      </h2>
                      
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 font-normal">
                        {item.description}
                      </p>

                      {/* Social Chips */}
                      <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-500">
                        {item.facebookUrl && <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">FB</span>}
                        {item.instagramUrl && <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">IG</span>}
                        {item.linkedinUrl && <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">LN</span>}
                      </div>
                    </div>
                  </div>

                  {/* PREMIUM THICK ACTION BUTTONS */}
                  <div className="p-4 border-t-2 border-slate-100 flex items-center justify-between gap-3 bg-slate-50/80">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-200/80 hover:bg-[#52132e] text-slate-800 hover:text-white rounded-xl transition-all duration-200 text-xs font-bold group/btn shadow-sm"
                      title="Edit Banner"
                    >
                      <Edit size={15} className="text-slate-600 group-hover/btn:text-white transition-colors" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(bannerId)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-100/70 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200/60 hover:border-rose-600 rounded-xl transition-all duration-200 text-xs font-bold group/btn shadow-sm"
                      title="Delete Banner"
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

      {/* MODAL WITH SIDE-BY-SIDE LIVE PREVIEW */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-bold text-slate-900 text-lg">
                {editingId ? 'Edit Hero Banner' : 'Add New Hero Slide'}
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
              
              {/* LEFT SIDE: FORM INPUTS */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 space-y-4">
                
                {/* IMAGE UPLOADER */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Slide Image {editingId ? '(Optional)' : '*'}
                  </label>

                  {filePreview || currentImageUrl ? (
                    <div className="relative border-2 border-slate-200 rounded-xl p-2 bg-slate-50 flex items-center justify-center group h-36">
                      <img
                        src={filePreview || currentImageUrl}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setFilePreview(null);
                          setCurrentImageUrl('');
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-md"
                        title="Remove Image"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-300 hover:border-[#52132e] rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50">
                      <UploadCloud className="text-slate-400 mb-1" size={28} />
                      <span className="text-xs font-bold text-slate-700">Click to upload image</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        required={!editingId && !currentImageUrl}
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Tagline & Title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Tagline</label>
                    <input
                      type="text"
                      placeholder="e.g. QUALITY ACCESSORIES"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-[#52132e] focus:ring-1 focus:ring-[#52132e]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Innovative Solutions"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-[#52132e] focus:ring-1 focus:ring-[#52132e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Description *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Enter description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-[#52132e] focus:ring-1 focus:ring-[#52132e]"
                  />
                </div>

                {/* Primary Button Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Primary CTA Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Book A Call"
                      value={formData.primaryBtnText}
                      onChange={(e) => setFormData({ ...formData, primaryBtnText: e.target.value })}
                      className="w-full border border-slate-200 p-2 rounded-xl text-xs focus:outline-none focus:border-[#52132e]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Primary CTA Link</label>
                    <input
                      type="text"
                      placeholder="/contact"
                      value={formData.primaryBtnLink}
                      onChange={(e) => setFormData({ ...formData, primaryBtnLink: e.target.value })}
                      className="w-full border border-slate-200 p-2 rounded-xl text-xs focus:outline-none focus:border-[#52132e]"
                    />
                  </div>
                </div>

                {/* Secondary Button Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Secondary CTA Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Explore Now"
                      value={formData.secondaryBtnText}
                      onChange={(e) => setFormData({ ...formData, secondaryBtnText: e.target.value })}
                      className="w-full border border-slate-200 p-2 rounded-xl text-xs focus:outline-none focus:border-[#52132e]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Secondary CTA Link</label>
                    <input
                      type="text"
                      placeholder="/products"
                      value={formData.secondaryBtnLink}
                      onChange={(e) => setFormData({ ...formData, secondaryBtnLink: e.target.value })}
                      className="w-full border border-slate-200 p-2 rounded-xl text-xs focus:outline-none focus:border-[#52132e]"
                    />
                  </div>
                </div>

                {/* Social Links Section */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-800 mb-2">Social Media Links</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Facebook URL or #"
                      value={formData.facebookUrl}
                      onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                      className="w-full border border-slate-200 p-2 rounded-xl text-xs focus:outline-none focus:border-[#52132e]"
                    />
                    <input
                      type="text"
                      placeholder="Instagram URL or #"
                      value={formData.instagramUrl}
                      onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                      className="w-full border border-slate-200 p-2 rounded-xl text-xs focus:outline-none focus:border-[#52132e]"
                    />
                    <input
                      type="text"
                      placeholder="LinkedIn URL or #"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      className="w-full border border-slate-200 p-2 rounded-xl text-xs focus:outline-none focus:border-[#52132e]"
                    />
                  </div>
                </div>

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
                      <span>{editingId ? 'Update Hero' : 'Save Hero'}</span>
                    )}
                  </button>
                </div>
              </form>

              {/* RIGHT SIDE: LIVE PREVIEW BOX */}
              <div className="lg:col-span-5 bg-slate-900 p-6 flex flex-col justify-between text-white">
                <div className="space-y-4">
                  
                  {/* Header Badge */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold tracking-wider text-[#98d2e6] uppercase flex items-center gap-2">
                      <Eye size={16} /> Live Banner Preview
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-medium">Realtime</span>
                  </div>

                  {/* UI Preview Card */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-inner relative overflow-hidden">
                    
                    {/* Floating Social Icons */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 text-slate-400">
                      {formData.facebookUrl && <FacebookIcon />}
                      {formData.instagramUrl && <InstagramIcon />}
                      {formData.linkedinUrl && <LinkedinIcon />}
                    </div>

                    {/* Tagline */}
                    <p className="text-[10px] font-bold tracking-widest text-[#98d2e6] uppercase pr-8">
                      {formData.tagline || 'YOUR TAGLINE HERE'}
                    </p>

                    {/* Title */}
                    <h3 className="text-base font-bold text-white leading-snug">
                      {formData.title || 'Your Slide Title Will Appear Here'}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {formData.description || 'Slide description preview will automatically update right here as you type in the form.'}
                    </p>

                    {/* Buttons Preview */}
                    <div className="flex items-center gap-2 pt-2">
                      {formData.primaryBtnText && (
                        <span className="bg-[#98d2e6] text-slate-950 text-[10px] font-bold px-3 py-1.5 rounded-lg">
                          {formData.primaryBtnText}
                        </span>
                      )}
                      {formData.secondaryBtnText && (
                        <span className="border border-white/30 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg bg-white/5">
                          {formData.secondaryBtnText}
                        </span>
                      )}
                    </div>

                    {/* Image Preview Window */}
                    <div className="pt-2">
                      <div className="w-full h-36 bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-center justify-center overflow-hidden">
                        {filePreview || currentImageUrl ? (
                          <img
                            src={filePreview || currentImageUrl}
                            alt="Preview"
                            className="max-h-full max-w-full object-contain rounded"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-slate-600">
                            <ImageIcon size={26} />
                            <span className="text-[10px]">No Image Selected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 text-center mt-4">
                  * Dynamic frontend preview based on your inputs.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}