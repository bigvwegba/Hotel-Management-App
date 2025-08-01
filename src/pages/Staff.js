import React, {useState} from 'react';
import useStaffStore from '../store/useStaffStore';
import StaffModal from '../components/StaffModal';
import '../styles/staff.css';

export default function StaffManagement() {
  const {
    staff,
    currentStaff,
    filters,
    getDepartments,
    getPositions,
    getFilteredStaff,
    setCurrentStaff,
    updateFilters,
    addStaff,
    updateStaff,
    deleteStaff,
    changeStaffStatus
  } = useStaffStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (staffData) => {
    if (staffData.id) {
      updateStaff(staffData);
    } else {
      addStaff(staffData);
    }
    setIsModalOpen(false);
  };

  const handleStatusChange = (id, newStatus) => {
    changeStaffStatus(id, newStatus);
  };

  return (
    <div className="staff-page">
      <div className="staff-header">
        <h1 className="page-title">Staff Management</h1>
        <div className="staff-actions">
          <input
            type="text"
            placeholder="Search staff..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="search-input"
          />
          
          <select
            value={filters.department}
            onChange={(e) => updateFilters({ department: e.target.value })}
            className="filter-select"
          >
            <option value="all">All Departments</option>
            {getDepartments().map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          <select
            value={filters.status}
            onChange={(e) => updateFilters({ status: e.target.value })}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Terminated">Terminated</option>
          </select>

          <button
            className="btn-primary"
            onClick={() => {
              setCurrentStaff(null);
              setIsModalOpen(true);
            }}
          >
            Add Staff
          </button>
        </div>
      </div>

      <div className="staff-table-container">
        <table className="staff-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Status</th>
              <th>Hire Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredStaff().length === 0 ? (
              <tr>
                <td colSpan="6" className="no-results">
                  No staff members found
                </td>
              </tr>
            ) : (
              getFilteredStaff().map(staff => (
                <tr key={staff.id}>
                  <td>
                    <div className="staff-info">
                      <strong>{staff.name}</strong>
                      <span className="text-muted">{staff.email}</span>
                    </div>
                  </td>
                  <td>{staff.position}</td>
                  <td>{staff.department}</td>
                  <td>
                    <select
                      value={staff.status}
                      onChange={(e) => handleStatusChange(staff.id, e.target.value)}
                      className={`status-select ${staff.status.toLowerCase().replace(' ', '-')}`}
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  </td>
                  <td>{new Date(staff.hireDate).toLocaleDateString()}</td>
                  <td className="action-buttons">
                    <button
                      className="btn-icon"
                      onClick={() => {
                        setCurrentStaff(staff);
                        setIsModalOpen(true);
                      }}
                      aria-label="Edit staff"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon danger"
                      onClick={() => {
                        if (window.confirm(`Delete ${staff.name}?`)) {
                          deleteStaff(staff.id);
                        }
                      }}
                      aria-label="Delete staff"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <StaffModal
          staff={currentStaff}
          departments={getDepartments()}
          positions={currentStaff ? getPositions(currentStaff.department) : []}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}