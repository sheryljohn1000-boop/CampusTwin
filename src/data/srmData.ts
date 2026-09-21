import { CampusZone, ClassSchedulePeriod, DayOrder } from '../types/campus';

/**
 * SRM KTR standard period grid (B.Tech, 8:00 AM start batch):
 *   P1 08:00–08:50 · P2 08:50–09:40 · P3 09:45–10:35 · P4 10:40–11:30
 *   P5 11:35–12:25 · LUNCH 12:25–13:25 · P6+P7 13:25–15:05 (combined lab slot)
 *   P8 15:10–16:00 · Campus day ends 16:00
 * Day Orders rotate 1–5 across working days (Mon–Sat); Sun is a holiday.
 * After a holiday or exam day, the next working day resumes the next day order.
 */

const PERIOD_GRID = {
  p1: { startDecimal: 8.0, endDecimal: 8.83 },
  p2: { startDecimal: 8.83, endDecimal: 9.67 },
  p3: { startDecimal: 9.75, endDecimal: 10.58 },
  p4: { startDecimal: 10.67, endDecimal: 11.5 },
  p5: { startDecimal: 11.58, endDecimal: 12.42 },
  lunch: { startDecimal: 12.42, endDecimal: 13.42 },
  p67: { startDecimal: 13.42, endDecimal: 15.08 },
  p8: { startDecimal: 15.17, endDecimal: 16.0 },
} as const;

const SLOT_LABELS: Record<keyof typeof PERIOD_GRID, string> = {
  p1: '08:00 - 08:50',
  p2: '08:50 - 09:40',
  p3: '09:45 - 10:35',
  p4: '10:40 - 11:30',
  p5: '11:35 - 12:25',
  lunch: '12:25 - 01:25',
  p67: '01:25 - 03:05',
  p8: '03:10 - 04:00',
};

type SlotKey = keyof typeof PERIOD_GRID;
type SubjectInfo = {
  code: string;
  name: string;
  room: string;
  faculty: string;
  type: 'theory' | 'lab';
};

function period(slot: SlotKey, number: number | string, subject: SubjectInfo | null): ClassSchedulePeriod {
  const grid = PERIOD_GRID[slot];
  return {
    periodNumber: number,
    timeSlot: SLOT_LABELS[slot],
    startDecimal: grid.startDecimal,
    endDecimal: grid.endDecimal,
    subjectCode: subject?.code ?? 'BREAK',
    subjectName: subject?.name ?? 'Lunch Recess',
    room: subject?.room ?? '—',
    faculty: subject?.faculty ?? '—',
    type: subject?.type ?? 'break',
  };
}

const FREE: SubjectInfo = { code: 'FREE', name: 'Free / Self-Study', room: '—', faculty: '—', type: 'theory' };
const LUNCH_ROOM = 'Java Food Court / TP Canteen';

/**
 * B.Tech CSE (section hosted in Tech Park 2) — Day Order 1 to 5.
 * Classes are scheduled by DAY ORDER, not weekday: the university cycles
 * DO1 → DO2 → DO3 → DO4 → DO5 → DO1 across working days, skipping holidays.
 */
