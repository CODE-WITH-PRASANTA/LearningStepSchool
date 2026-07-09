import React, { useState } from 'react';
import { 
  FaHome, 
  FaChevronRight, 
  FaSearch, 
  FaFilter, 
  FaSyncAlt, 
  FaDownload, 
  FaRegCalendarAlt,
  FaChevronLeft
} from 'react-icons/fa';
import './CompanyPolicies.css';

const initialPoliciesData = [
  { id: 1, name: 'Employee Handbook', category: 'HR', version: 'V2.1', size: '3.5 MB', effectiveDate: '01/01/2024', lastUpdated: '12/15/2023', updatedBy: 'HR Director' },
  { id: 2, name: 'Code of Conduct', category: 'Legal', version: 'V1.0', size: '1.2 MB', effectiveDate: '06/15/2023', lastUpdated: '05/20/2023', updatedBy: 'Legal Counsel' },
  { id: 3, name: 'Data Privacy Policy', category: 'IT', version: 'V1.4', size: '2.1 MB', effectiveDate: '11/20/2023', lastUpdated: '11/10/2023', updatedBy: 'CTO' },
  { id: 4, name: 'Leave & Attendance Policy', category: 'HR', version: 'V3.0', size: '1.8 MB', effectiveDate: '03/01/2024', lastUpdated: '02/15/2024', updatedBy: 'HR Manager' },
  { id: 5, name: 'Travel & Expense Policy', category: 'Finance', version: 'V2.0', size: '2.5 MB', effectiveDate: '05/10/2024', lastUpdated: '04/20/2024', updatedBy: 'Finance Lead' }
];

