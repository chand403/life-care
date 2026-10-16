import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Search,
  Calendar,
  User,
  Stethoscope,
  Eye,
  Filter,
  ArrowRight,
  ShieldCheck,
  Edit,
  ExternalLink,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatDate } from '../../lib/utils.js';
import { Modal } from '../../components/ui/Modal.jsx';

export function GalleryPage({ onNavigate }) {
  const { user } = useAuth();
  const { galleryItems } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [activeItem, setActiveItem] = useState(null);

  const categories = [
    'ALL',
    'Patient Recovery',
    'Clinical Milestone',
    'Pediatric Wellness',
    'Orthopedic Rehab',
    'Hospital Facilities',
  ];

  const filtered = galleryItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.patientName && item.patientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCat =
      categoryFilter === 'ALL' || item.category === categoryFilter;

    return matchesSearch && matchesCat && item.isPublished !== false;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
          LifeCare Patient Care Showcase
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Patient Recovery & Clinical Gallery
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Documenting real patient health milestones, rehabilitation progressions, and therapeutic outcomes achieved under Dr. Chandna's clinical direction.
        </p>

        {user?.role === 'admin' && (
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/admin/gallery')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-xs"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Admin: Manage & Upload to Gallery</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient, recovery milestone, or tag..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 self-stretch sm:self-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                categoryFilter === cat
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.itemId}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative overflow-hidden cursor-pointer" onClick={() => setActiveItem(item)}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-2xs">
                  {item.category}
                </span>
                <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-slate-900 text-[11px] font-mono font-medium px-2 py-0.5 rounded shadow-2xs">
                  {item.itemId}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-rose-600 transition-colors">
                    {item.title}
                  </h3>
                  {item.patientName && (
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-rose-600" />
                      <span>Patient: <strong className="text-slate-800">{item.patientName}</strong></span>
                      {item.patientId && <span className="font-mono text-[10px]">({item.patientId})</span>}
                    </p>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Attending: <strong>{item.doctorName || 'Dr. Chandna'}</strong></span>
                  <span className="tabular-nums">{formatDate(item.date)}</span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => setActiveItem(item)}
                className="w-full py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-rose-600" />
                <span>View Full Photo & Case Story</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-bold text-slate-700 text-sm">No photos found in this category</p>
          <p className="mt-1">Try another category or search term.</p>
        </div>
      )}

      {/* Lightbox / Case Inspection Modal */}
      {activeItem && (
        <Modal
          isOpen={Boolean(activeItem)}
          onClose={() => setActiveItem(null)}
          title={activeItem.title}
          subtitle={`Case Record #${activeItem.itemId} · Category: ${activeItem.category}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4 text-xs">
            <img
              src={activeItem.imageUrl}
              alt={activeItem.title}
              className="w-full h-80 sm:h-96 object-cover rounded-xl border border-slate-200 shadow-sm"
              referrerPolicy="no-referrer"
            />

            <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-950 uppercase tracking-wider text-[10px]">
                  Clinical Recovery Narrative
                </span>
                <span className="text-slate-500 tabular-nums">Dated: {formatDate(activeItem.date)}</span>
              </div>
              <p className="text-slate-800 text-xs leading-relaxed">
                {activeItem.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Patient File</span>
                <span className="font-bold text-slate-900">{activeItem.patientName || 'Clinical Record'}</span>
                {activeItem.patientId && <span className="block font-mono text-slate-500">{activeItem.patientId}</span>}
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Supervising Physician</span>
                <span className="font-bold text-slate-900">{activeItem.doctorName || 'Dr. Chandna'}</span>
                <span className="block text-rose-700 font-medium">Chief Medical Director</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveItem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Close View
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
