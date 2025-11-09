import React, { useState, useEffect } from 'react';
import './Teame.css';
import Sidebar from './components/Sidebar/Sidebar' ;
import { Search, X, MessageSquare, User, Plus, Filter, Check, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

const initialTeamMembers = [
  {
    id: 1,
    name: 'John Doe',
    role: 'UI/UX Designer',
    department: 'Design',
    email: 'john.d@company.com',
    projects: 5,
    completionRate: 92,
    status: 'Active',
    experience: '3 years',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'Frontend Developer',
    department: 'Development',
    email: 'jane.s@company.com',
    projects: 8,
    completionRate: 88,
    status: 'Active',
    experience: '5 years',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: 3,
    name: 'Robert Johnson',
    role: 'Project Manager',
    department: 'Management',
    email: 'robert.j@company.com',
    projects: 12,
    completionRate: 95,
    status: 'Busy',
    experience: '7 years',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
  },
  {
    id: 4,
    name: 'Emily Davis',
    role: 'Marketing Specialist',
    department: 'Marketing',
    email: 'emily.d@company.com',
    projects: 6,
    completionRate: 90,
    status: 'Away',
    experience: '4 years',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
  },
];

function Teame() {
  const [members, setMembers] = useState(initialTeamMembers);
  const [filteredMembers, setFilteredMembers] = useState(initialTeamMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    department: 'Design',
    email: '',
    projects: 0,
    completionRate: 0,
    status: 'Active',
    experience: '',
    avatar: ''
  });
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  // Filter and sort employees
  useEffect(() => {
    let filtered = [...members];
    
    // Apply filters
    filtered = filtered.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          member.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter === 'All' || member.department === departmentFilter;
      const matchesStatus = statusFilter === 'All' || member.status === statusFilter;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredMembers(filtered);
  }, [members, searchTerm, departmentFilter, statusFilter, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Add new employee
  const handleAddMember = () => {
    if (!newMember.name || !newMember.role || !newMember.department || !newMember.email) {
      alert('Please fill in all required fields');
      return;
    }

    setIsAdding(true);
    
    // Generate random avatar if not provided
    const gender = Math.random() > 0.5 ? 'men' : 'women';
    const randomId = Math.floor(Math.random() * 100);
    
    setTimeout(() => {
      const newId = Math.max(...members.map(m => m.id)) + 1;
      const memberToAdd = {
        ...newMember,
        id: newId,
        projects: Number(newMember.projects),
        completionRate: Number(newMember.completionRate),
        avatar: newMember.avatar || `https://randomuser.me/api/portraits/${gender}/${randomId}.jpg`
      };
      
      setMembers([...members, memberToAdd]);
      setIsAdding(false);
      setAddSuccess(true);
      
      setTimeout(() => {
        setAddSuccess(false);
        setIsAddModalOpen(false);
        setNewMember({
          name: '',
          role: '',
          department: 'Design',
          email: '',
          projects: 0,
          completionRate: 0,
          status: 'Active',
          experience: '',
          avatar: ''
        });
      }, 1500);
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({ ...prev, [name]: value }));
  };

  // Departments for filter dropdown
  const departments = ['All', ...Array.from(new Set(members.map(member => member.department)))];

  return (
    <div className="team-app-container">
      <div className="team-main-content">
        {/* Header with Search and Buttons */}
        <div className="team-header">
          <div className="header-left">
            <h1>Team Management</h1>
            <p className="team-count">{filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}</p>
          </div>
          
          <div className="team-actions">
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="button-group">
              <button 
                className="filter-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                Filters
                {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              <button 
                className="add-member-btn"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus size={18} />
                Add Member
              </button>
            </div>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="filters-container">
            <div className="filter-section">
              <h3>Department</h3>
              <div className="filter-options">
                {departments.map(dept => (
                  <button
                    key={dept}
                    className={`filter-option ${departmentFilter === dept ? 'active' : ''}`}
                    onClick={() => setDepartmentFilter(dept)}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="filter-section">
              <h3>Status</h3>
              <div className="filter-options">
                {['All', 'Active', 'Away', 'Busy'].map(status => (
                  <button
                    key={status}
                    className={`filter-option ${statusFilter === status ? 'active' : ''}`}
                    onClick={() => setStatusFilter(status)}
                  >
                    <span className={`status-dot ${status.toLowerCase()}`}></span>
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team Members Table */}
        <div className="team-table-container">
          <table className="team-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('name')}>
                  Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('role')}>
                  Role {sortConfig.key === 'role' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('department')}>
                  Department {sortConfig.key === 'department' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('projects')}>
                  Projects {sortConfig.key === 'projects' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('completionRate')}>
                  Completion % {sortConfig.key === 'completionRate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('status')}>
                  Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(member => (
                <tr key={member.id}>
                  <td>
                    <div className="member-info">
                      <img src={member.avatar} alt={member.name} className="member-avatar" />
                      <div>
                        <div className="member-name">{member.name}</div>
                        <div className="member-email">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{member.role}</td>
                  <td>
                    <span className={`department-tag ${member.department.toLowerCase()}`}>
                      {member.department}
                    </span>
                  </td>
                  <td>{member.projects}</td>
                  <td>
                    <div className="completion-bar-container">
                      <div 
                        className="completion-bar" 
                        style={{ width: `${member.completionRate}%` }}
                      ></div>
                      <span>{member.completionRate}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="status-cell">
                      <span className={`status-dot ${member.status.toLowerCase()}`}></span>
                      {member.status}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="message-btn">
                        <MessageSquare size={16} />
                      </button>
                      <button className="profile-btn">
                        <User size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredMembers.length === 0 && (
            <div className="no-results">
              <p>No team members found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Add Employee Modal */}
        {isAddModalOpen && (
          <div className="modal-overlay">
            <div className={`add-member-modal ${addSuccess ? 'success' : ''}`}>
              <button 
                className="close-btn"
                onClick={() => !isAdding && setIsAddModalOpen(false)}
                disabled={isAdding}
              >
                <X size={20} />
              </button>
              
              {!addSuccess ? (
                <>
                  <h2>Add New Team Member</h2>
                  <form onSubmit={(e) => { e.preventDefault(); handleAddMember(); }}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={newMember.name}
                          onChange={handleInputChange}
                          required
                          disabled={isAdding}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Role *</label>
                        <input
                          type="text"
                          name="role"
                          value={newMember.role}
                          onChange={handleInputChange}
                          required
                          disabled={isAdding}
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Department *</label>
                        <select
                          name="department"
                          value={newMember.department}
                          onChange={handleInputChange}
                          required
                          disabled={isAdding}
                        >
                          <option value="Design">Design</option>
                          <option value="Development">Development</option>
                          <option value="Management">Management</option>
                          <option value="Marketing">Marketing</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={newMember.email}
                          onChange={handleInputChange}
                          required
                          disabled={isAdding}
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Status</label>
                        <select
                          name="status"
                          value={newMember.status}
                          onChange={handleInputChange}
                          disabled={isAdding}
                        >
                          <option value="Active">Active</option>
                          <option value="Away">Away</option>
                          <option value="Busy">Busy</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>Experience</label>
                        <input
                          type="text"
                          name="experience"
                          value={newMember.experience}
                          onChange={handleInputChange}
                          disabled={isAdding}
                          placeholder="e.g. 3 years"
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Current Projects</label>
                        <input
                          type="number"
                          name="projects"
                          value={newMember.projects}
                          onChange={handleInputChange}
                          disabled={isAdding}
                          min="0"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Completion Rate (%)</label>
                        <input
                          type="number"
                          name="completionRate"
                          value={newMember.completionRate}
                          onChange={handleInputChange}
                          disabled={isAdding}
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Avatar URL (optional)</label>
                      <input
                        type="text"
                        name="avatar"
                        value={newMember.avatar}
                        onChange={handleInputChange}
                        disabled={isAdding}
                        placeholder="Leave empty for random avatar"
                      />
                    </div>
                    
                    <div className="form-actions">
                      <button 
                        type="button"
                        className="cancel-btn"
                        onClick={() => setIsAddModalOpen(false)}
                        disabled={isAdding}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className={`submit-btn ${isAdding ? 'adding' : ''}`}
                        disabled={isAdding}
                      >
                        {isAdding ? (
                          <>
                            <Loader2 className="spin" size={18} />
                            <span>Adding...</span>
                          </>
                        ) : (
                          <>
                            <Plus size={18} />
                            <span>Add Member</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="success-message">
                  <div className="success-icon">
                    <Check size={48} />
                  </div>
                  <h3>Member Added Successfully!</h3>
                  <p>{newMember.name} has been added to your team</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Teame;