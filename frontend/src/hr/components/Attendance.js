import React, { useState } from 'react';
import './Attendance.css';

function Attendance() {
  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      name: 'John Doe',
      type: 'Full-time',
      paidTime: 6,
      totalTime: 8,
      overtime: 1,
    },
    {
      id: 2,
      name: 'Jane Smith',
      type: 'Part-time',
      paidTime: 4,
      totalTime: 8,
      overtime: 0,
    },
    {
      id: 3,
      name: 'Michael Johnson',
      type: 'Full-time',
      paidTime: 8,
      totalTime: 8,
      overtime: 2,
    },
    {
      id: 4,
      name: 'Emily Davis',
      type: 'Part-time',
      paidTime: 3,
      totalTime: 8,
      overtime: 0,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmRecordId, setConfirmRecordId] = useState(null);

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [showToast, setShowToast] = useState(false);

  const showToastNotification = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const openConfirmModal = (action, id) => {
    setConfirmAction(action);
    setConfirmRecordId(id);
    setConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setConfirmModal(false);
    setConfirmAction(null);
    setConfirmRecordId(null);
  };

  const handleApprove = (id) => {
    showToastNotification(`Approved attendance for ID: ${id}`, 'success');
  };

  const handleReject = (employee) => {
    setSelectedEmployee(employee);
    setShowRejectModal(true);
  };

  const handleConfirmAction = () => {
    if (confirmAction === 'approve') {
      handleApprove(confirmRecordId);
    } else if (confirmAction === 'reject') {
      const employee = attendanceData.find((e) => e.id === confirmRecordId);
      handleReject(employee);
    }
    closeConfirmModal();
  };

  const sendRejectionReason = () => {
    showToastNotification(`Rejected ${selectedEmployee.name}`, 'error');
    setRejectionReason('');
    setSelectedEmployee(null);
    setShowRejectModal(false);
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedRecord(null);
  };

  const filteredRecords = attendanceData.filter((record) => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || record.type === filterType;
    return matchesSearch && matchesType;
  });

  const total = attendanceData.length;
  const fullTime = attendanceData.filter(r => r.type === 'Full-time').length;
  const partTime = attendanceData.filter(r => r.type === 'Part-time').length;

  return (
    <div className="attendance">
      <div className="top-bar">
        <h2>Attendance</h2>
      </div>

      {/* Cards Summary */}
      <div className="summary-cards">
        <div className="summary-card total">
          <h3>Total Employees</h3>
          <p>{total}</p>
        </div>
        <div className="summary-card approved">
          <h3>Full-time</h3>
          <p>{fullTime}</p>
        </div>
        <div className="summary-card pending">
          <h3>Part-time</h3>
          <p>{partTime}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="All">All</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
        </select>
      </div>

      {/* Table */}
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Paid Time</th>
            <th>Overtime</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.name}</td>
              <td>{record.type}</td>
              <td>
                <div className="attendance-bar-container">
                  <div
                    className="attendance-bar"
                    style={{
                      width: `${(record.paidTime / record.totalTime) * 100}%`,
                    }}
                  ></div>
                  <span className="attendance-text">
                    {record.paidTime}/{record.totalTime}h
                  </span>
                </div>
              </td>
              <td>{record.overtime}h</td>
              <td>
                <div className="action-buttons">
                  <button className="view-btn" onClick={() => handleViewDetails(record)}>View</button>
                  <button className="approve-btn" onClick={() => openConfirmModal('approve', record.id)}>Approve</button>
                  <button className="reject-btn" onClick={() => openConfirmModal('reject', record.id)}>Reject</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Details Modal */}
      {showDetailsModal && selectedRecord && (
        <div className="reject-modal-overlay">
          <div className="reject-modal details-modal">
            <h2>Attendance Details</h2>
            <div className="detail-item">
              <span className="label">Name:</span>
              <span className="value">{selectedRecord.name}</span>
            </div>
            <div className="detail-item">
              <span className="label">Type:</span>
              <span className="value">{selectedRecord.type}</span>
            </div>
            <div className="detail-item">
              <span className="label">Paid Time:</span>
              <span className="value">{selectedRecord.paidTime}/{selectedRecord.totalTime}h</span>
            </div>
            <div className="detail-item">
              <span className="label">Overtime:</span>
              <span className="value">{selectedRecord.overtime}h</span>
            </div>
            <div className="modal-actions">
              <button onClick={closeDetailsModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedEmployee && (
        <div className="reject-modal-overlay">
          <div className="reject-modal">
            <h3>Rejection Reason</h3>
            <div className="textarea-wrapper">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason here..."
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowRejectModal(false)}>Cancel</button>
              <button onClick={sendRejectionReason}>Send</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="reject-modal-overlay">
          <div className="reject-modal">
            <h3>Are you sure?</h3>
            <p>Do you really want to {confirmAction === 'approve' ? 'approve' : 'reject'} this attendance record?</p>
            <div className="modal-actions">
              <button onClick={closeConfirmModal}>Cancel</button>
              <button onClick={handleConfirmAction}>
                Yes, {confirmAction === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className={`toast ${toastType}`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default Attendance;
