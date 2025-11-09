import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import './Finance.css';

import { useEffect } from 'react';


function Finance() {
  const [showModal, setShowModal] = useState(false);

   const [employees, setEmployees] = useState([]);

useEffect(() => {
  const fetchEmployees = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/hr-manager/get-employees', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  fetchEmployees();
}, []);


  const [records, setRecords] = useState([

  ]);
  const [formData, setFormData] = useState({ employee: '', type: '', amount: '', date: '' });
  const [message, setMessage] = useState('');

  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('All Time');

  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === 'employee') {
    const selectedEmp = employees.find(emp => emp.name === value);
    setFormData({
      ...formData,
      employee: value,
      type: 'Salary', // النوع يصبح تلقائي Salary
      amount: selectedEmp ? selectedEmp.salary : ''
    });
  } else if (name === 'type') {
    setFormData({
      ...formData,
      type: value,
      amount: value === 'Salary' 
        ? (() => {
            const selectedEmp = employees.find(emp => emp.name === formData.employee);
            return selectedEmp ? selectedEmp.salary : '';
          })() 
        : 0 // إذا اختار Bonus أو Deduction يتم تعيين 0 تلقائيًا
    });
  } else {
    setFormData({ ...formData, [name]: value });
  }
};



  const handleAdd = async () => {
  if (!formData.employee || !formData.type || !formData.amount || !formData.date) {
    setMessage('❌ All fields are required');
    return;
  }

  const token = localStorage.getItem('token');
  try {
    const response = await fetch('http://localhost:3000/finance/add-record', { // تأكد من وجود هذا الـ Endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const result = await response.json();
      setRecords([...records, result]);
      setFormData({ employee: '', type: '', amount: '', date: '' });
      setShowModal(false);
      setMessage('✅ Record added successfully');
      setTimeout(() => setMessage(''), 3000);
    } else {
      const errorData = await response.json();
      setMessage(`❌ ${errorData.message || 'Failed to add record'}`);
    }
  } catch (error) {
    setMessage('❌ Server error: ' + error.message);
  }
};


  const filterByPeriod = (record) => {
    const today = new Date();
    const recordDate = new Date(record.date);

    if (filterPeriod === 'Last 7 Days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      return recordDate >= sevenDaysAgo;
    } else if (filterPeriod === 'Last 30 Days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      return recordDate >= thirtyDaysAgo;
    }
    return true;
  };

  const filteredRecords = records.filter((rec) =>
    rec.employee.toLowerCase().includes(filterEmployee.toLowerCase()) &&
    (filterType === '' || rec.type === filterType) &&
    (filterDate === '' || rec.date === filterDate) &&
    filterByPeriod(rec)
  );

  const totalSalaries = filteredRecords.filter(r => r.type === 'Salary').reduce((sum, r) => sum + Number(r.amount), 0);
  const totalBonuses = filteredRecords.filter(r => r.type === 'Bonus').reduce((sum, r) => sum + Number(r.amount), 0);
  const totalDeductions = filteredRecords.filter(r => r.type === 'Deduction').reduce((sum, r) => sum + Number(r.amount), 0);

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRecords);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Finance Records');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'Finance_Records.xlsx');
  };

  return (



    <div className="finance-page">
     <div className="top-bar">
  <h2>Finance</h2>
  <div className="top-actions">
    <button className="new-employee-btn" onClick={() => setShowModal(true)}>
      + New Record
    </button>
    <button className="export-btn" onClick={handleExport}>
      ⬇️ Export
    </button>
  </div>
</div>


      <div className="summary-cards">
        <div className="summary-card">
          <h4>Total Salaries</h4>
          <p>${totalSalaries}</p>
        </div>
        <div className="summary-card">
          <h4>Total Bonuses</h4>
          <p>${totalBonuses}</p>
        </div>
        <div className="summary-card">
          <h4>Total Deductions</h4>
          <p>${totalDeductions}</p>
        </div>
      </div>

      <div className="search-filter-bar">
        <input type="text" placeholder="Filter by employee..." value={filterEmployee} onChange={(e) => setFilterEmployee(e.target.value)} />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          <option value="Salary">Salary</option>
          <option value="Bonus">Bonus</option>
          <option value="Deduction">Deduction</option>
        </select>
        <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
        <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)}>
          <option value="All Time">All Time</option>
          <option value="Last 7 Days">Last 7 Days</option>
          <option value="Last 30 Days">Last 30 Days</option>
        </select>
      </div>

      {message && <div className={`message ${message.startsWith('✅') ? 'success' : 'error'}`}>{message}</div>}

      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((rec, index) => (
            <tr key={index}>
              <td>{rec.employee}</td>
              <td>{rec.type}</td>
              <td>${rec.amount}</td>
              <td>{rec.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Finance Record</h3>
            </div>
            <div className="modal-body">
              <select name="employee" value={formData.employee} onChange={handleChange}>
  <option value="">Select Employee</option>
  {employees.map((emp) => (
    <option key={emp.email} value={emp.name}>
      {emp.name}
    </option>
  ))}
</select>

              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="">Select Type</option>
                <option value="Salary">Salary</option>
                <option value="Bonus">Bonus</option>
                <option value="Deduction">Deduction</option>
              </select>
              <input name="amount" type="number" value={formData.amount} onChange={handleChange} placeholder="Amount" />
              <input name="date" type="date" value={formData.date} onChange={handleChange} />
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="add-btn" onClick={handleAdd}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Finance;
