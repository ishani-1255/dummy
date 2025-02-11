import React, { useState } from 'react';
import { Download, FileText, X } from 'lucide-react';
import { Card, CardContent, CardHeader1, CardTitle } from './UIComponents';

const ExportCoordData = ({ isOpen, onClose, coordinators, departments }) => {
  const [filters, setFilters] = useState({
    department: '',
    startDate: '',
    endDate: '',
    company: ''
  });

  const [exportFormat, setExportFormat] = useState('json'); // 'json' or 'pdf'

  if (!isOpen) return null;

  const filterData = () => {
    let filteredCoordinators = [...coordinators];

    if (filters.department) {
      filteredCoordinators = filteredCoordinators.filter(
        coord => coord.department === filters.department
      );
    }

    if (filters.company) {
      filteredCoordinators = filteredCoordinators.map(coord => ({
        ...coord,
        duties: coord.duties.filter(duty => 
          duty.company.toLowerCase().includes(filters.company.toLowerCase())
        )
      })).filter(coord => coord.duties.length > 0);
    }

    if (filters.startDate || filters.endDate) {
      filteredCoordinators = filteredCoordinators.map(coord => ({
        ...coord,
        duties: coord.duties.filter(duty => {
          const dutyDate = new Date(duty.date);
          const afterStart = !filters.startDate || dutyDate >= new Date(filters.startDate);
          const beforeEnd = !filters.endDate || dutyDate <= new Date(filters.endDate);
          return afterStart && beforeEnd;
        })
      })).filter(coord => coord.duties.length > 0);
    }

    return filteredCoordinators;
  };

  const generatePrintableHTML = (data) => {
    const totalDuties = data.reduce((acc, coord) => acc + coord.duties.length, 0);
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Coordinator Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .header { margin-bottom: 20px; }
            .summary { margin-bottom: 30px; }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Student Placement Coordinators Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="summary">
            <h2>Summary</h2>
            <p>Total Coordinators: ${data.length}</p>
            <p>Total Duties: ${totalDuties}</p>
            ${filters.department ? `<p>Department: ${filters.department}</p>` : ''}
            ${filters.startDate ? `<p>From: ${new Date(filters.startDate).toLocaleDateString()}</p>` : ''}
            ${filters.endDate ? `<p>To: ${new Date(filters.endDate).toLocaleDateString()}</p>` : ''}
          </div>
          ${data.map(coord => `
            <div class="coordinator-section">
              <h3>${coord.name} - ${coord.department}</h3>
              <p>Email: ${coord.email}</p>
              <p>Phone: ${coord.phone}</p>
              <p>Batch: ${coord.batch}, Semester: ${coord.semester}</p>
              ${coord.duties.length > 0 ? `
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Company</th>
                      <th>Location</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${coord.duties.map(duty => `
                      <tr>
                        <td>${new Date(duty.date).toLocaleDateString()} ${duty.time}</td>
                        <td>${duty.company}</td>
                        <td>${duty.location}</td>
                        <td>${duty.description || '-'}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              ` : '<p>No duties assigned</p>'}
            </div>
          `).join('')}
        </body>
      </html>
    `;
  };

  const handleExport = () => {
    const filteredData = filterData();
    
    if (exportFormat === 'json') {
      const data = {
        coordinators: filteredData,
        exportDate: new Date().toISOString(),
        totalCoordinators: filteredData.length,
        totalDuties: filteredData.reduce((acc, curr) => acc + curr.duties.length, 0),
        filters: {
          ...filters,
          generatedAt: new Date().toISOString()
        }
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `coordinator-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const html = generatePrintableHTML(filteredData);
      const printWindow = window.open('', '_blank');
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white">
        <CardHeader1 className="flex space-y-0 items-center justify-between">
          <CardTitle>Export Data</CardTitle>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </CardHeader1>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <select
                className="w-full p-2 border rounded"
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={filters.company}
                onChange={(e) => setFilters({...filters, company: e.target.value})}
                placeholder="Filter by company name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-medium mb-2">Export Format</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setExportFormat('json')}
                className={`flex items-center space-x-2 px-4 py-2 rounded ${
                  exportFormat === 'json' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'border'
                }`}
              >
                <Download className="h-4 w-4" />
                <span>JSON Export</span>
              </button>
              <button
                onClick={() => setExportFormat('pdf')}
                className={`flex items-center space-x-2 px-4 py-2 rounded ${
                  exportFormat === 'pdf' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'border'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Printable Document</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Export Data
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportCoordData;