import React, { useState } from 'react';
import './TimeOff.css';



const TimeOff = () => {
  const [timeOffRequests, setTimeOffRequests] = useState([
    { id: 1, employee: 'John Doe', type: 'Annual Leave', from: '2025-05-01', to: '2025-05-10', status: 'Pending', attachment: null },
    { id: 2, employee: 'Jane Smith', type: 'Sick Leave', from: '2025-05-03', to: '2025-05-05', status: 'Pending', attachment: 'https://example.com/sick-leave.pdf' },
    { id: 3, employee: 'Michael Johnson', type: 'Emergency', from: '2025-05-07', to: '2025-05-08', status: 'Pending', attachment: null },
    { id: 4, employee: 'Chris Evans', type: 'Annual Leave', from: '2025-05-12', to: '2025-05-20', status: 'Approved', attachment: null },
    { id: 5, employee: 'Scarlett Johansson', type: 'Sick Leave', from: '2025-05-14', to: '2025-05-16', status: 'Rejected', attachment: 'https://example.com/sick-note.pdf' },
    { id: 6, employee: 'Robert Downey', type: 'Emergency', from: '2025-05-17', to: '2025-05-18', status: 'Pending', attachment: null },
    { id: 7, employee: 'Chris Hemsworth', type: 'Annual Leave', from: '2025-05-19', to: '2025-05-23', status: 'Pending', attachment: null },
    { id: 8, employee: 'Mark Ruffalo', type: 'Sick Leave', from: '2025-05-20', to: '2025-05-22', status: 'Approved', attachment: 'https://example.com/sick-mark.pdf' },
  ]);
  

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // كم عنصر بكل صفحة

  // حساب الإحصائيات
  const total = timeOffRequests.length;
  const approved = timeOffRequests.filter(req => req.status === 'Approved').length;
  const rejected = timeOffRequests.filter(req => req.status === 'Rejected').length;
  const pending = timeOffRequests.filter(req => req.status === 'Pending').length;

  const [toastMessage, setToastMessage] = useState('');
const [toastType, setToastType] = useState(''); // success أو error
const [showToast, setShowToast] = useState(false);
const showToastMessage = (message, type) => {
  setToastMessage(message);
  setToastType(type);
  setShowToast(true);
  setTimeout(() => {
    setShowToast(false);
  }, 3000); // 3 ثواني ويختفي
};
  // الموافقة على الطلب
  const handleApprove = (id) => {
    setTimeOffRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: 'Approved' } : req
      )
    );
    showToastMessage('Request Approved Successfully ✅', 'success');
  };

  // فتح مودال الرفض
  const handleOpenRejectModal = (id) => {
    setSelectedRequestId(id);
    setShowRejectModal(true);
  };

  // إغلاق مودال الرفض
  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setRejectReason('');
    setSelectedRequestId(null);
  };

  // تأكيد الرفض مع سبب
  const handleConfirmReject = () => {
    setTimeOffRequests(prev =>
      prev.map(req =>
        req.id === selectedRequestId ? { ...req, status: 'Rejected', rejectReason: rejectReason } : req
      )
    );
    showToastMessage('Request Rejected Successfully ❌', 'error');
    handleCloseRejectModal();
  };
  
  // فلترة حسب الاسم والحالة
  const filteredRequests = timeOffRequests.filter((req) => {
    const matchesSearch = req.employee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // حساب الصفحات
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const [selectedRequest, setSelectedRequest] = useState(null);
const [showDetailsModal, setShowDetailsModal] = useState(false);

const handleRowClick = (request) => {
  setSelectedRequest(request);
  setShowDetailsModal(true);
};

const handleCloseDetailsModal = () => {
  setShowDetailsModal(false);
  setSelectedRequest(null);
};

const calculateDuration = (from, to) => {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const durationInMs = toDate - fromDate;
  const days = durationInMs / (1000 * 60 * 60 * 24) + 1; // زائد واحد عشان يحسب أول يوم
  return days;
};
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const [confirmModal, setConfirmModal] = useState(false);
const [confirmAction, setConfirmAction] = useState(null); // approve أو reject
const [confirmRequestId, setConfirmRequestId] = useState(null);

const openConfirmModal = (action, id) => {
  setConfirmAction(action); // 'approve' أو 'reject'
  setConfirmRequestId(id);
  setConfirmModal(true);
};

const closeConfirmModal = () => {
  setConfirmModal(false);
  setConfirmAction(null);
  setConfirmRequestId(null);
};

const handleConfirmAction = () => {
  if (confirmAction === 'approve') {
    handleApprove(confirmRequestId);
  } else if (confirmAction === 'reject') {
    handleOpenRejectModal(confirmRequestId);
  }
  closeConfirmModal();
};




  return (
    <div className="timeoff">
      <div className="top-bar">
        <h2>Time-Off Requests</h2>
      </div>

      {/* كروت الإحصائيات */}
      <div className="summary-cards">
        <div className="summary-card total">
          <h3>Total Requests</h3>
          <p>{total}</p>
        </div>
        <div className="summary-card approved">
          <h3>Approved</h3>
          <p>{approved}</p>
        </div>
        <div className="summary-card pending">
          <h3>Pending</h3>
          <p>{pending}</p>
        </div>
        <div className="summary-card rejected">
          <h3>Rejected</h3>
          <p>{rejected}</p>
        </div>
      </div>

      {/* البحث والفلترة */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by employee name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* جدول الطلبات */}
      <table className="timeoff-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((request) => (
<tr key={request.id}>
<td>{request.employee}</td>
                <td>{request.type}</td>
                <td>{request.from}</td>
                <td>{request.to}</td>
                <td>
  <span className={`status ${request.status.toLowerCase()}`}>
    {request.status}
  </span>
</td>

<td>
  <div className="action-buttons">
    <button className="view-btn" onClick={() => handleRowClick(request)}>View</button>
    {request.status === 'Pending' && (
      <>
        <button className="approve-btn" onClick={() => openConfirmModal('approve', request.id)}>Approve</button>
<button className="reject-btn" onClick={() => openConfirmModal('reject', request.id)}>Reject</button>

      </>
    )}
    {(request.status === 'Rejected' && request.rejectReason) && (
      <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
        Reason: {request.rejectReason}
      </div>
    )}
  </div>
</td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', color: '#888' }}>No requests found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? 'active' : ''}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* مودال سبب الرفض */}
      {showRejectModal && (
        <div className="reject-modal-overlay">
          <div className="reject-modal">
            <h3>Reject Reason</h3>
            <div className="textarea-wrapper">
    <textarea
      value={rejectReason}
      onChange={(e) => setRejectReason(e.target.value)}
      placeholder="Enter reason for rejection"
    />
  </div>
            <div className="modal-actions">
              <button onClick={handleCloseRejectModal}>Cancel</button>
              <button onClick={handleConfirmReject}>Send</button>
            </div>
          </div>
        </div>
      )}

{showToast && (
  <div className={`toast ${toastType}`}>
    {toastMessage}
  </div>
)}

{showDetailsModal && selectedRequest && (
  <div className="reject-modal-overlay">
    <div className="reject-modal details-modal">
      <h2>Request Details</h2>
      <div className="detail-item">
        <span className="label"> Employee:</span>
        <span className="value">{selectedRequest.employee}</span>
      </div>
      <div className="detail-item">
        <span className="label"> Type:</span>
        <span className="value">{selectedRequest.type}</span>
      </div>
      <div className="detail-item">
        <span className="label"> From:</span>
        <span className="value">{formatDate(selectedRequest.from)}</span>
      </div>
      <div className="detail-item">
        <span className="label"> To:</span>
        <span className="value">{formatDate(selectedRequest.to)}</span>
      </div>
      <div className="detail-item">
        <span className="label"> Duration:</span>
        <span className="value">{calculateDuration(selectedRequest.from, selectedRequest.to)} days</span>
      </div>
      <div className="detail-item">
        <span className="label"> Status:</span>
        <span className={`value status ${selectedRequest.status.toLowerCase()}`}>{selectedRequest.status}</span>
      </div>
      {selectedRequest.attachment && (
        <div className="detail-item">
          <span className="label">📎 Attachment:</span>
          <a href={selectedRequest.attachment} target="_blank" rel="noopener noreferrer" className="attachment-link">
            View File
          </a>
        </div>
      )}
      <div className="modal-actions">
        <button onClick={handleCloseDetailsModal}>Close</button>
      </div>
    </div>
  </div>
)}


{confirmModal && (
  <div className="reject-modal-overlay">
    <div className="reject-modal">
      <h3>Are you sure?</h3>
      <p>Do you really want to {confirmAction === 'approve' ? 'approve' : 'reject'} this request?</p>
      <div className="modal-actions">
        <button onClick={closeConfirmModal}>Cancel</button>
        <button onClick={handleConfirmAction}>
          Yes, {confirmAction === 'approve' ? 'Approve' : 'Reject'}
        </button>
      </div>
    </div>
  </div>
)}






    </div>
  

  );


};

export default TimeOff;
