import React, { useState } from 'react';
import './AddEmployee.css';
import DrawerDetails from './DrawerDetails';
import './drawer-details.css';
import { useEffect } from 'react'; // تأكد أنك مستورد useEffect



function AddEmployee() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    email: '',
    phoneNumber: '',
    password: '',      // ✅ جديد
    status: '',
    salary: '',
    jobTitle: '',
    dateOfBirth: '',   // ✅ جديد
    department: '',
    photo: 'https://via.placeholder.com/30',
  });
  
  const [selectedDetailsEmployee, setSelectedDetailsEmployee] = useState(null);

  
  const [message, setMessage] = useState({ text: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All Departments');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterJobTitle, setFilterJobTitle] = useState('All Job Titles');
  const employeesPerPage = 8;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (
      !formData.fullName ||
      !formData.gender ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.status ||
      !formData.salary ||
      !formData.jobTitle ||
      !formData.department
    ) {
      setMessage({ text: 'All fields must be filled!', type: 'error' });
      return false;
    }
    if (!formData.phoneNumber.startsWith('07')) {
      setMessage({ text: 'Phone number must start with 07!', type: 'error' });
      return false;
    }
    if (employees.some((emp) => emp.email === formData.email)) {
      setMessage({ text: 'Email already exists!', type: 'error' });
      return false;
    }
    if (employees.some((emp) => emp.phoneNumber === formData.phoneNumber)) {
      setMessage({ text: 'Phone number already exists!', type: 'error' });
      return false;
    }
    return true;
  };

  const handleAddEmployee = async () => {
    if (!validateForm()) return;
  
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage({ text: 'You are not authenticated. Please log in again.', type: 'error' });
      return;
    }
  
    const payload = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      department: formData.department,
      position: formData.jobTitle.replace(/manager/gi, '').trim(), // ✅ حذف كلمة manager من المسمى الوظيفي
      gender: formData.gender.toLowerCase(),
      salary: Number(formData.salary),
      phoneNumber: formData.phoneNumber,
      dateOfBirth: formData.dateOfBirth, // ✅
      role: 'employee',

    };
  
    try {
      const response = await fetch('http://localhost:3000/hr-manager/add-employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const result = await response.json();
        setEmployees([...employees, formData]);
        resetForm();
        setIsAddModalOpen(false);
        setMessage({ text: 'Employee added successfully!', type: 'success' });
      } else {
        const errorData = await response.json();
        setMessage({ text: errorData.message || 'Failed to add employee', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Server error: ' + error.message, type: 'error' });
    }
  };
  

  const handleEditEmployee = (employee) => {
    setCurrentEmployee(employee);
    setFormData({
      ...employee,
      dateOfBirth: employee.dateOfBirth
        ? new Date(employee.dateOfBirth).toISOString().split('T')[0]
        : '',
    });
    
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem('token');
  
    const payload = {
      email: formData.email,
      name: formData.fullName,
      department: formData.department,
      position: formData.jobTitle.replace(/manager/gi, '').trim(), // ✅ حذف كلمة manager من المسمى الوظيفي
      salary: Number(formData.salary),
      phoneNumber: formData.phoneNumber,
      status: formData.status,
      dateOfBirth: formData.dateOfBirth,

    };
  
    try {
      const response = await fetch('http://localhost:3000/hr-manager/modify-employee', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
  
      if (response.ok) {
        const updatedEmployee = await response.json();
  
        setEmployees(employees.map((emp) =>
          emp.email === updatedEmployee.email
            ? {
                ...emp,
                fullName: updatedEmployee.name,
                department: updatedEmployee.department,
                jobTitle: updatedEmployee.position,
                salary: updatedEmployee.salary,
                phoneNumber: updatedEmployee.phoneNumber,
                status:
                  updatedEmployee.status === 0
                    ? 'Active'
                    : updatedEmployee.status === 1
                    ? 'On Leave'
                    : updatedEmployee.status === 2
                    ? 'Inactive'
                    : 'Unknown',
              }
            : emp
        ));
  
        setIsEditModalOpen(false);
        setMessage({ text: 'Employee updated successfully!', type: 'success' });
      } else {
        const errorData = await response.json();
        setMessage({ text: errorData.message || 'Update failed.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Server error: ' + error.message, type: 'error' });
    }
  };
  
  
  
  
  const handleDeleteEmployee = async () => {
    const token = localStorage.getItem('token');
  
    try {
      for (const email of selectedEmployees) {
        const response = await fetch('http://localhost:3000/hr-manager/delete-employee', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ email }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete employee');
        }
      }
  
      setEmployees(employees.filter((emp) => !selectedEmployees.includes(emp.email)));
      setSelectedEmployees([]);
      setIsDeleteModalOpen(false);
      setMessage({ text: 'Employee(s) deleted successfully!', type: 'success' });
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };
  
  const handleCheckboxChange = (email) => {
    setSelectedEmployees((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedEmployees(currentEmployees.map((emp) => emp.email));
    } else {
      setSelectedEmployees([]);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      gender: '',
      email: '',
      phoneNumber: '',
      status: '',
      jobTitle: '',
      department: '',
      dateOfBirth: '', // ✅

      photo: 'https://via.placeholder.com/30',
    });
  };

  const filteredEmployees = employees.filter((emp) => {

const matchesSearch = (emp.fullName || emp.name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = filterDepartment === 'All Departments' || emp.department === filterDepartment;
    const matchesStatus = filterStatus === 'All Status' || emp.status === filterStatus;
    const matchesJobTitle = filterJobTitle === 'All Job Titles' || emp.jobTitle === filterJobTitle;
    return matchesSearch && matchesDepartment && matchesStatus && matchesJobTitle;
  });

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/hr-manager/get-employees', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
  
          const formatted = data.map(emp => ({
            ...emp,
            fullName: emp.name || '', // ✅ لتحديث الاسم الظاهر في الجدول
            jobTitle: emp.position || '',
            status:
              emp.status === 0
                ? 'Active'
                : emp.status === 1
                ? 'On Leave'
                : emp.status === 2
                ? 'Inactive'
                : 'Unknown',
            photo: emp.photo || 'https://via.placeholder.com/30',
            dateOfBirth: emp.dateOfBirth ? new Date(emp.dateOfBirth) : null, // ✅ هذا السطر الجديد

          }));
  
          setEmployees(formatted);
        } else {
          console.error('Failed to fetch employees');
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
  
    fetchEmployees();
  }, []);
  
  
  return (
    <div className="add-employee">
      <div className="top-bar">
        <h2>Manage Employees</h2>
        <div>
        <button
  className="new-employee-btn"
  onClick={() => {
    resetForm(); // ⬅️ يمسح بيانات النموذج
    setIsAddModalOpen(true); // ⬅️ يفتح نافذة الإضافة
  }}
>
  + New Employee
</button>

          {selectedEmployees.length > 0 && (
            <button className="delete-btn" onClick={() => setIsDeleteModalOpen(true)}>
              Delete Employee
            </button>
          )}
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="search-filter-bar">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filters">
          <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
            <option value="All Departments">All Departments</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Operations">Operations</option>
            <option value="Finance">Finance</option>
            <option value="Sales">Sales</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select value={filterJobTitle} onChange={(e) => setFilterJobTitle(e.target.value)}>
            <option value="All Job Titles">All Job Titles</option>
            <option value="Finance Manager">Finance Manager</option>
            <option value="HR Manager">HR Manager</option>
            <option value="IT Help-desk">IT Help-desk</option>
            <option value="Account Manager">Account Manager</option>
            <option value="Admin Manager">Admin Manager</option>
            <option value="Account Executive">Account Executive</option>
          </select>
        </div>
      </div>

      <table className="employee-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" onChange={handleSelectAll} checked={selectedEmployees.length === currentEmployees.length && currentEmployees.length > 0} />
            </th>
            <th>Full Name</th>
            <th>Gender</th>
            <th>Email</th>
            <th>Status</th>
            <th>Job Title</th>
            <th>Department</th>
            <th>Action</th>
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


              <td>
  <img src={emp.photo} alt={emp.fullName || emp.name || ''} className="employee-photo" />
  {emp.fullName || emp.name || ''}
</td>


              <td>{emp.gender}</td>
              <td>{emp.email}</td>
              <td>
              <span className={`status ${(String(emp.status)).toLowerCase().replace(' ', '-')}`}>
              {emp.status}
                </span>
              </td>
                       <td>{emp.position?.toLowerCase() === 'manager' ? 'Manager' : emp.jobTitle}</td>


              <td>{emp.department}</td>
              <td>
                <span className="action-icon" onClick={() => handleEditEmployee(emp)}>✏️</span>
                <span className="action-icon" onClick={() => setSelectedDetailsEmployee(emp)}>ℹ️</span>
                </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        Showing {indexOfFirstEmployee + 1} to {Math.min(indexOfLastEmployee, filteredEmployees.length)} of {filteredEmployees.length} entries
      </div>

      {totalPages > 1 && (
  <div className="pagination">
    <button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      Previous
    </button>

    {[...Array(totalPages)].map((_, index) => (
      <button
        key={index}
        className={currentPage === index + 1 ? 'active-page' : ''}
        onClick={() => handlePageChange(index + 1)}
      >
        {index + 1}
      </button>
    ))}

    <button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
)}


{isAddModalOpen && (
  <div className="modal">
    <div className="modal-content">
      <div className="modal-header">
        <h3>Add New Employee</h3>
      </div>
      <hr />
      <div className="modal-body">
        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
        <select name="gender" value={formData.gender} onChange={handleInputChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} />

        <select name="status" value={formData.status} onChange={handleInputChange}>
          <option value="">Select Status</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Inactive">Inactive</option>
        </select>
        <input type="number" name="salary" placeholder="Salary" value={formData.salary || ''} onChange={handleInputChange} />

        <select name="jobTitle" value={formData.jobTitle} onChange={handleInputChange}>
  <option value="">Select Job Title</option>
  <option value="Finance">Finance</option>
  <option value="HR">HR</option>
  <option value="IT Help-desk">IT Help-desk</option>
  <option value="Account">Account</option>
  <option value="Admin">Admin</option>
  <option value="Account Executive">Account Executive</option>
</select>


        <select name="department" value={formData.department} onChange={handleInputChange}>
          <option value="">Select Department</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Operations">Operations</option>
          <option value="Finance">Finance</option>
          <option value="Sales">Sales</option>
        </select>
      </div>
      <hr />
      <div className="modal-footer">
        <button className="cancel-btn" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
        <button className="add-btn" onClick={handleAddEmployee}>Add</button>
      </div>
    </div>
  </div>
)}


{isEditModalOpen && (
  <div className="modal">
    <div className="modal-content">
      <div className="modal-header">
        <h3>Edit Employee</h3>
      </div>
      <hr />
      <div className="modal-body">
        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} />
        
        <input
          type="text"
          name="gender"
          value={formData.gender}
          readOnly
          disabled
          style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          readOnly
          disabled
          style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
        />
        <input
  type="date"
  name="dateOfBirth"
  placeholder="Date of Birth"
  value={formData.dateOfBirth}
  onChange={handleInputChange}
/>


        <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} />
        <select name="status" value={formData.status} onChange={handleInputChange}>
          <option value="">Select Status</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Inactive">Inactive</option>
        </select>
        <input type="number" name="salary" placeholder="Salary" value={formData.salary} onChange={handleInputChange} />
        <select name="jobTitle" value={formData.jobTitle} onChange={handleInputChange}>
  <option value="">Select Job Title</option>
  <option value="Finance">Finance</option>
  <option value="HR">HR</option>
  <option value="IT Help-desk">IT Help-desk</option>
  <option value="Account">Account</option>
  <option value="Admin">Admin</option>
  <option value="Account Executive">Account Executive</option>
</select>

        <select name="department" value={formData.department} onChange={handleInputChange}>
          <option value="">Select Department</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Operations">Operations</option>
          <option value="Finance">Finance</option>
          <option value="Sales">Sales</option>
        </select>
      </div>
      <hr />
      <div className="modal-footer">
        <button className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
        <button className="add-btn" onClick={handleSaveEdit}>Save</button>
      </div>
    </div>
  </div>
)}


      {isDeleteModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Delete this employee Data?</h3>
            </div>
            <hr />
            <div className="modal-body delete-modal-body">
              <span className="delete-icon">👤</span>
              <p>
                You are going to delete {selectedEmployees.length} Employees Data, all of their data will permanently deleted
              </p>
            </div>
            <hr />
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
              <button className="add-btn" onClick={handleDeleteEmployee}>Delete</button>
            </div>
          </div>
        </div>
      )}

{selectedDetailsEmployee && (
  <DrawerDetails
    employee={selectedDetailsEmployee}
    onClose={() => setSelectedDetailsEmployee(null)}
  />
)}



    </div>
  );
}

export default AddEmployee;