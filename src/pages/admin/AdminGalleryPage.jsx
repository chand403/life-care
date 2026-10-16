import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Upload,
  Calendar,
  User,
  ExternalLink,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.jsx';
import { formatDate } from '../../lib/utils.js';
import { Modal } from '../../components/ui/Modal.jsx';
import { uploadMedicalDocumentToCloudinary } from '../../lib/cloudinary.js';

export function AdminGalleryPage({ onNavigate }) {
  const { galleryItems, patients, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [inspectingItem, setInspectingItem] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // New item form state
  const [newItem, setNewItem] = useState({
    title: '',
    category: 'Patient Recovery',
    patientId: patients[0]?.patientId || '',
    patientName: patients[0]?.name || '',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
    description: '',
    tags: '',
  });

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
      (item.patientName && item.patientName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat =
      categoryFilter === 'ALL' || item.category === categoryFilter;

    return matchesSearch && matchesCat;
  });

  const handlePatientSelect = (pid) => {
    const found = patients.find((p) => p.patientId === pid);
    setNewItem({
      ...newItem,
      patientId: pid,
      patientName: found ? found.name : '',
    });
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const meta = await uploadMedicalDocumentToCloudinary(file);
      setNewItem((prev) => ({ ...prev, imageUrl: meta.url || meta.secureUrl }));
    } catch (err) {
      alert(err.message || 'Upload error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newItem.title.trim() || !newItem.imageUrl.trim()) {
      alert('Please provide a title and an image.');
      return;
    }
    addGalleryItem({
      ...newItem,
      doctorName: 'Dr. Chandna',
      tags: newItem.tags ? newItem.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    });
    setIsAddModalOpen(false);
    setNewItem({
      title: '',
      category: 'Patient Recovery',
      patientId: patients[0]?.patientId || '',
      patientName: patients[0]?.name || '',
      imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
      description: '',
      tags: '',
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingItem) return;
    updateGalleryItem(editingItem.itemId, editingItem);
    setEditingItem(null);
  };

  const handleDelete = (itemId) => {
    if (window.confirm('Are you sure you want to permanently delete this photo record from the gallery?')) {
      deleteGalleryItem(itemId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Patient Photo Gallery Management & Editor
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin console: Upload, catalog, edit, and publish patient recovery photos and clinical care case stories.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/gallery')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
          >
            View Public Gallery
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Patient Photo</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gallery by title, patient, or notes..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 self-stretch sm:self-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                categoryFilter === cat
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              {cat === 'ALL' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Table / Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] bg-slate-50/70">
                <th className="py-3 px-4">Preview</th>
                <th className="py-3 px-4">Case Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Patient Tag</th>
                <th className="py-3 px-4">Attending</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.itemId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900 max-w-xs">{item.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{item.itemId}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-700 font-medium">{item.category}</span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-slate-900">{item.patientName || 'Facility'}</p>
                    {item.patientId && <p className="text-[10px] text-slate-400 font-mono">{item.patientId}</p>}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {item.doctorName || 'Dr. Chandna'}
                  </td>
                  <td className="py-3 px-4 text-slate-500 tabular-nums">
                    {formatDate(item.date)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-rose-800 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                      <span>{item.isPublished !== false ? 'Published' : 'Draft'}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => setInspectingItem(item)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md"
                      title="Inspect Photo"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingItem({ ...item })}
                      className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
                      title="Edit Gallery Record"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.itemId)}
                      className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Gallery Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Upload Patient Photo to LifeCare Gallery"
        subtitle="Saves clinical recovery image, patient attribution, and case milestone narrative"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Milestone / Case Title *
            </label>
            <input
              type="text"
              required
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              placeholder="e.g. Post-Surgical Knee Mobility Restoration - William B."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="Patient Recovery">Patient Recovery</option>
                <option value="Clinical Milestone">Clinical Milestone</option>
                <option value="Pediatric Wellness">Pediatric Wellness</option>
                <option value="Orthopedic Rehab">Orthopedic Rehab</option>
                <option value="Hospital Facilities">Hospital Facilities</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Link Patient Record</label>
              <select
                value={newItem.patientId}
                onChange={(e) => handlePatientSelect(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="">Hospital Facility / General</option>
                {patients.map((p) => (
                  <option key={p.patientId} value={p.patientId}>
                    {p.name} ({p.patientId})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Photo URL & File Upload */}
          <div className="space-y-2">
            <label className="block font-semibold text-slate-700">Patient Photo / Image Source *</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={newItem.imageUrl}
                onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                placeholder="https://... or upload below"
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer flex items-center gap-1 font-semibold whitespace-nowrap">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
                <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
              </label>
            </div>
            {isUploading && <p className="text-[11px] text-rose-600 animate-pulse">Uploading image...</p>}
            {newItem.imageUrl && (
              <div className="pt-2">
                <img
                  src={newItem.imageUrl}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-xl border border-slate-200"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Clinical Narrative / Recovery Notes
            </label>
            <textarea
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              rows={3}
              placeholder="Describe therapeutic results, vitals milestones, or surgical recovery notes achieved under Dr. Chandna..."
              className="w-full p-2.5 border rounded-lg"
            />
          </div>

          <div className="pt-3 border-t flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3.5 py-1.5 text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-2xs"
            >
              Publish to Gallery
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Gallery Item Modal */}
      {editingItem && (
        <Modal
          isOpen={Boolean(editingItem)}
          onClose={() => setEditingItem(null)}
          title={`Edit Gallery Photo: ${editingItem.title}`}
          subtitle={`ID: ${editingItem.itemId}`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Title</label>
              <input
                type="text"
                value={editingItem.title}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="Patient Recovery">Patient Recovery</option>
                  <option value="Clinical Milestone">Clinical Milestone</option>
                  <option value="Pediatric Wellness">Pediatric Wellness</option>
                  <option value="Orthopedic Rehab">Orthopedic Rehab</option>
                  <option value="Hospital Facilities">Hospital Facilities</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  value={editingItem.patientName}
                  onChange={(e) => setEditingItem({ ...editingItem, patientName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
              <input
                type="text"
                value={editingItem.imageUrl}
                onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                value={editingItem.description}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                rows={3}
                className="w-full p-2.5 border rounded-lg"
              />
            </div>
            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-bold text-white bg-rose-600 rounded-lg shadow-2xs"
              >
                Save Photo Record
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Inspect Item Modal */}
      {inspectingItem && (
        <Modal
          isOpen={Boolean(inspectingItem)}
          onClose={() => setInspectingItem(null)}
          title={inspectingItem.title}
          subtitle={`Gallery Case #${inspectingItem.itemId}`}
        >
          <div className="space-y-4 text-xs">
            <img
              src={inspectingItem.imageUrl}
              alt={inspectingItem.title}
              className="w-full h-72 object-cover rounded-xl border border-slate-200"
              referrerPolicy="no-referrer"
            />
            <p className="text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              {inspectingItem.description}
            </p>
            <div className="flex justify-between text-slate-500 pt-2 border-t">
              <span>Patient: <strong className="text-slate-900">{inspectingItem.patientName}</strong></span>
              <span>Attending: <strong className="text-slate-900">{inspectingItem.doctorName}</strong></span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
