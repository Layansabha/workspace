import React from 'react';
import './drawer-details.css';

function DrawerDetails({ employee, onClose }) {
  if (!employee) return null;

  return (
    <div className="employee-details-modal-overlay">
     <div className="employee-details-modal">
<div className="drawer-header">
          <button className="back-button" onClick={onClose}>← Back</button>
          <h2>Details</h2>
        </div>
        <div className="drawer-content">
          <div className="drawer-profile">
            <img src={employee.photo} alt={employee.fullName} className="profile-img" />
            <h3>{employee.fullName}</h3>
            <p>{employee.jobTitle}</p>

<span className={`status-dot ${(String(employee.status)).toLowerCase().replace(' ', '-')}`}>●</span>

            <span className="status-label">{employee.status}</span>
            <div className="contact-info">
              <p><strong>📧</strong> {employee.email}</p>
              <p><strong>📞</strong> {employee.phoneNumber}</p>
            </div>
            <div className="employee-info">
              <h4>Department</h4>
              <p>{employee.department}</p>
              <p>{employee.jobTitle}</p>
              <p>Payroll</p>
            </div>
          </div>
          <div className="drawer-tabs">
            <div className="tab-header">
              <span className="active-tab">General</span>
              <span>Job</span>
              <span>Payroll</span>
              <span>Performance</span>
              <span>Documents</span>
              <span>Dependents</span>
              <span>Account Setting</span>
            </div>
            <div className="tab-content">
              <div className="section-box">
                <div className="section-header">
                  <h4>📍 Personal Information</h4>
                  <button>Edit</button>
                </div>
                <div className="section-body">
                  <p><strong>Full Name:</strong> {employee.fullName}</p>
                  <p><strong>Date of Birth:</strong> {employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString('en-GB') : '-'}</p>
                  <p><strong>Gender:</strong> {employee.gender}</p>
                  <p><strong>Nationality:</strong> Jordanian</p>
                  <p><strong>Email Address:</strong> {employee.email}</p>
                  <p><strong>Phone Number:</strong> {employee.phoneNumber}</p>
                  <p><strong>National ID Number:</strong> - </p>
                  <p><strong>Social Insurance:</strong> - </p>
                  <p><strong>Personal Tax ID:</strong> - </p>
                </div>
              </div>
              <div className="section-box">
                <div className="section-header">
                  <h4>📦 Address</h4>
                  <button>Edit</button>
                </div>
                <div className="section-body">
                  <p><strong>Primary Address:</strong> 437-1094, Amman, Jordan</p>
                  <p><strong>Country:</strong> Jordan</p>
                  <p><strong>City:</strong> Amman</p>
                  <p><strong>State/Province:</strong> Amman</p>
                  <p><strong>Postal Code:</strong> 11937</p>
                </div>
              </div>
              <div className="section-box">
                <div className="section-header">
                  <h4>📞 Emergency Contact</h4>
                  <button>Edit</button>
                </div>
                <div className="section-body">
                  <p><strong>Full Name:</strong> Ali Hasan</p>
                  <p><strong>Relationship:</strong> Brother</p>
                  <p><strong>Phone Number:</strong> 0799999999</p>
                </div>
              </div>
              <div className="section-box">
                <div className="section-header">
                  <h4>🏦 Bank Information</h4>
                  <button>Edit</button>
                </div>
                <div className="section-body">
                  <p><strong>Bank Name:</strong> Cairo Amman Bank</p>
                  <p><strong>Account Name:</strong> {employee.fullName}</p>
                  <p><strong>Branch:</strong> Amman</p>
                  <p><strong>IBAN:</strong> -</p>
                  <p><strong>SWIFT/BIC:</strong> -</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DrawerDetails;