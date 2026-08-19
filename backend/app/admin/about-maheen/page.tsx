'use client';

import { useState, useEffect } from 'react';
import { 
  Loader2 as Spinner, 
  UploadCloud as UploadIcon, 
  Save as SaveIcon, 
  Plus as PlusIcon, 
  Edit, 
  Trash2, 
  X as CloseIcon,
  ArrowUpRight
} from 'lucide-react';

interface AboutItem {
  _id: string;
  subTitle?: string;
  headingPart1?: string;
  headingItalic?: string;
  headingSubtext?: string;
  badgeText?: string;
  badgeLink?: string;
  sectionLabel?: string;
  title?: string;
  paragraph1: string;
  paragraph2?: string; // 🟢 Optional
  circleBadgeText?: string;
  circleBadgeLink?: string;
  imageUrl: string;
}

const emptyForm = {
  subTitle: '',
  headingPart1: '',
  headingItalic: '',
  headingSubtext: '',
  badgeText: '',
  badgeLink: '',
  sectionLabel: '',
  title: '',
  paragraph1: '',
  paragraph2: '',
  circleBadgeText: '',
  circleBadgeLink: '',
};

export default function AdminAboutMaheenDashboard() {
  const [items, setItems] = useState<AboutItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');

  const fetchData = async () => {
    try {
      setFetching(true);
      const res = await fetch(`/api/about-maheen?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setItems(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

        const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: uploadData,
        });

        const cloudData = await cloudRes.json();
        if (!cloudRes.ok) throw new Error(cloudData.error?.message || 'Image upload failed');
        imageUrl = cloudData.secure_url;
      }

      if (!imageUrl) {
        alert('Please upload an image!');
        setLoading(false);
        return;
      }

      const endpoint = editId ? `/api/about-maheen/${editId}` : '/api/about-maheen';
      const method = editId ? 'PUT' : 'POST';

      // 🟢 paragraph2 ফাকা হলে ফাকা স্ট্রিং পাঠানো নিশ্চিত করা
      const payload = {
        ...formData,
        paragraph2: formData.paragraph2 || '',
        imageUrl,
      };

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (res.ok && resData.success) {
        alert(editId ? 'Item updated successfully!' : 'New item created successfully!');
        resetForm();
        fetchData();
      } else {
        throw new Error(resData.error || 'Operation failed');
      }
    } catch (error: any) {
      console.error('Submit Error:', error);
      alert(error.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: AboutItem) => {
    setEditId(item._id);
    setFormData({
      subTitle: item.subTitle || '',
      headingPart1: item.headingPart1 || '',
      headingItalic: item.headingItalic || '',
      headingSubtext: item.headingSubtext || '',
      badgeText: item.badgeText || '',
      badgeLink: item.badgeLink || '',
      sectionLabel: item.sectionLabel || '',
      title: item.title || '',
      paragraph1: item.paragraph1 || '',
      paragraph2: item.paragraph2 || '',
      circleBadgeText: item.circleBadgeText || '',
      circleBadgeLink: item.circleBadgeLink || '',
    });
    setCurrentImageUrl(item.imageUrl || '');
    setFilePreview(null);
    setFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`/api/about-maheen/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok && data.success) {
        alert('Item deleted successfully!');
        fetchData();
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Something went wrong!');
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditId(null);
    setFile(null);
    setFilePreview(null);
    setCurrentImageUrl('');
    setShowModal(false);
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center py-20 text-slate-400 gap-2">
        <Spinner className="animate-spin" size={20} /> Loading items...
      </div>
    );
  }

  const previewImg = filePreview || currentImageUrl || '';

  return (
    <div className="w-full space-y-6 text-slate-800 p-6 relative">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">About Maheen Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage and update homepage About sections.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-[#52132e] hover:bg-[#3e0e22] text-white text-xs px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm cursor-pointer"
        >
          <PlusIcon size={16} />
          Add New Item
        </button>
      </div>

      {/* Modal Window with Real-time Live Preview */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col transition-all">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">
                {editId ? 'Update About Section' : 'Add New About Section'}
              </h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <CloseIcon size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT SIDE: Form Inputs */}
              <form onSubmit={handleSubmit} className="lg:col-span-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Main Image</label>
                  <div className="flex gap-4 items-center">
                    <div className="w-28 h-20 bg-slate-100 rounded-xl overflow-hidden border relative flex-shrink-0 flex items-center justify-center text-slate-400 text-xs">
                      {previewImg ? (
                        <img src={previewImg} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        'No Image'
                      )}
                    </div>
                    <label className="flex-1 border-2 border-dashed border-slate-200 hover:border-[#52132e] rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50">
                      <UploadIcon className="text-slate-400 mb-1" size={20} />
                      <span className="text-xs font-semibold text-slate-700">Upload Image</span>
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
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Sub Title Label</label>
                    <input
                      type="text"
                      placeholder="e.g. 03 // ABOUT COMPANY"
                      value={formData.subTitle}
                      onChange={(e) => setFormData({ ...formData, subTitle: e.target.value })}
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#52132e]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Top Right Button Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Explore Now"
                      value={formData.badgeText}
                      onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#52132e]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Heading (Main Part)</label>
                    <input
                      type="text"
                      placeholder="e.g. Maheen Creates"
                      value={formData.headingPart1}
                      onChange={(e) => setFormData({ ...formData, headingPart1: e.target.value })}
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#52132e]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Heading (Italic Part)</label>
                    <input
                      type="text"
                      placeholder="e.g. What You need"
                      value={formData.headingItalic}
                      onChange={(e) => setFormData({ ...formData, headingItalic: e.target.value })}
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#52132e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Heading Subtext</label>
                  <input
                    type="text"
                    placeholder="e.g. precision, passion, and a touch of creativity."
                    value={formData.headingSubtext}
                    onChange={(e) => setFormData({ ...formData, headingSubtext: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#52132e]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Section Label</label>
                    <input
                      type="text"
                      placeholder="e.g. ABOUT MAHLEEN"
                      value={formData.sectionLabel}
                      onChange={(e) => setFormData({ ...formData, sectionLabel: e.target.value })}
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#52132e]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bottom Circle Button Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Explore Us"
                      value={formData.circleBadgeText}
                      onChange={(e) => setFormData({ ...formData, circleBadgeText: e.target.value })}
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#52132e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Content Title / Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. Crafting Excellence | Elevating Creations"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#52132e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Paragraph 1 (Required)</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter main paragraph text..."
                    value={formData.paragraph1}
                    onChange={(e) => setFormData({ ...formData, paragraph1: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#52132e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Paragraph 2 (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Enter additional description (Optional)..."
                    value={formData.paragraph2}
                    onChange={(e) => setFormData({ ...formData, paragraph2: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:border-[#52132e]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-[#52132e] hover:bg-[#3e0e22] text-white text-xs px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? <Spinner className="animate-spin" size={14} /> : <SaveIcon size={14} />}
                    {loading ? 'Saving...' : editId ? 'Update Item' : 'Create Item'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-4 py-2.5 rounded-lg font-medium transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              {/* RIGHT SIDE: Real Frontend Live Preview */}
              <div className="lg:col-span-6 bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#52132e] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Real-Time Frontend Preview
                    </span>
                  </div>

                  {/* Top Header & Right Button */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-[11px] font-bold text-[#6366f1] uppercase tracking-wider">
                        {formData.subTitle || '03 // ABOUT COMPANY'}
                      </p>
                      <h2 className="text-xl font-bold text-slate-900 mt-1">
                        {formData.headingPart1 || 'Maheen Creates'}{' '}
                        <span className="italic font-serif font-normal">{formData.headingItalic || 'What You need'}</span>
                      </h2>
                      <p className="text-xs text-slate-700 font-medium mt-1">
                        {formData.headingSubtext || 'precision, passion, and a touch of creativity.'}
                      </p>
                    </div>

                    {/* TOP RIGHT BUTTON */}
                    {formData.badgeText && (
                      <button 
                        type="button"
                        onClick={() => alert(`Navigating to Top Button Link`)}
                        className="flex items-center gap-2 bg-slate-200/80 hover:bg-slate-300 text-slate-800 text-[11px] font-semibold px-3 py-1.5 rounded-md transition-all border border-slate-300/50 flex-shrink-0 cursor-pointer hover:scale-105 active:scale-95"
                      >
                        <span>{formData.badgeText}</span>
                        <ArrowUpRight size={12} />
                      </button>
                    )}
                  </div>

                  {/* Main Grid Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-6 items-start">
                    
                    {/* Left Image & Circle Button */}
                    <div className="sm:col-span-6 relative">
                      <div className="h-44 w-full bg-slate-100 rounded-xl overflow-hidden border">
                        {previewImg ? (
                          <img src={previewImg} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-400 text-xs">Image Area</div>
                        )}
                      </div>

                      {/* CLICKABLE CIRCLE GRADIENT BUTTON */}
                      {formData.circleBadgeText && (
                        <button
                          type="button"
                          onClick={() => alert(`Circle Button Clicked: ${formData.circleBadgeText}`)}
                          className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-400 flex items-center justify-center text-white text-[10px] font-semibold text-center p-2 shadow-lg border-2 border-white backdrop-blur-xs z-10 cursor-pointer hover:scale-110 active:scale-95 transition-all group"
                        >
                          <span className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                            {formData.circleBadgeText}
                            <ArrowUpRight size={11} />
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Right Side Content */}
                    <div className="sm:col-span-6 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 tracking-wide uppercase">
                          {formData.sectionLabel || 'ABOUT MAHLEEN'}
                        </span>
                        <div className="h-[1px] bg-slate-300 flex-1"></div>
                      </div>

                      <p className="text-[11px] font-semibold text-slate-600">
                        {formData.title || 'Crafting Excellence | Elevating Creations'}
                      </p>

                      <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-4">
                        {formData.paragraph1 || 'At Maheen Accessories Ltd, we are committed to providing top-notch products that meet world-class standards.'}
                      </p>

                      {formData.paragraph2 && (
                        <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-3">
                          {formData.paragraph2}
                        </p>
                      )}
                    </div>

                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Interactive Button Preview</span>
                  <span className="text-emerald-600 font-medium">● Auto Sync</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Item List Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full bg-white border border-dashed border-slate-200 p-12 rounded-2xl text-center text-slate-400">
            No items found. Click on <strong>"Add New Item"</strong> to create one.
          </div>
        ) : (
          items.map((item) => (
            <div key={item._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="h-40 w-full bg-slate-100 rounded-xl overflow-hidden border relative">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  {item.circleBadgeText && (
                    <button 
                      type="button" 
                      className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-400 flex items-center justify-center text-white text-[8px] font-bold text-center border border-white shadow-xs cursor-pointer hover:scale-110 transition-transform"
                    >
                      {item.circleBadgeText}
                    </button>
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    {item.subTitle || 'No Subtitle'}
                  </span>
                  <h3 className="text-base font-bold text-slate-800 line-clamp-1">
                    {item.headingPart1} <span className="italic font-normal">{item.headingItalic}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.paragraph1}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400 font-medium">Actions</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#2563eb] bg-[#eff6ff] border border-[#bfdbfe] rounded-xl hover:bg-[#dbeafe] transition-all cursor-pointer shadow-2xs"
                  >
                    <Edit size={14} className="text-[#2563eb]" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#be123c] bg-[#fff1f2] border border-[#fecdd3] rounded-xl hover:bg-[#ffe4e6] transition-all cursor-pointer shadow-2xs"
                  >
                    <Trash2 size={14} className="text-[#be123c]" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}