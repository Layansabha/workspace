import React, { useState, useEffect } from "react";
import api from "../../api";
import "./ManageDepartment.css";

function ManageDepartment() {
  const [showModal, setShowModal] = useState(false);
  const [newDept, setNewDept] = useState({ name: "", head: "" });
  const [employees, setEmployees] = useState([]);
  const [assignedManagers, setAssignedManagers] = useState([]);
  const [message, setMessage] = useState("");

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get("/hr-manager/get-employees");
      setEmployees(Array.isArray(data) ? data : []);
      const managers = data.filter(
        (emp) => emp.position?.toLowerCase() === "manager"
      );
      setAssignedManagers(managers);
    } catch {
      setEmployees([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAssign = async () => {
    if (!newDept.name || !newDept.head)
      return setMessage("All fields required");

    try {
      const role = newDept.name === "HR" ? "hr manager" : "manager";
      await api.post("/hr-manager/manage-department", {
        email: newDept.head,
        department: newDept.name,
        role,
      });
      setMessage("✅ Manager assigned!");
      setShowModal(false);
      fetchEmployees();
    } catch {
      setMessage("❌ Failed to assign");
    }
  };

  const handleUnassign = async (email) => {
    try {
      await api.post("/hr-manager/unassign-manager", { email });
      setMessage("✅ Unassigned successfully");
      fetchEmployees();
    } catch {
      setMessage("❌ Failed to unassign");
    }
  };

  return (
    <div className="add-employee">
      <div className="top-bar">
        <h2>Manage Departments</h2>
        <button onClick={() => setShowModal(true)}>+ Assign Manager</button>
      </div>
      {message && <div className="message">{message}</div>}
      <table className="employee-table">
        <thead>
          <tr>
            <th>Department</th>
            <th>Manager</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {assignedManagers.map((m) => (
            <tr key={m.email}>
              <td>{m.department}</td>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>
                <button onClick={() => handleUnassign(m.email)}>
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
            <h3>Assign Manager</h3>
            <select
              value={newDept.name}
              onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
            >
              <option value="">Select Department</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Operations">Operations</option>
              <option value="Finance">Finance</option>
              <option value="Sales">Sales</option>
            </select>

            <select
              value={newDept.head}
              onChange={(e) => setNewDept({ ...newDept, head: e.target.value })}
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.email} value={emp.email}>
                  {emp.name} - {emp.email}
                </option>
              ))}
            </select>

            <div className="modal-footer">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={handleAssign}>Assign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDepartment;
