import React, { useState, useEffect } from 'react';
import './ManageDepartment.css';

function ManageDepartment() {
  const [showModal, setShowModal] = useState(false);
  const [newDepartment, setNewDepartment] = useState({ name: '', head: '' });
  const [message, setMessage] = useState('');
  const [employees, setEmployees] = useState([]);
  const [assignedManagers, setAssignedManagers] = useState([]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/hr-manager/get-employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEmployees(data);

      // استخراج المدراء فقط
      const managers = data.filter(emp => emp.position.toLowerCase() === 'manager');
      setAssignedManagers(managers);
    } catch (error) {
      console.error('❌ Failed to fetch employees:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAssignManager = async () => {
    if (!newDepartment.name || !newDepartment.head) {
      setMessage('❌ All fields are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const roleToAssign = newDepartment.name === 'HR' ? 'hr manager' : 'manager';

      const res = await fetch('http://localhost:3000/hr-manager/manage-department', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: newDepartment.head,
          department: newDepartment.name,
          role: roleToAssign, // ✅ Send role explicitly if supported by backend
        }),
      });

      if (res.ok) {
        setMessage('✅ Manager assigned successfully');
        setNewDepartment({ name: '', head: '' });
        setShowModal(false);
        fetchEmployees();
      } else {
        const err = await res.json();
        setMessage('❌ ' + (err.message || 'Failed to assign manager'));
      }
    } catch (error) {
      setMessage('❌ Server error');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  const handleUnassignManager = async (email) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/hr-manager/unassign-manager', { // ✅ Confirm this endpoint exists
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage('✅ Manager unassigned successfully');
        fetchEmployees();
      } else {
        const err = await res.json();
        setMessage('❌ ' + (err.message || 'Failed to unassign manager'));
      }
    } catch (error) {
      setMessage('❌ Server error');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="add-employee">
      <div className="top-bar">
        <h2>Manage Departments</h2>
        <button className="new-employee-btn" onClick={() => setShowModal(true)}>
          + Assign Manager
        </button>
      </div>

      {message && <div className={`message ${message.startsWith('✅') ? 'success' : 'error'}`}>{message}</div>}

      {/* جدول المدراء المعينين */}
      <table className="employee-table">
        <thead>
          <tr>
            <th>Department</th>
            <th>Manager Name</th>
            <th>Email</th>
            <th>Action</th> {/* ✅ New Action Column */}
          </tr>
        </thead>
        <tbody>
          {assignedManagers.map((manager) => (
            <tr key={manager.email}>
              <td>{manager.department}</td>
              <td>{manager.name}</td>
              <td>{manager.email}</td>
              <td>
                <button className="unassign-btn" onClick={() => handleUnassignManager(manager.email)}>
                  Unassign
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Assign Manager</h3>
            </div>
            <div className="modal-body">
              <select
                value={newDepartment.name}
                onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
              >
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
                <option value="Sales">Sales</option>
              </select>

              <select
                value={newDepartment.head}
                onChange={(e) => setNewDepartment({ ...newDepartment, head: e.target.value })}
              >
                <option value="">Select Employee (Email)</option>
                {employees.map((emp) => (
                  <option key={emp.email} value={emp.email}>
                    {emp.name} - {emp.email}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="add-btn" onClick={handleAssignManager}>
                Assign Manager
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDepartment;
