import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  Calendar,
  X,
  Filter,
  Pencil,
  Trash2,
  MoreVertical,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "./Sidebar";

// Sample company data
const initialCompanies = [
  {
    id: 1,
    name: "Tech Solutions Inc",
    industry: "Information Technology",
    location: "New York, USA",
    employeeCount: "1000+",
    website: "www.techsolutions.com",
    email: "hr@techsolutions.com",
    phone: "+1 (555) 123-4567",
    visitingDate: "2024-03-15",
    description: "Leading provider of enterprise software solutions",
    requirements: "B.Tech/M.Tech in Computer Science",
    package: "12-18 LPA",
  },
  // Add more sample companies as needed
];

// Company Card Component with Actions
const CompanyCard = ({ company, onViewDetails, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 relative">
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 flex-1 cursor-pointer"
          onClick={() => onViewDetails(company)}
        >
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
            <p className="text-sm text-gray-500">{company.industry}</p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(company);
                  setShowActions(false);
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Pencil className="h-4 w-4" />
                <span>Edit Company</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(company);
                  setShowActions(false);
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Company</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{company.location}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Visiting: {company.visitingDate}</span>
        </div>
      </div>
    </div>
  );
};

// Company Details Modal Component
const CompanyDetailsModal = ({ company, onClose }) => {
  if (!company) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-lg bg-blue-100 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
                <p className="text-gray-500">{company.industry}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Globe className="h-4 w-4" />
                    <span>{company.website}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{company.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{company.phone}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="mt-1 text-gray-600">{company.location}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Package Details</h3>
                <p className="mt-1 text-gray-900 font-semibold">{company.package}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Requirements</h3>
                <p className="mt-1 text-gray-600">{company.requirements}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Visit Date</h3>
                <p className="mt-1 text-gray-600">{company.visitingDate}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">About Company</h3>
            <p className="mt-1 text-gray-600">{company.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Company Modal Component
const AddCompanyModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    website: '',
    email: '',
    phone: '',
    visitingDate: '',
    description: '',
    requirements: '',
    package: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...formData, id: Date.now() });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Add New Company</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Package</label>
              <input
                type="text"
                required
                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                value={formData.package}
                onChange={(e) => setFormData({...formData, package: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Requirements</label>
              <textarea
                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                rows="3"
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Visiting Date</label>
              <input
                type="date"
                required
                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                value={formData.visitingDate}
                onChange={(e) => setFormData({...formData, visitingDate: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Add Company
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Company Modal Component
const EditCompanyModal = ({ company, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(company);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Edit Company</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                required
                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Industry</label>
              <input
                type="text"
                required
                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                required
                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Website</label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Package</label>
            <input
              type="text"
              required
              className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
              value={formData.package}
              onChange={(e) => setFormData({...formData, package: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Requirements</label>
            <textarea
              className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
              rows="3"
              value={formData.requirements}
              onChange={(e) => setFormData({...formData, requirements: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Visiting Date</label>
            <input
              type="date"
              required
              className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2"
              value={formData.visitingDate}
              onChange={(e) => setFormData({...formData, visitingDate: e.target.value})}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
);
};


// New Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, companyName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        
        <h2 className="text-lg font-semibold text-gray-900 text-center mb-2">
          Delete Company
        </h2>
        
        <p className="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to delete <span className="font-medium">{companyName}</span>? This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};


// Main ManageCompany Component
const ManageCompany = () => {
const [companies, setCompanies] = useState(initialCompanies);
const [selectedCompany, setSelectedCompany] = useState(null);
const [isAddModalOpen, setIsAddModalOpen] = useState(false);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [editingCompany, setEditingCompany] = useState(null);
const [searchTerm, setSearchTerm] = useState('');
const [filterIndustry, setFilterIndustry] = useState('');
const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [companyToDelete, setCompanyToDelete] = useState(null);

const filteredCompanies = companies.filter(company => {
  const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       company.location.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesIndustry = !filterIndustry || company.industry === filterIndustry;
  return matchesSearch && matchesIndustry;
});

const industries = [...new Set(companies.map(company => company.industry))];

const handleAddCompany = (newCompany) => {
  setCompanies([...companies, newCompany]);
};

const handleEditCompany = (company) => {
  setEditingCompany(company);
  setIsEditModalOpen(true);
};

const handleSaveEdit = (updatedCompany) => {
  setCompanies(companies.map(company => 
    company.id === updatedCompany.id ? updatedCompany : company
  ));
};



const handleDeleteCompany = (companyToDelete) => {
  setCompanyToDelete(companyToDelete);
  setDeleteModalOpen(true);
};

const confirmDelete = () => {
  setCompanies(companies.filter(company => company.id !== companyToDelete.id));
  setDeleteModalOpen(false);
  setCompanyToDelete(null);
};

return (
  <div className="flex">
    <Sidebar />
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Companies</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Add Company</span>
          </button>
        </div>

        <div className="mb-6 flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <select
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
            >
              <option value="">All Industries</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {filteredCompanies.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onViewDetails={() => setSelectedCompany(company)}
                onEdit={handleEditCompany}
                onDelete={handleDeleteCompany}
              />
            ))}
          </div>
        )}

        {/* Modals */}

        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setCompanyToDelete(null);
          }}
          onConfirm={confirmDelete}
          companyName={companyToDelete?.name}
        />

        {selectedCompany && (
          <CompanyDetailsModal
            company={selectedCompany}
            onClose={() => setSelectedCompany(null)}
          />
        )}

        <AddCompanyModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddCompany}
        />

        {editingCompany && (
          <EditCompanyModal
            company={editingCompany}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingCompany(null);
            }}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    </div>
  </div>
);
};

export default ManageCompany;