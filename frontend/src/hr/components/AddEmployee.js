import React, { useState, useEffect } from "react";
import "./AddEmployee.css";
import DrawerDetails from "./DrawerDetails";
import "./drawer-details.css";
import api from "../../api";

function AddEmployee() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDetailsEmployee, setSelectedDetailsEmployee] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    email: "",
    phoneNumber: "",
    password: "",
    status: "",
    salary: "",
    jobTitle: "",
    dateOfBirth: "",
    department: "",
  });

  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All Departments");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterJobTitle, setFilterJobTitle] = useState("All Job Titles");

  const employeesPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  // ================= FETCH =================
  const fetchEmployees = async () => {
    try {
      const { data } = await api.get("/hr-manager/get-employees");
      const formatted = Array.isArray(data)
        ? data.map((emp) => ({
            ...emp,
            fullName: emp.name || "",
            jobTitle: emp.position || "",
            status:
              emp.status === 0
                ? "Active"
                : emp.status === 1
                ? "On Leave"
                : emp.status === 2
                ? "Inactive"
                : "Unknown",
            photo: emp.photo || "https://via.placeholder.com/30",
          }))
        : [];
      setEmployees(formatted);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setEmployees([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ================= VALIDATION =================
  const validateForm = () => {
    const required = [
      "fullName",
      "gender",
      "email",
      "phoneNumber",
      "status",
      "salary",
      "jobTitle",
      "department",
    ];
    for (let f of required) {
      if (!formData[f]) {
        setMessage({ text: "All fields are required!", type: "error" });
        return false;
      }
    }
    if (!formData.phoneNumber.startsWith("07")) {
      setMessage({ text: "Phone must start with 07!", type: "error" });
      return false;
    }
    return true;
  };

  // ================= ADD =================
  const handleAddEmployee = async () => {
    if (!validateForm()) return;
    try {
      await api.post("/hr-manager/add-employee", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        position: formData.jobTitle.replace(/manager/gi, "").trim(),
        gender: formData.gender.toLowerCase(),
        salary: Number(formData.salary),
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        role: "employee",
      });
      setMessage({ text: "Employee added successfully!", type: "success" });
      setIsAddModalOpen(false);
      fetchEmployees();
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to add employee", type: "error" });
    }
  };

  // ================= EDIT =================
  const handleEditEmployee = (emp) => {
    setCurrentEmployee(emp);
    setFormData({
      ...formData,
      fullName: emp.fullName,
      email: emp.email,
      gender: emp.gender,
      phoneNumber: emp.phoneNumber,
      salary: emp.salary,
      jobTitle: emp.jobTitle,
      department: emp.department,
      dateOfBirth: emp.dateOfBirth
        ? new Date(emp.dateOfBirth).toISOString().split("T")[0]
        : "",
      status: emp.status,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await api.put("/hr-manager/modify-employee", {
        email: formData.email,
        name: formData.fullName,
        department: formData.department,
        position: formData.jobTitle.replace(/manager/gi, "").trim(),
        salary: Number(formData.salary),
        phoneNumber: formData.phoneNumber,
        status: formData.status,
        dateOfBirth: formData.dateOfBirth,
      });
      setMessage({ text: "Employee updated successfully!", type: "success" });
      setIsEditModalOpen(false);
      fetchEmployees();
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to update employee", type: "error" });
    }
  };

  // ================= DELETE =================
  const handleDeleteEmployee = async () => {
    try {
      for (const email of selectedEmployees) {
        await api.delete("/hr-manager/delete-employee", { data: { email } });
      }
      setMessage({ text: "Employee(s) deleted!", type: "success" });
      setSelectedEmployees([]);
      setIsDeleteModalOpen(false);
      fetchEmployees();
    } catch (err) {
      console.error(err);
      setMessage({ text: "Delete failed!", type: "error" });
    }
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCheckboxChange = (email) =>
    setSelectedEmployees((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch = (emp.fullName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchDept =
      filterDepartment === "All Departments" ||
      emp.department === filterDepartment;
    const matchStatus =
      filterStatus === "All Status" || emp.status === filterStatus;
    const matchJob =
      filterJobTitle === "All Job Titles" || emp.jobTitle === filterJobTitle;
    return matchSearch && matchDept && matchStatus && matchJob;
  });

  const indexOfLast = currentPage * employeesPerPage;
  const indexOfFirst = indexOfLast - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  return (
    <div className="add-employee">
      <div className="top-bar">
        <h2>Manage Employees</h2>
        <div>
          <button
            className="new-employee-btn"
            onClick={() => setIsAddModalOpen(true)}
          >
            + New Employee
          </button>
          {selectedEmployees.length > 0 && (
            <button
              className="delete-btn"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete Employee
            </button>
          )}
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <div className="search-filter-bar">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="employee-table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Dept</th>
            <th>Job</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((emp) => (
            <tr key={emp.email}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedEmployees.includes(emp.email)}
                  onChange={() => handleCheckboxChange(emp.email)}
                />
              </td>
              <td>{emp.fullName}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>{emp.jobTitle}</td>
              <td>{emp.status}</td>
              <td>
                <span onClick={() => handleEditEmployee(emp)}>✏️</span>
                <span onClick={() => setSelectedDetailsEmployee(emp)}>ℹ️</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isDeleteModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Delete Employees?</h3>
            <p>This action cannot be undone.</p>
            <div>
              <button onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </button>
              <button onClick={handleDeleteEmployee}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddEmployee;