const CompanyPolicies = () => {
  const [policies, setPolicies] = useState(initialPoliciesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  // Column Visibility States
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    category: true,
    version: true,
    size: true,
    effectiveDate: true,
    lastUpdated: true,
    updatedBy: true,
    download: true
  });

  // Handle Checkbox Toggle for Column Visibility
  const handleColumnToggle = (columnKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  // Search Logic
  const filteredPolicies = policies.filter(policy => 
    policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.updatedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Refresh functionality: Clears search and resets data snapshot
  const handleRefresh = () => {
    setSearchTerm('');
    setPolicies([...initialPoliciesData]);
  };

  // Individual or Master CSV data export generator download trigger
  const handleDownloadCSV = (dataToExport, fileName = "Company_Policies_Export.csv") => {
    const headers = ['Policy Name', 'Category', 'Version', 'Size', 'Effective Date', 'Last Updated', 'Updated By'];
    const rows = dataToExport.map(p => [p.name, p.category, p.version, p.size, p.effectiveDate, p.lastUpdated, p.updatedBy]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="CompanyPolicies-container">
      
      {/* Outer Page Header Breadcrumbs wrapper */}
      <div className="CompanyPolicies-header">
        <h1 className="CompanyPolicies-header-title">Company Policies</h1>
        <nav className="CompanyPolicies-breadcrumbs">
          <FaHome className="CompanyPolicies-icon-home" />
          <FaChevronRight className="CompanyPolicies-icon-chevron" />
          <span>Documents</span>
          <FaChevronRight className="CompanyPolicies-icon-chevron" />
          <span className="active">Policies</span>
        </nav>
      </div>

      {/* Main Table Content Panel Card */}
      <div className="CompanyPolicies-card">
        
        {/* Actions Bar Panel */}
        <div className="CompanyPolicies-toolbar">
          <div className="CompanyPolicies-toolbar-left">
            <span className="CompanyPolicies-card-title">Organization Policies</span>
            <div className="CompanyPolicies-search-box">
              <FaSearch className="CompanyPolicies-search-icon" />
              <input 
                type="text" 
                placeholder="Search" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="CompanyPolicies-toolbar-right">
            {/* Filter Trigger Anchor */}
            <div className="CompanyPolicies-filter-wrapper">
              <button 
                className={`CompanyPolicies-tool-btn ${showFilterMenu ? 'active-btn' : ''}`}
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                title="Toggle Columns"
              >
                <FaFilter />
              </button>

              {/* Dynamic Dropdown Column Select Panel matching image reference */}
              {showFilterMenu && (
                <div className="CompanyPolicies-filter-dropdown">
                  <div className="CompanyPolicies-dropdown-scroll">
                    {Object.keys(visibleColumns).map((colKey) => (
                      <label key={colKey} className="CompanyPolicies-checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={visibleColumns[colKey]} 
                          onChange={() => handleColumnToggle(colKey)} 
                        />
                        <span className="custom-checkbox"></span>
                        <span className="label-text">
                          {colKey === 'effectiveDate' ? 'Effective Date' : 
                           colKey === 'lastUpdated' ? 'Last Updated' : 
                           colKey === 'updatedBy' ? 'Updated By' : 
                           colKey.charAt(0).toUpperCase() + colKey.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="CompanyPolicies-tool-btn" onClick={handleRefresh} title="Refresh Table">
              <FaSyncAlt />
            </button>
            <button className="CompanyPolicies-tool-btn download-main" onClick={() => handleDownloadCSV(filteredPolicies)} title="Export CSV Data">
              <FaDownload />
            </button>
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="CompanyPolicies-table-wrapper">
          <table className="CompanyPolicies-table">
            <thead>
              <tr>
                {visibleColumns.name && <th>Policy Name</th>}
                {visibleColumns.category && <th>Category</th>}
                {visibleColumns.version && <th>Version</th>}
                {visibleColumns.size && <th>Size</th>}
                {visibleColumns.effectiveDate && <th>Effective Date</th>}
                {visibleColumns.lastUpdated && <th>Last Updated</th>}
                {visibleColumns.updatedBy && <th>Updated By</th>}
                {visibleColumns.download && <th className="text-center">Download</th>}
              </tr>
            </thead>
            <tbody>
              {filteredPolicies.length > 0 ? (
                filteredPolicies.map((policy) => (
                  <tr key={policy.id}>
                    {visibleColumns.name && <td className="font-semibold text-dark truncate-cell">{policy.name}</td>}
                    {visibleColumns.category && <td>{policy.category}</td>}
                    {visibleColumns.version && <td>{policy.version}</td>}
                    {visibleColumns.size && <td>{policy.size}</td>}
                    {visibleColumns.effectiveDate && (
                      <td>
                        <div className="date-cell"><FaRegCalendarAlt className="date-icon" /> {policy.effectiveDate}</div>
                      </td>
                    )}
                    {visibleColumns.lastUpdated && (
                      <td>
                        <div className="date-cell"><FaRegCalendarAlt className="date-icon" /> {policy.lastUpdated}</div>
                      </td>
                    )}
                    {visibleColumns.updatedBy && <td>{policy.updatedBy}</td>}
                    {visibleColumns.download && (
                      <td className="text-center">
                        <button className="CompanyPolicies-row-download-btn" onClick={() => handleDownloadCSV([policy], `${policy.name.replace(/\s+/g, '_')}.csv`)}>
                          <FaDownload />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={Object.values(visibleColumns).filter(Boolean).length} className="text-center no-data">
                    No records found matching evaluation criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination Bar matching lower layout block metrics */}
        <div className="CompanyPolicies-pagination">
          <div className="CompanyPolicies-pagination-right">
            <span className="pagination-text">Items per page:</span>
            <div className="pagination-select-wrapper">
              <select className="pagination-select" defaultValue="10">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
              </select>
            </div>
            <span className="pagination-count">1 – {filteredPolicies.length} of {filteredPolicies.length}</span>
            <div className="pagination-actions">
              <button className="pagination-arrow-btn" disabled><FaChevronLeft /></button>
              <button className="pagination-arrow-btn" disabled><FaChevronRight /></button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompanyPolicies;