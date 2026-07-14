import React, { useState } from 'react';
import './Timesheets.css'; // ऊपर दी गई कस्टम CSS फ़ाइल लिंक कर रहे हैं

const Timesheets = () => {
  // प्रारंभिक डेटा जो 'image_0b1b5a.png' की तालिका से सटीक रूप से मेल खाता है
  const initialRecords = [
    { id: 1, name: 'John Doe', date: '2025-01-10', project: 'Project A', task: 'Development', hours: 8, status: 'Approved', description: 'Working on core backend logic' },
    { id: 2, name: 'Jane Smith', date: '2025-01-10', project: 'Project B', task: 'Testing', hours: 7, status: 'Pending', description: 'Writing unit test cases' },
    { id: 3, name: 'Bob Johnson', date: '2025-01-11', project: 'Project A', task: 'Documentation', hours: 4, status: 'Approved', description: 'Creating setup guide' },
    { id: 4, name: 'Alice Williams', date: '2025-01-11', project: 'Project C', task: 'Design', hours: 6, status: 'Rejected', description: 'Creating landing page wireframes' },
    { id: 5, name: 'Charlie Brown', date: '2025-01-12', project: 'Project B', task: 'Bug Fixing', hours: 8, status: 'Approved', description: 'Fixing authentication flows' },
    { id: 6, name: 'Diana Prince', date: '2025-01-12', project: 'Project A', task: 'Development', hours: 5, status: 'Pending', description: 'Integrating payment modules' },
    { id: 7, name: 'Edward Norton', date: '2025-01-13', project: 'Project D', task: 'Research', hours: 8, status: 'Approved', description: 'Analyzing performance bottleneck' },
    { id: 8, name: 'Fiona Gallagher', date: '2025-01-13', project: 'Project C', task: 'Development', hours: 7, status: 'Pending', description: 'Building profile screens' },
    { id: 9, name: 'George Miller', date: '2025-01-14', project: 'Project B', task: 'Testing', hours: 8, status: 'Approved', description: 'Regression testing round 1' },
    { id: 10, name: 'Hannah Montana', date: '2025-01-14', project: 'Project A', task: 'Meeting', hours: 2, status: 'Approved', description: 'Client demo presentation' },
    { id: 11, name: 'Ian Malcolm', date: '2025-01-15', project: 'Project D', task: 'Design', hours: 5, status: 'Pending', description: 'Database indexing structure design' },
    { id: 12, name: 'Kevin Parker', date: '2025-01-15', project: 'Project C', task: 'Bug Fixing', hours: 4, status: 'Approved', description: 'Resolving UI scaling issues' }
  ];

  const [dataList, setDataList] = useState(initialRecords);
  const [searchQuery, setSearchQuery] = useState('');
  
  // पेजिनेशन स्टेट्स (Dynamic Profiles Display 5, 10, 15)
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // शो/हाइड कॉलम स्टेट्स (image_0b1b99.png)
  const [colMenuOpen, setColMenuOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    checkbox: true, employeeName: true, date: true, project: true, task: true, hours: true, status: true, actions: true
  });

  // मोडल्स के लिए स्टेट्स
  const [activeModal, setActiveModal] = useState(null); // 'add', 'edit', 'delete'
  const [selectedRow, setSelectedRow] = useState(null);

  // फॉर्म फील्ड्स डेटा स्टेट (Date support और Status Dropdown के साथ)
  const [formInputs, setFormInputs] = useState({
    name: '', date: '', project: '', task: '', hours: '0', status: 'Pending', description: ''
  });

  // लाइव सर्च फ़िल्टर
  const recordsFiltered = dataList.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.task.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // पेजिनेशन गणितीय गणना
  const totalItemsCount = recordsFiltered.length;
  const maxPages = Math.ceil(totalItemsCount / itemsPerPage) || 1;
  const endIdx = currentPage * itemsPerPage;
  const startIdx = endIdx - itemsPerPage;
  const pageItems = recordsFiltered.slice(startIdx, endIdx);

  const toggleColumn = (columnKey) => {
    setVisibleColumns(prev => ({ ...prev, [columnKey]: !prev[columnKey] }));
  };

  // १. रिफ्रेश एक्शन (डेटा मूल स्थिति में वापस लाने के लिए)
  const triggerRefresh = () => {
    setDataList(initialRecords);
    setSearchQuery('');
    setCurrentPage(1);
    alert('डेटा सफलतापूर्वक रिफ्रेश हो गया है!');
  };

  // २. डाउनलोड एक्शन (JSON फ़ाइल एक्सपोर्ट)
  const triggerDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataList, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "timesheets_report.json");
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  // मोडल ओपन हैंडलर्स
  const openAddModal = () => {
    setFormInputs({ name: '', date: '', project: '', task: '', hours: '0', status: 'Pending', description: '' });
    setActiveModal('add');
  };

  const openEditModal = (record) => {
    setSelectedRow(record);
    setFormInputs({
      name: record.name, date: record.date, project: record.project, task: record.task, hours: record.hours.toString(), status: record.status, description: record.description || ''
    });
    setActiveModal('edit');
  };

  const openDeleteModal = (record) => {
    setSelectedRow(record);
    setActiveModal('delete');
  };

  // डेटा सेव / अपडेट एक्शन
  const executeSave = () => {
    if (!formInputs.name || !formInputs.project || !formInputs.date || !formInputs.task) {
      alert('कृपया आवश्यक फ़ील्ड्स (Employee Name, Project, Date, Task) अवश्य भरें!');
      return;
    }

    if (activeModal === 'add') {
      const addedRow = {
        id: Date.now(),
        ...formInputs,
        hours: parseInt(formInputs.hours) || 0
      };
      setDataList([addedRow, ...dataList]);
    } else if (activeModal === 'edit') {
      setDataList(dataList.map(item =>
        item.id === selectedRow.id ? { ...item, ...formInputs, hours: parseInt(formInputs.hours) || 0 } : item
      ));
    }
    setActiveModal(null);
  };

  // रिकॉर्ड हटाने की क्रिया
  const executeDelete = () => {
    setDataList(dataList.filter(item => item.id !== selectedRow.id));
    setActiveModal(null);
  };

  return (
    <div className="ts-container">
      {/* शीर्ष हेडर अनुभाग */}
      <header className="ts-header">
        <h1 className="ts-title">Timesheets</h1>
        <div className="ts-breadcrumb">
          <span>🏠 Attendance &gt; </span>
          <span className="ts-breadcrumb-active">Timesheets</span>
        </div>
      </header>

      {/* मुख्य कार्ड बॉक्स */}
      <div className="ts-card">
        <div className="ts-action-bar">
          <div className="ts-search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search"
              className="ts-search-input"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div className="ts-action-btns">
            {/* शो/हाइड कॉलम बटन */}
            <button className="ts-icon-btn ts-btn-col" onClick={() => setColMenuOpen(!colMenuOpen)} title="Show/Hide Columns">
              🎛️
            </button>
            {/* नया रिकॉर्ड जोड़ें */}
            <button className="ts-icon-btn ts-btn-add" onClick={openAddModal} title="Add New Timesheet">
              ➕
            </button>
            {/* रिफ्रेश बटन */}
            <button className="ts-icon-btn ts-btn-ref" onClick={triggerRefresh} title="Refresh Table">
              🔄
            </button>
            {/* डाउनलोड बटन */}
            <button className="ts-icon-btn ts-btn-dl" onClick={triggerDownload} title="Download Report">
              📥
            </button>

            {/* शो/हाइड कॉलम पॉपओवर (image_0b1b99.png) */}
            {colMenuOpen && (
              <div className="ts-col-dropdown">
                <div className="ts-drop-header">Show/Hide Column</div>
                {Object.keys(visibleColumns).map((key) => (
                  <div key={key} className="ts-drop-item" onClick={() => toggleColumn(key)}>
                    <input type="checkbox" checked={visibleColumns[key]} readOnly />
                    <label style={{ textTransform: 'capitalize', cursor: 'pointer', marginLeft: '8px' }}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* सारणी */}
        <div className="ts-table-wrapper">
          <table className="ts-table">
            <thead>
              <tr>
                {visibleColumns.checkbox && <th><input type="checkbox" /></th>}
                {visibleColumns.employeeName && <th>Employee Name</th>}
                {visibleColumns.date && <th>Date</th>}
                {visibleColumns.project && <th>Project</th>}
                {visibleColumns.task && <th>Task</th>}
                {visibleColumns.hours && <th>Hours</th>}
                {visibleColumns.status && <th>Status</th>}
                {visibleColumns.actions && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {pageItems.map((row) => (
                <tr key={row.id}>
                  {visibleColumns.checkbox && <td><input type="checkbox" /></td>}
                  {visibleColumns.employeeName && <td>{row.name}</td>}
                  {visibleColumns.date && <td>{row.date}</td>}
                  {visibleColumns.project && <td>{row.project}</td>}
                  {visibleColumns.task && <td>{row.task}</td>}
                  {visibleColumns.hours && <td>{row.hours}</td>}
                  {visibleColumns.status && (
                    <td>
                      <span className={`ts-badge ${row.status.toLowerCase()}`}>
                        {row.status}
                      </span>
                    </td>
                  )}
                  {visibleColumns.actions && (
                    <td>
                      <div className="ts-row-actions">
                        <button className="ts-edit-icon" onClick={() => openEditModal(row)} title="Edit">📝</button>
                        <button className="ts-del-icon" onClick={() => openDeleteModal(row)} title="Remove">🗑️</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* डायनेमिक पेजिनेशन सिस्टम */}
        <div className="ts-pagination">
          <div>
            <span>Items per page: </span>
            <select
              className="ts-page-select"
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          <div>
            {startIdx + 1} – {Math.min(endIdx, totalItemsCount)} of {totalItemsCount}
          </div>
          <div className="ts-nav-arrows">
            <button className="ts-arrow" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
              &lt;
            </button>
            <button className="ts-arrow" onClick={() => setCurrentPage(p => Math.min(p + 1, maxPages))} disabled={currentPage === maxPages}>
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* सभी मोडल्स (पॉपअप विंडोज़) */}
      {activeModal && (
        <div className="ts-overlay">
          {/* एड और एडिट बॉक्स फ़ॉर्म मोडल (image_0b1f1d.png) */}
          {(activeModal === 'add' || activeModal === 'edit') && (
            <div className="ts-modal-form">
              <div className="ts-modal-head">
                <div className="ts-modal-head-left">
                  <span style={{ fontSize: '18px' }}>📁</span>
                  <span className="ts-modal-title">
                    {activeModal === 'add' ? 'New Timesheet' : 'Edit Timesheet'}
                  </span>
                </div>
                <button className="ts-modal-close" onClick={() => setActiveModal(null)}>×</button>
              </div>
              <div className="ts-modal-body">
                <div className="ts-form-grid">
                  <div className="ts-input-group ts-input-full">
                    <div className="ts-field">
                      <label>Employee Name*</label>
                      <input type="text" value={formInputs.name} onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })} placeholder="Employee Name" />
                    </div>
                    <span className="ts-icon">👤</span>
                  </div>
                  
                  {/* तारीख अनुभाग के लिए स्मूथ नेटिव कैलेंडर */}
                  <div className="ts-input-group">
                    <div className="ts-field">
                      <label>Date*</label>
                      <input type="date" value={formInputs.date} onChange={(e) => setFormInputs({ ...formInputs, date: e.target.value })} />
                    </div>
                  </div>

                  <div className="ts-input-group">
                    <div className="ts-field">
                      <label>Project Name*</label>
                      <input type="text" value={formInputs.project} onChange={(e) => setFormInputs({ ...formInputs, project: e.target.value })} placeholder="Project Name" />
                    </div>
                    <span className="ts-icon">🏢</span>
                  </div>

                  <div className="ts-input-group">
                    <div className="ts-field">
                      <label>Task*</label>
                      <input type="text" value={formInputs.task} onChange={(e) => setFormInputs({ ...formInputs, task: e.target.value })} placeholder="Task" />
                    </div>
                    <span className="ts-icon">📋</span>
                  </div>

                  <div className="ts-input-group">
                    <div className="ts-field">
                      <label>Hours*</label>
                      <input type="number" value={formInputs.hours} onChange={(e) => setFormInputs({ ...formInputs, hours: e.target.value })} min="0" />
                    </div>
                    <span className="ts-icon">🕒</span>
                  </div>

                  {/* स्टेटस ड्रॉपडाउन विकल्प (Approved, Pending, Rejected) */}
                  <div className="ts-input-group ts-input-full">
                    <div className="ts-field">
                      <label>Status*</label>
                      <select value={formInputs.status} onChange={(e) => setFormInputs({ ...formInputs, status: e.target.value })}>
                        <option value="Approved">Approved</option>
                        <option value="Pending">Pending</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  {/* डिस्क्रिप्शन टेक्स्टएरिया बॉक्स */}
                  <div className="ts-input-group ts-input-full">
                    <div className="ts-field">
                      <label>Description</label>
                      <textarea value={formInputs.description} onChange={(e) => setFormInputs({ ...formInputs, description: e.target.value })} placeholder="Description" rows={2} />
                    </div>
                  </div>
                </div>

                <div className="ts-modal-footer">
                  <button className={`ts-btn ts-btn-save ${formInputs.name && formInputs.project && formInputs.date && formInputs.task ? 'active' : ''}`} onClick={executeSave}>
                    Save
                  </button>
                  <button className="ts-btn ts-btn-cancel" onClick={() => setActiveModal(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* रिमूव / डिलीट कन्फर्मेशन मोडल (image_0b229e.png) */}
          {activeModal === 'delete' && (
            <div className="ts-modal-del">
              <h3 className="ts-del-title">Are you sure?</h3>
              <p className="ts-del-text"><strong>Employee Name:</strong> {selectedRow?.name}</p>
              <p className="ts-del-text"><strong>Project:</strong> {selectedRow?.project}</p>
              <p className="ts-del-text"><strong>Date:</strong> {selectedRow?.date}</p>
              <div className="ts-del-footer">
                <button className="ts-btn-del-ok" onClick={executeDelete}>Delete</button>
                <button className="ts-btn-del-no" onClick={() => setActiveModal(null)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Timesheets;