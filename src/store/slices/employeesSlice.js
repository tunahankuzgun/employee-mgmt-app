import {createSlice} from '@reduxjs/toolkit';

export const DEPARTMENTS = {
  ANALYTICS: 'analytics',
  TECH: 'tech',
};

export const POSITIONS = {
  JUNIOR: 'junior',
  MEDIOR: 'medior',
  SENIOR: 'senior',
};

const generateMockData = () => {
  const departments = [DEPARTMENTS.ANALYTICS, DEPARTMENTS.TECH];
  const positions = [POSITIONS.JUNIOR, POSITIONS.MEDIOR, POSITIONS.SENIOR];

  const baseEmployees = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '+90 (532) 123 45 67',
      department: DEPARTMENTS.TECH,
      position: POSITIONS.SENIOR,
      dateOfEmployment: '2023-01-15',
      dateOfBirth: '1990-05-12',
      salary: 75000,
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
      phone: '+90 (532) 234 56 78',
      department: DEPARTMENTS.ANALYTICS,
      position: POSITIONS.MEDIOR,
      dateOfEmployment: '2022-08-20',
      dateOfBirth: '1988-11-23',
      salary: 65000,
    },
    {
      id: 3,
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      email: 'ahmet.yilmaz@company.com',
      phone: '+90 (532) 345 67 89',
      department: DEPARTMENTS.ANALYTICS,
      position: POSITIONS.JUNIOR,
      dateOfEmployment: '2023-09-23',
      dateOfBirth: '1995-03-15',
      salary: 50000,
    },
    {
      id: 4,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+90 (532) 456 78 90',
      department: DEPARTMENTS.TECH,
      position: POSITIONS.JUNIOR,
      dateOfEmployment: '2022-11-05',
      dateOfBirth: '1992-07-08',
      salary: 55000,
    },
    {
      id: 5,
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@company.com',
      phone: '+90 (532) 567 89 01',
      department: DEPARTMENTS.TECH,
      position: POSITIONS.SENIOR,
      dateOfEmployment: '2023-06-01',
      dateOfBirth: '1987-12-19',
      salary: 70000,
    },
    {
      id: 6,
      firstName: 'Ayşe',
      lastName: 'Kaya',
      email: 'ayse.kaya@company.com',
      phone: '+90 (532) 678 90 12',
      department: DEPARTMENTS.ANALYTICS,
      position: POSITIONS.MEDIOR,
      dateOfEmployment: '2022-12-15',
      dateOfBirth: '1991-04-27',
      salary: 60000,
    },
  ];

  const lastNames = [
    'Anderson',
    'Taylor',
    'Martinez',
    'Garcia',
    'Rodriguez',
    'Wilson',
    'Moore',
    'Jackson',
    'Martin',
    'Lee',
    'Demir',
    'Çelik',
    'Şahin',
    'Öztürk',
    'Arslan',
    'Aydın',
    'Özdemir',
    'Koç',
    'Yurt',
    'Akın',
    'Davis',
    'Miller',
    'Clark',
    'Lewis',
    'Walker',
    'Hall',
    'Allen',
    'Young',
    'King',
    'Wright',
    'Kılıç',
    'Güneş',
    'Ay',
    'Aslan',
    'Şen',
    'Yıldız',
    'Tekin',
    'Polat',
    'Duman',
    'Çetin',
    'Harris',
    'White',
    'Thomas',
    'Robinson',
    'Thompson',
    'Lopez',
    'Hill',
    'Scott',
    'Green',
    'Adams',
  ];

  const additionalEmployees = Array.from({length: 50}, (_, i) => ({
    id: i + 7,
    firstName: 'Employee',
    lastName: lastNames[i % lastNames.length],
    email: `employee${i + 7}@company.com`,
    phone: `+90 (5${Math.floor((i + 32) / 10) % 10}${(i + 32) % 10}) ${String(
      Math.floor((100 + i * 13) % 900) + 100
    )} ${String(Math.floor((10 + i * 7) % 90) + 10)} ${String(
      Math.floor((10 + i * 11) % 90) + 10
    )}`,
    department: departments[i % departments.length],
    position: positions[i % positions.length],
    dateOfEmployment: '2023-09-23',
    dateOfBirth: '1995-03-15',
    salary: 45000 + i * 1000,
  }));

  return [...baseEmployees, ...additionalEmployees];
};

const initialState = {
  employees: generateMockData(),
  isLoading: false,
  error: null,
};

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
    addEmployee: (state, action) => {
      const newEmployee = {
        ...action.payload,
        id: Math.max(...state.employees.map((emp) => emp.id)) + 1,
      };
      state.employees.push(newEmployee);
    },
    updateEmployee: (state, action) => {
      const index = state.employees.findIndex(
        (emp) => emp.id === action.payload.id
      );
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    deleteEmployee: (state, action) => {
      state.employees = state.employees.filter(
        (emp) => emp.id !== action.payload
      );
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  setLoading,
  setError,
} = employeesSlice.actions;

export const selectEmployees = (state) => state.employees.employees;
export const selectEmployeeById = (id) => (state) =>
  state.employees.employees.find((emp) => emp.id === id);
export const selectIsLoading = (state) => state.employees.isLoading;
export const selectError = (state) => state.employees.error;
export const selectEmployeeCount = (state) => state.employees.employees.length;

export default employeesSlice.reducer;