const CSE_SECTION_TIMETABLE: Record<DayOrder, ClassSchedulePeriod[]> = {
  1: [
    period('p1', 1, { code: '21MAB101T', name: 'Calculus & Linear Algebra', room: 'TP2-401 (4th Floor)', faculty: 'Dr. S. Ramesh', type: 'theory' }),
    period('p2', 2, { code: '21CSC101T', name: 'Principles of OOP', room: 'TP2-401 (4th Floor)', faculty: 'Prof. A. Kavitha', type: 'theory' }),
    period('p3', 3, { code: '21CSC102J', name: 'Data Structures & Algorithms', room: 'TP2-401 (4th Floor)', faculty: 'Dr. M. Saravanan', type: 'theory' }),
    period('p4', 4, FREE),
    period('p5', 5, { code: '21CSC103J', name: 'Computer Architecture', room: 'TP2-402 (4th Floor)', faculty: 'Dr. R. Balamurugan', type: 'theory' }),
    period('lunch', 'LUNCH', null),
    period('p67', '6 & 7', { code: '21CSC104P', name: 'DSA Lab', room: 'TP2 Lab 2 (4th Floor)', faculty: 'Lab Mentors', type: 'lab' }),
    period('p8', 8, FREE),
  ],
  2: [
    period('p1', 1, { code: '21CSC201J', name: 'Design & Analysis of Algorithms', room: 'TP2-502 (5th Floor)', faculty: 'Dr. K. Vani', type: 'theory' }),
    period('p2', 2, { code: '21CSC202J', name: 'Operating Systems', room: 'TP2-502 (5th Floor)', faculty: 'Prof. G. Suresh', type: 'theory' }),
    period('p3', 3, { code: '21CSC203J', name: 'Database Management Systems', room: 'TP2-502 (5th Floor)', faculty: 'Dr. R. Priya', type: 'theory' }),
    period('p4', 4, FREE),
    period('p5', 5, { code: '21MAB201T', name: 'Probability & Statistics', room: 'TP2-503 (5th Floor)', faculty: 'Dr. T. Lakshmi', type: 'theory' }),
    period('lunch', 'LUNCH', null),
    period('p67', '6 & 7', { code: '21CSC204P', name: 'DBMS Lab', room: 'TP2 Lab 3 (5th Floor)', faculty: 'Lab Mentors', type: 'lab' }),
    period('p8', 8, FREE),
  ],
  3: [
    period('p1', 1, { code: '21CSC301J', name: 'Computer Networks', room: 'TP2-601 (6th Floor)', faculty: 'Dr. A. Suresh', type: 'theory' }),
    period('p2', 2, { code: '21CSC302J', name: 'Deep Learning & Neural Networks', room: 'TP2-601 (6th Floor)', faculty: 'Dr. K. Senthil Nathan', type: 'theory' }),
    period('p3', 3, FREE),
    period('p4', 4, { code: '21CSC303J', name: 'Software Engineering', room: 'TP2-602 (6th Floor)', faculty: 'Dr. N. Deepa', type: 'theory' }),
    period('p5', 5, FREE),
    period('lunch', 'LUNCH', null),
    period('p67', '6 & 7', { code: '21CSC305P', name: 'Networks Lab', room: 'TP1 IoT Lab (Ground Floor)', faculty: 'Prof. T. Selvam', type: 'lab' }),
    period('p8', 8, FREE),
  ],
  4: [
    period('p1', 1, { code: '21CSC304J', name: 'Cloud Computing & Virtualization', room: 'TP2-604 (6th Floor)', faculty: 'Dr. P. Madhavan', type: 'theory' }),
    period('p2', 2, { code: '21CSC305J', name: 'Compiler Design', room: 'TP2-604 (6th Floor)', faculty: 'Prof. R. Anitha', type: 'theory' }),
    period('p3', 3, { code: '21CSE381T', name: 'Cryptography & Cyber Defense', room: 'TP2-605 (6th Floor)', faculty: 'Dr. V. Rajesh', type: 'theory' }),
    period('p4', 4, FREE),
    period('p5', 5, { code: '21CSS301T', name: 'Quantitative & Reasoning Skills', room: 'TP2-508 (5th Floor)', faculty: 'Career Development Centre', type: 'theory' }),
    period('lunch', 'LUNCH', null),
    period('p67', '6 & 7', FREE),
    period('p8', 8, { code: '21CSP302T', name: 'Capstone Project Review', room: 'TP2 Innovation Incubator (12th Floor)', faculty: 'Department Panel', type: 'lab' }),
  ],
  5: [
    period('p1', 1, { code: '21CSC302J', name: 'Deep Learning & Neural Networks', room: 'TP2-702 (7th Floor)', faculty: 'Dr. K. Senthil Nathan', type: 'theory' }),
    period('p2', 2, { code: '21CSC304J', name: 'Cloud Computing & Virtualization', room: 'TP2-702 (7th Floor)', faculty: 'Dr. P. Madhavan', type: 'theory' }),
    period('p3', 3, { code: '21CSC305J', name: 'Compiler Design', room: 'TP2-604 (6th Floor)', faculty: 'Prof. R. Anitha', type: 'theory' }),
    period('p4', 4, { code: '21CSE381T', name: 'Cryptography & Cyber Defense', room: 'TP2-604 (6th Floor)', faculty: 'Dr. V. Rajesh', type: 'theory' }),
    period('p5', 5, { code: '21CSS301T', name: 'Quantitative & Reasoning Skills', room: 'TP2-508 (5th Floor)', faculty: 'Career Development Centre', type: 'theory' }),
    period('lunch', 'LUNCH', null),
    period('p67', '6 & 7', { code: '21CSC308P', name: 'AI & Deep Learning Computing Lab', room: 'TP2 Lab 4 (8th Floor · GPU Cluster)', faculty: 'Dr. K. Senthil Nathan & Lab Mentors', type: 'lab' }),
    period('p8', 8, { code: '21CSP302T', name: 'Capstone Project Review & Mentorship', room: 'TP2 Innovation Incubator (12th Floor)', faculty: 'Department Panel', type: 'lab' }),
  ],
};

