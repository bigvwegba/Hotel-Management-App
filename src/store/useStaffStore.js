import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import LZString from 'lz-string';

const STAFF_STORAGE_KEY = 'hotel-staff';
const DEPARTMENTS = [
  'Front Desk', 'Housekeeping', 'Kitchen', 
  'Maintenance', 'Management', 'Security'
];
const POSITIONS = {
  'Front Desk': ['Receptionist', 'Concierge', 'Front Desk Manager'],
  'Housekeeping': ['Housekeeper', 'Supervisor', 'Laundry Attendant'],
  'Kitchen': ['Chef', 'Sous Chef', 'Cook', 'Dishwasher'],
  'Maintenance': ['Technician', 'Engineer'],
  'Management': ['Manager', 'Assistant Manager'],
  'Security': ['Guard', 'Security Officer']
};

const loadStaff = () => {
  try {
    const data = localStorage.getItem(STAFF_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(LZString.decompress(data)) || [];
  } catch (error) {
    console.error('Failed to load staff:', error);
    return [];
  }
};

const saveStaff = (staff) => {
  try {
    localStorage.setItem(STAFF_STORAGE_KEY, LZString.compress(JSON.stringify(staff)));
  } catch (error) {
    console.error('Failed to save staff:', error);
  }
};

const useStaffStore = create((set, get) => ({
  staff: loadStaff(),
  currentStaff: null,
  filters: {
    department: 'all',
    status: 'all',
    search: ''
  },

  // Getters
  getDepartments: () => DEPARTMENTS,
  getPositions: (department) => POSITIONS[department] || [],
  getStaffById: (id) => get().staff.find(s => s.id === id),

  // Filtered staff
  getFilteredStaff: () => {
    const { staff, filters } = get();
    return staff.filter(member => {
      const matchesDepartment = filters.department === 'all' || 
                              member.department === filters.department;
      const matchesStatus = filters.status === 'all' || 
                          member.status === filters.status;
      const matchesSearch = filters.search === '' || 
                          member.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                          member.position.toLowerCase().includes(filters.search.toLowerCase());
      return matchesDepartment && matchesStatus && matchesSearch;
    });
  },

  // Actions
  setCurrentStaff: (staff) => set({ currentStaff: staff }),
  updateFilters: (newFilters) => set({ filters: { ...get().filters, ...newFilters } }),

  addStaff: (staffData) => {
    const newStaff = {
      ...staffData,
      id: uuidv4(),
      status: 'Active',
      hireDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    set(state => {
      const staff = [...state.staff, newStaff];
      saveStaff(staff);
      return { staff };
    });
  },

  updateStaff: (staffData) => {
    set(state => {
      const staff = state.staff.map(s => 
        s.id === staffData.id ? { 
          ...s, 
          ...staffData,
          lastUpdated: new Date().toISOString()
        } : s
      );
      saveStaff(staff);
      return { staff };
    });
  },

  deleteStaff: (id) => {
    set(state => {
      const staff = state.staff.filter(s => s.id !== id);
      saveStaff(staff);
      return { staff };
    });
  },

  changeStaffStatus: (id, status) => {
    set(state => {
      const staff = state.staff.map(s => 
        s.id === id ? { 
          ...s, 
          status,
          lastUpdated: new Date().toISOString()
        } : s
      );
      saveStaff(staff);
      return { staff };
    });
  },

  // Housekeeping integration
  getHousekeepingStaff: () => {
    return get().staff.filter(s => 
      s.department === 'Housekeeping' && 
      s.status === 'Active'
    );
  }
}));

export default useStaffStore;