export { CSE_SECTION_TIMETABLE };

export const SRM_KTR_ZONES: CampusZone[] = [
  {
    id: 'srm-tp2',
    code: 'TP2',
    name: 'Tech Park 2',
    fullName: 'Tech Park Tower II · G+15 Computing Block',
    category: 'academic',
    capacity: 3800,
    location: { lat: 12.82438, lng: 80.04587 },
    // Derived live from the Day Order timetable in the store (classes 08:00–16:00,
    // lunch dip 12:25–13:25, heavy GPU-lab block on Day Order 5 afternoons).
    hourlyProfile: [
      0.02, 0.01, 0.01, 0.01, 0.02, 0.06, 0.2, 0.65,
      0.88, 0.94, 0.96, 0.92, 0.58, 0.84, 0.92, 0.86,
      0.62, 0.35, 0.22, 0.14, 0.08, 0.05, 0.03, 0.02,
    ],
    timetable: CSE_SECTION_TIMETABLE,
  },
  {
    id: 'srm-tp1',
    code: 'TP1',
    name: 'Tech Park 1',
    fullName: 'Tech Park Tower I · Turing Hall',
    category: 'academic',
    capacity: 3200,
    location: { lat: 12.82374, lng: 80.04543 },
    hourlyProfile: [
      0.03, 0.02, 0.01, 0.01, 0.02, 0.08, 0.25, 0.72,
      0.9, 0.95, 0.94, 0.88, 0.6, 0.82, 0.88, 0.82,
      0.55, 0.32, 0.2, 0.12, 0.07, 0.04, 0.03, 0.02,
    ],
  },
  {
    id: 'srm-ub',
    code: 'UB',
    name: 'University Building',
    fullName: 'University Building · Admin & Central Library',
    category: 'admin',
    capacity: 4500,
    location: { lat: 12.82297, lng: 80.04336 },
    // Central library keeps UB occupied well into the night
    hourlyProfile: [
      0.05, 0.03, 0.02, 0.02, 0.03, 0.08, 0.22, 0.55,
      0.82, 0.89, 0.91, 0.87, 0.75, 0.85, 0.89, 0.86,
      0.82, 0.76, 0.68, 0.58, 0.45, 0.3, 0.18, 0.08,
    ],
  },
  {
    id: 'srm-aud',
    code: 'AUDI',
    name: 'Dr. T.P. Ganesan Auditorium',
    fullName: 'Dr. T.P. Ganesan Auditorium & Mini Halls',
    category: 'recreation',
    capacity: 4000,
    location: { lat: 12.82433, lng: 80.04229 },
    hourlyProfile: [
      0.01, 0.01, 0.01, 0.01, 0.01, 0.02, 0.05, 0.15,
      0.35, 0.42, 0.48, 0.45, 0.3, 0.4, 0.55, 0.65,
      0.72, 0.6, 0.4, 0.25, 0.1, 0.05, 0.02, 0.01,
    ],
  },
  {
    id: 'srm-mech',
    code: 'MECH',
    name: "Mechanical 'B' Block",
    fullName: 'Mechanical & Automobile Engineering Complex',
    category: 'academic',
    capacity: 2200,
    location: { lat: 12.82171, lng: 80.04377 },
    hourlyProfile: [
      0.02, 0.01, 0.01, 0.01, 0.01, 0.04, 0.18, 0.62,
      0.85, 0.91, 0.92, 0.86, 0.52, 0.8, 0.86, 0.78,
      0.45, 0.22, 0.12, 0.06, 0.04, 0.02, 0.01, 0.01,
    ],
  },
  {
    id: 'srm-bio',
    code: 'BIO',
    name: 'Bioengineering Block',
    fullName: 'School of Bioengineering & Basic Sciences',
    category: 'research',
    capacity: 1800,
    location: { lat: 12.82218, lng: 80.04552 },
    hourlyProfile: [
      0.02, 0.01, 0.01, 0.01, 0.01, 0.05, 0.15, 0.58,
      0.8, 0.88, 0.9, 0.84, 0.55, 0.78, 0.82, 0.75,
      0.48, 0.25, 0.15, 0.08, 0.05, 0.03, 0.02, 0.01,
    ],
  },
  {
    id: 'srm-java',
    code: 'JAVA',
    name: 'Java Food Court',
    fullName: 'Java Cafe & Central Food Pavilion',
    category: 'dining',
    capacity: 2500,
    location: { lat: 12.82364, lng: 80.04468 },
    // Breakfast (8am), lunch (12–1:30pm) and evening snack (4–6pm) spikes
    hourlyProfile: [
      0.01, 0.01, 0.01, 0.01, 0.02, 0.08, 0.35, 0.78,
      0.65, 0.35, 0.28, 0.65, 0.98, 0.96, 0.45, 0.35,
      0.68, 0.88, 0.82, 0.7, 0.55, 0.25, 0.08, 0.02,
    ],
  },
  {
    id: 'srm-hosp',
    code: 'MCH',
    name: 'SRM Medical Hospital',
    fullName: 'SRM Medical College Hospital & Research Centre',
    category: 'hospital',
    capacity: 3000,
    location: { lat: 12.82586, lng: 80.04053 },
    // Continuous 24h operational profile
    hourlyProfile: [
      0.35, 0.32, 0.3, 0.28, 0.28, 0.32, 0.45, 0.68,
      0.85, 0.92, 0.95, 0.9, 0.82, 0.86, 0.88, 0.85,
      0.78, 0.7, 0.62, 0.55, 0.48, 0.42, 0.38, 0.36,
    ],
  },
  {
    id: 'srm-hostels',
    code: 'HOSTEL',
    name: 'Hostels Quad',
    fullName: 'Oori · Kaari · Paari · Adhiyaman · Kalpana Chawla',
    category: 'residential',
    capacity: 8500,
    location: { lat: 12.82097, lng: 80.04755 },
    // Inverse curve: peak at night, low midday
    hourlyProfile: [
      0.96, 0.97, 0.98, 0.98, 0.96, 0.92, 0.8, 0.45,
      0.22, 0.14, 0.12, 0.15, 0.22, 0.18, 0.14, 0.18,
      0.28, 0.45, 0.68, 0.8, 0.88, 0.93, 0.95, 0.96,
    ],
  },
  {
    id: 'srm-gate',
    code: 'GATE',
    name: 'Potheri Arch Gate',
    fullName: 'Main Arch · Potheri Railway Station Transit Point',
    category: 'recreation',
    capacity: 1500,
    location: { lat: 12.82151, lng: 80.03845 },
    hourlyProfile: [
      0.02, 0.01, 0.01, 0.01, 0.02, 0.08, 0.4, 0.88,
      0.82, 0.45, 0.32, 0.4, 0.6, 0.52, 0.42, 0.58,
      0.85, 0.78, 0.65, 0.45, 0.25, 0.12, 0.05, 0.02,
    ],
  },
];

export { LUNCH_ROOM };
