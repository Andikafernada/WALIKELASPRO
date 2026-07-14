import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Resolve directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(express.json());

// Import WhatsApp routes (CommonJS)
import('./server.whatsapp.cjs').then((wa) => {
  app.use('/api/whatsapp', wa.whatsappRouter);
  console.log('✅ WhatsApp Baileys routes loaded');
}).catch((err) => {
  console.error('Failed to load WhatsApp routes:', err);
});

// ==========================================
// MOCK DATABASE & SEED DATA
// ==========================================

let currentUser = {
  id: 'u1',
  name: 'Andika Fernada, S.Pd.',
  email: 'andika@school.com',
  phone: '081234567890',
  school_name: 'SMA Negeri 1 Jakarta',
  role: 'user', // user but can upgrade to premium
  premium_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // premium active for 30 days
};

let classes = [
  { id: 'c1', user_id: 'u1', name: 'XII RPL 1', academic_year: '2026/2027', room: 'Lab Komputer 3', phone_petugas: '0811223344', phone_walikelas: '081234567890' },
  { id: 'c2', user_id: 'u1', name: 'XI MM 2', academic_year: '2026/2027', room: 'Lab Multimedia 1', phone_petugas: '0822334455', phone_walikelas: '081234567890' }
];

let students = [
  // XII RPL 1 (c1)
  { id: 's1', class_id: 'c1', nis: '102601', name: 'Aditya Pratama', gender: 'L', phone_parent: '08561111111', photo: '', discipline_points: 100, address: 'Jl. Merdeka No. 10, Jakarta' },
  { id: 's2', class_id: 'c1', nis: '102602', name: 'Budi Santoso', gender: 'L', phone_parent: '08562222222', photo: '', discipline_points: 95, address: 'Jl. Mawar No. 4, Jakarta' },
  { id: 's3', class_id: 'c1', nis: '102603', name: 'Citra Lestari', gender: 'P', phone_parent: '08563333333', photo: '', discipline_points: 85, address: 'Jl. Melati No. 12, Jakarta' },
  { id: 's4', class_id: 'c1', nis: '102604', name: 'Dewi Sartika', gender: 'P', phone_parent: '08564444444', photo: '', discipline_points: 100, address: 'Jl. Kemuning No. 1, Jakarta' },
  { id: 's5', class_id: 'c1', nis: '102605', name: 'Eko Prasetyo', gender: 'L', phone_parent: '08565555555', photo: '', discipline_points: 100, address: 'Jl. Tulip No. 9, Jakarta' },

  // XI MM 2 (c2)
  { id: 's6', class_id: 'c2', nis: '112601', name: 'Fajar Nugraha', gender: 'L', phone_parent: '08771111111', photo: '', discipline_points: 100, address: 'Jl. Dahlia No. 15, Jakarta' },
  { id: 's7', class_id: 'c2', nis: '112602', name: 'Gita Permata', gender: 'P', phone_parent: '08772222222', photo: '', discipline_points: 100, address: 'Jl. Sakura No. 8, Jakarta' },
  { id: 's8', class_id: 'c2', nis: '112603', name: 'Hadi Wijaya', gender: 'L', phone_parent: '08773333333', photo: '', discipline_points: 90, address: 'Jl. Anggrek No. 3, Jakarta' }
];

let attendanceSessions = [
  {
    id: 'as1',
    class_id: 'c1',
    token: 'token-rpl-today',
    daily_pin: '1234',
    expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // expires in 8 hours
    status: 'active',
    created_from: '127.0.0.1',
    created_at: new Date().toISOString()
  }
];

let attendances = [
  { id: 'at1', session_id: 'as1', student_id: 's1', status: 'hadir', notes: '', verified_by: 'Andika', attended_at: new Date().toISOString() },
  { id: 'at2', session_id: 'as1', student_id: 's2', status: 'hadir', notes: '', verified_by: 'Andika', attended_at: new Date().toISOString() },
  { id: 'at3', session_id: 'as1', student_id: 's3', status: 'sakit', notes: 'Demam tinggi', verified_by: 'Andika', attended_at: new Date().toISOString() }
];

let violations = [
  { id: 'v1', student_id: 's3', category: 'Kerapihan', description: 'Rambut gondrong & tidak rapi', point_deducted: 15, violation_date: '2026-07-12', handled_by: 'Andika' },
  { id: 'v2', student_id: 's2', category: 'Kehadiran', description: 'Terlambat masuk kelas 20 menit', point_deducted: 5, violation_date: '2026-07-13', handled_by: 'Andika' },
  { id: 'v3', student_id: 's8', category: 'Disiplin', description: 'Membuang sampah sembarangan', point_deducted: 10, violation_date: '2026-07-11', handled_by: 'Andika' }
];

let cashLedgers = [
  { id: 'cl1', class_id: 'c1', student_id: 's1', type: 'income', amount: 50000, description: 'Uang kas bulanan Juli', transaction_date: '2026-07-01' },
  { id: 'cl2', class_id: 'c1', student_id: 's2', type: 'income', amount: 50000, description: 'Uang kas bulanan Juli', transaction_date: '2026-07-02' },
  { id: 'cl3', class_id: 'c1', student_id: null, type: 'expense', amount: 35000, description: 'Pembelian spidol & penghapus whiteboard', transaction_date: '2026-07-05' },
  { id: 'cl4', class_id: 'c1', student_id: 's4', type: 'income', amount: 50000, description: 'Uang kas bulanan Juli', transaction_date: '2026-07-06' }
];

let subscriptions = [
  { id: 'sub1', user_id: 'u1', status: 'success', package_name: 'Premium Monthly', amount: 29000, expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), created_at: '2026-07-13T10:00:00.000Z' }
];

let whatsappStatus = {
  connected: true,
  phone: '081234567890',
  qr_code: null,
  logs: [
    { id: 'wl1', student_name: 'Citra Lestari', type: 'Sakit Notification', recipient: '08563333333', status: 'sent', timestamp: '2026-07-13T08:15:00.000Z' },
    { id: 'wl2', student_name: 'Budi Santoso', type: 'Violation Warning', recipient: '08562222222', status: 'sent', timestamp: '2026-07-13T10:30:00.000Z' }
  ]
};

// JSON Local Database Storage path
const DB_FILE = path.join(__dirname, 'storage', 'db.json');

function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      if (data.currentUser) currentUser = data.currentUser;
      if (data.classes) classes = data.classes;
      if (data.students) students = data.students;
      if (data.attendanceSessions) attendanceSessions = data.attendanceSessions;
      if (data.attendances) attendances = data.attendances;
      if (data.violations) violations = data.violations;
      if (data.cashLedgers) cashLedgers = data.cashLedgers;
      if (data.subscriptions) subscriptions = data.subscriptions;
      if (data.whatsappStatus) whatsappStatus = data.whatsappStatus;
      console.log('Database loaded successfully from ' + DB_FILE);
    } else {
      // Ensure directory exists
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      saveDb();
      console.log('Database initialized successfully in ' + DB_FILE);
    }
  } catch (err) {
    console.error('Failed to load DB, using memory:', err);
  }
}

function saveDb() {
  try {
    const data = {
      currentUser,
      classes,
      students,
      attendanceSessions,
      attendances,
      violations,
      cashLedgers,
      subscriptions,
      whatsappStatus
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save DB:', err);
  }
}

// Initial DB Load
loadDb();

// Helper generator IDs
const uuid = () => Math.random().toString(36).substring(2, 9);

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. Auth / User profile
app.get('/api/auth/me', (req, res) => {
  res.json(currentUser);
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }
  // Simulated login/update
  currentUser.email = email;
  saveDb();
  res.json(currentUser);
});

// Register new user
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone, school_name } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }

  // Check if email already exists
  if (currentUser && currentUser.email === email) {
    return res.status(400).json({ error: 'Email sudah terdaftar' });
  }

  // Create new user (for demo, we replace current user)
  currentUser = {
    id: 'u1',
    name: name,
    email: email,
    phone: phone || '',
    school_name: school_name || '',
    role: 'user',
    premium_expires_at: null // Free tier
  };

  saveDb();
  res.json(currentUser);
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  // For demo, we just return success
  // In production, you'd invalidate session/token
  res.json({ success: true, message: 'Logged out' });
});

app.post('/api/auth/profile', (req, res) => {
  const { name, school_name, phone } = req.body;
  currentUser.name = name || currentUser.name;
  currentUser.school_name = school_name || currentUser.school_name;
  currentUser.phone = phone || currentUser.phone;
  saveDb();
  res.json(currentUser);
});

// Upgrade to Premium
app.post('/api/auth/upgrade', (req, res) => {
  currentUser.premium_expires_at = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  subscriptions.unshift({
    id: 'sub-' + uuid(),
    user_id: 'u1',
    status: 'success',
    package_name: 'Premium 1 Year',
    amount: 149000,
    expires_at: currentUser.premium_expires_at,
    created_at: new Date().toISOString()
  });
  saveDb();
  res.json(currentUser);
});

// Downgrade to Free
app.post('/api/auth/downgrade', (req, res) => {
  currentUser.premium_expires_at = null;
  saveDb();
  res.json(currentUser);
});

// 2. Class Rooms (Kelas)
app.get('/api/classes', (req, res) => {
  res.json(classes);
});

app.post('/api/classes', (req, res) => {
  const { name, academic_year, room, phone_petugas, phone_walikelas } = req.body;
  if (!name || !academic_year) {
    return res.status(400).json({ error: 'Name and Academic Year are required' });
  }
  const newClass = {
    id: 'c-' + uuid(),
    user_id: currentUser.id,
    name,
    academic_year,
    room: room || '',
    phone_petugas: phone_petugas || '',
    phone_walikelas: phone_walikelas || ''
  };
  classes.push(newClass);
  saveDb();
  res.status(201).json(newClass);
});

app.put('/api/classes/:id', (req, res) => {
  const { name, academic_year, room, phone_petugas, phone_walikelas } = req.body;
  const clsIndex = classes.findIndex(c => c.id === req.params.id);
  if (clsIndex === -1) {
    return res.status(404).json({ error: 'Class not found' });
  }
  classes[clsIndex] = {
    ...classes[clsIndex],
    name: name || classes[clsIndex].name,
    academic_year: academic_year || classes[clsIndex].academic_year,
    room: room !== undefined ? room : classes[clsIndex].room,
    phone_petugas: phone_petugas !== undefined ? phone_petugas : classes[clsIndex].phone_petugas,
    phone_walikelas: phone_walikelas !== undefined ? phone_walikelas : classes[clsIndex].phone_walikelas
  };
  saveDb();
  res.json(classes[clsIndex]);
});

app.delete('/api/classes/:id', (req, res) => {
  classes = classes.filter(c => c.id !== req.params.id);
  students = students.filter(s => s.class_id !== req.params.id);
  saveDb();
  res.json({ success: true });
});

// 3. Students (Siswa) per Class
app.get('/api/classes/:classId/students', (req, res) => {
  const classStudents = students.filter(s => s.class_id === req.params.classId);
  res.json(classStudents);
});

app.post('/api/classes/:classId/students', (req, res) => {
  const { nis, name, gender, phone_parent, address } = req.body;
  if (!nis || !name || !gender) {
    return res.status(400).json({ error: 'NIS, Name and Gender are required' });
  }
  const newStudent = {
    id: 's-' + uuid(),
    class_id: req.params.classId,
    nis,
    name,
    gender: gender as 'L' | 'P',
    phone_parent: phone_parent || '',
    photo: '',
    discipline_points: 100,
    address: address || ''
  };
  students.push(newStudent);
  saveDb();
  res.status(201).json(newStudent);
});

app.put('/api/students/:id', (req, res) => {
  const { nis, name, gender, phone_parent, address, discipline_points } = req.body;
  const studIndex = students.findIndex(s => s.id === req.params.id);
  if (studIndex === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }
  students[studIndex] = {
    ...students[studIndex],
    nis: nis || students[studIndex].nis,
    name: name || students[studIndex].name,
    gender: (gender || students[studIndex].gender) as 'L' | 'P',
    phone_parent: phone_parent !== undefined ? phone_parent : students[studIndex].phone_parent,
    address: address !== undefined ? address : students[studIndex].address,
    discipline_points: discipline_points !== undefined ? Number(discipline_points) : students[studIndex].discipline_points
  };
  saveDb();
  res.json(students[studIndex]);
});

app.delete('/api/students/:id', (req, res) => {
  students = students.filter(s => s.id !== req.params.id);
  violations = violations.filter(v => v.student_id !== req.params.id);
  attendances = attendances.filter(a => a.student_id !== req.params.id);
  cashLedgers = cashLedgers.filter(cl => cl.student_id !== req.params.id);
  saveDb();
  res.json({ success: true });
});

// 4. Attendance Sessions & Records
app.get('/api/classes/:classId/attendance-sessions', (req, res) => {
  const sessions = attendanceSessions.filter(as => as.class_id === req.params.classId);
  res.json(sessions);
});

app.post('/api/classes/:classId/attendance-sessions', (req, res) => {
  const { daily_pin, expires_hours } = req.body;
  const token = 'tok-' + uuid();
  const expiresAt = new Date(Date.now() + (Number(expires_hours || 4)) * 60 * 60 * 1000).toISOString();
  
  const newSession = {
    id: 'as-' + uuid(),
    class_id: req.params.classId,
    token,
    daily_pin: daily_pin || Math.floor(1000 + Math.random() * 9000).toString(),
    expires_at: expiresAt,
    status: 'active' as const,
    created_from: '127.0.0.1',
    created_at: new Date().toISOString()
  };
  attendanceSessions.push(newSession);
  saveDb();
  res.status(201).json(newSession);
});

app.patch('/api/attendance-sessions/:id/expire', (req, res) => {
  const sessIndex = attendanceSessions.findIndex(as => as.id === req.params.id);
  if (sessIndex === -1) {
    return res.status(404).json({ error: 'Session not found' });
  }
  attendanceSessions[sessIndex].status = 'expired';
  saveDb();
  res.json(attendanceSessions[sessIndex]);
});

app.get('/api/attendance-sessions/:id', (req, res) => {
  const session = attendanceSessions.find(as => as.id === req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(session);
});

// Get/Save records for a session (Teacher view)
app.get('/api/attendance-sessions/:id/records', (req, res) => {
  const sessionRecords = attendances.filter(a => a.session_id === req.params.id);
  res.json(sessionRecords);
});

app.post('/api/attendance-sessions/:id/records', (req, res) => {
  const { records } = req.body; // Array of { student_id, status, notes }
  if (!Array.isArray(records)) {
    return res.status(400).json({ error: 'Records array is required' });
  }

  // Remove existing records for this session first to overwrite
  attendances = attendances.filter(a => a.session_id !== req.params.id);

  records.forEach((rec: any) => {
    attendances.push({
      id: 'at-' + uuid(),
      session_id: req.params.id,
      student_id: rec.student_id,
      status: rec.status,
      notes: rec.notes || '',
      verified_by: currentUser.name,
      attended_at: new Date().toISOString()
    });

    // Simulate WhatsApp alert if absent / sick and WhatsApp is connected
    if (whatsappStatus.connected && ['sakit', 'izin', 'alfa'].includes(rec.status)) {
      const student = students.find(s => s.id === rec.student_id);
      if (student && student.phone_parent) {
        whatsappStatus.logs.unshift({
          id: 'wl-' + uuid(),
          student_name: student.name,
          type: `Absensi: ${rec.status.toUpperCase()}`,
          recipient: student.phone_parent,
          status: 'sent',
          timestamp: new Date().toISOString()
        });
      }
    }
  });

  saveDb();
  res.json({ success: true, count: records.length });
});

// 5. Public Attendance (Submitting via unique token)
app.get('/api/attendance-public/session/:token', (req, res) => {
  const session = attendanceSessions.find(as => as.token === req.params.token);
  if (!session) {
    return res.status(404).json({ error: 'Token absensi tidak valid atau kadaluarsa.' });
  }
  if (session.status === 'expired' || new Date(session.expires_at) < new Date()) {
    return res.status(400).json({ error: 'Sesi absensi ini sudah berakhir.' });
  }
  
  const classObj = classes.find(c => c.id === session.class_id);
  const classStudents = students.filter(s => s.class_id === session.class_id);
  
  // Also see who already submitted
  const submittedStudentIds = attendances
    .filter(a => a.session_id === session.id)
    .map(a => a.student_id);

  res.json({
    session,
    class_name: classObj?.name || '',
    students: classStudents.map(s => ({
      id: s.id,
      nis: s.nis,
      name: s.name,
      gender: s.gender,
      already_submitted: submittedStudentIds.includes(s.id)
    }))
  });
});

app.post('/api/attendance-public/submit', (req, res) => {
  const { session_id, pin, student_id, status, notes } = req.body;
  
  const session = attendanceSessions.find(as => as.id === session_id);
  if (!session) {
    return res.status(404).json({ error: 'Sesi absensi tidak ditemukan.' });
  }
  if (session.status === 'expired' || new Date(session.expires_at) < new Date()) {
    return res.status(400).json({ error: 'Sesi absensi sudah berakhir.' });
  }

  // Verify PIN
  if (session.daily_pin !== pin) {
    return res.status(400).json({ error: 'PIN harian yang Anda masukkan salah.' });
  }

  // Check if student already submitted
  const alreadyExists = attendances.some(a => a.session_id === session_id && a.student_id === student_id);
  if (alreadyExists) {
    return res.status(400).json({ error: 'Anda sudah mengisi absensi untuk hari ini.' });
  }

  const newAttendance = {
    id: 'at-' + uuid(),
    session_id,
    student_id,
    status: status || 'hadir',
    notes: notes || '',
    verified_by: '',
    attended_at: new Date().toISOString()
  };
  attendances.push(newAttendance);

  // Send WhatsApp mock alert if WhatsApp connected and not 'hadir'
  if (whatsappStatus.connected && ['sakit', 'izin', 'alfa'].includes(status)) {
    const student = students.find(s => s.id === student_id);
    if (student && student.phone_parent) {
      whatsappStatus.logs.unshift({
        id: 'wl-' + uuid(),
        student_name: student.name,
        type: `Absensi Mandiri: ${status.toUpperCase()}`,
        recipient: student.phone_parent,
        status: 'sent',
        timestamp: new Date().toISOString()
      });
    }
  }

  saveDb();
  res.json({ success: true, attendance: newAttendance });
});

// 6. Cash Ledger (Kas Kelas)
app.get('/api/classes/:classId/cash-ledgers', (req, res) => {
  const ledgers = cashLedgers.filter(cl => cl.class_id === req.params.classId);
  res.json(ledgers);
});

app.post('/api/classes/:classId/cash-ledgers', (req, res) => {
  const { student_id, type, amount, description, transaction_date } = req.body;
  if (!type || !amount || !description || !transaction_date) {
    return res.status(400).json({ error: 'Missing required cash ledger parameters' });
  }
  const newLedger = {
    id: 'cl-' + uuid(),
    class_id: req.params.classId,
    student_id: student_id || null,
    type: type as 'income' | 'expense',
    amount: Number(amount),
    description,
    transaction_date
  };
  cashLedgers.push(newLedger);
  saveDb();
  res.status(201).json(newLedger);
});

app.put('/api/cash-ledgers/:id', (req, res) => {
  const { student_id, type, amount, description, transaction_date } = req.body;
  const index = cashLedgers.findIndex(cl => cl.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  cashLedgers[index] = {
    ...cashLedgers[index],
    student_id: student_id !== undefined ? student_id : cashLedgers[index].student_id,
    type: type || cashLedgers[index].type,
    amount: amount !== undefined ? Number(amount) : cashLedgers[index].amount,
    description: description || cashLedgers[index].description,
    transaction_date: transaction_date || cashLedgers[index].transaction_date
  };
  saveDb();
  res.json(cashLedgers[index]);
});

app.delete('/api/cash-ledgers/:id', (req, res) => {
  cashLedgers = cashLedgers.filter(cl => cl.id !== req.params.id);
  saveDb();
  res.json({ success: true });
});

// 7. Violations (Pelanggaran Siswa)
app.get('/api/classes/:classId/violations', (req, res) => {
  // Filter violations for students belonging to the class
  const classStudentIds = students.filter(s => s.class_id === req.params.classId).map(s => s.id);
  const classViolations = violations.filter(v => classStudentIds.includes(v.student_id));
  res.json(classViolations);
});

app.post('/api/classes/:classId/violations', (req, res) => {
  const { student_id, category, description, point_deducted, violation_date } = req.body;
  if (!student_id || !category || !description || !point_deducted || !violation_date) {
    return res.status(400).json({ error: 'Missing required violation fields' });
  }
  const newViolation = {
    id: 'v-' + uuid(),
    student_id,
    category,
    description,
    point_deducted: Number(point_deducted),
    violation_date,
    handled_by: currentUser.name
  };
  violations.push(newViolation);

  // Deduct student discipline points
  const studIndex = students.findIndex(s => s.id === student_id);
  if (studIndex !== -1) {
    students[studIndex].discipline_points = Math.max(0, students[studIndex].discipline_points - Number(point_deducted));
    
    // Send WhatsApp notification if connected
    if (whatsappStatus.connected && students[studIndex].phone_parent) {
      whatsappStatus.logs.unshift({
        id: 'wl-' + uuid(),
        student_name: students[studIndex].name,
        type: 'Pelanggaran Siswa',
        recipient: students[studIndex].phone_parent || '',
        status: 'sent',
        timestamp: new Date().toISOString()
      });
    }
  }

  saveDb();
  res.status(201).json(newViolation);
});

app.put('/api/violations/:id', (req, res) => {
  const { category, description, point_deducted, violation_date } = req.body;
  const index = violations.findIndex(v => v.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Violation record not found' });
  }

  const oldPoints = violations[index].point_deducted;
  const studentId = violations[index].student_id;

  violations[index] = {
    ...violations[index],
    category: category || violations[index].category,
    description: description || violations[index].description,
    point_deducted: point_deducted !== undefined ? Number(point_deducted) : violations[index].point_deducted,
    violation_date: violation_date || violations[index].violation_date
  };

  // Adjust points on student
  if (point_deducted !== undefined) {
    const studIndex = students.findIndex(s => s.id === studentId);
    if (studIndex !== -1) {
      // Revert old points, then deduct new points
      students[studIndex].discipline_points = Math.max(0, students[studIndex].discipline_points + oldPoints - Number(point_deducted));
    }
  }

  saveDb();
  res.json(violations[index]);
});

app.delete('/api/violations/:id', (req, res) => {
  const violation = violations.find(v => v.id === req.params.id);
  if (violation) {
    // Revert points to student
    const studIndex = students.findIndex(s => s.id === violation.student_id);
    if (studIndex !== -1) {
      students[studIndex].discipline_points = Math.min(100, students[studIndex].discipline_points + violation.point_deducted);
    }
    violations = violations.filter(v => v.id !== req.params.id);
  }
  saveDb();
  res.json({ success: true });
});

// Get Subscriptions
app.get('/api/subscriptions', (req, res) => {
  res.json(subscriptions);
});

// Create subscription checkout (Mock)
app.post('/api/langganan/checkout', (req, res) => {
  const { package_name, amount } = req.body;
  const checkoutId = 'pay-' + uuid();
  res.json({
    token: checkoutId,
    redirect_url: `/langganan/checkout?token=${checkoutId}&package=${encodeURIComponent(package_name)}&amount=${amount}`
  });
});

// ==========================================
// VITE DEV / PRODUCTION STATIC SERVING
// ==========================================
// Test QR Page (Before Vite middleware)
const testQrPath = path.join(process.cwd(), 'public', 'test-qr.html');
if (fs.existsSync(testQrPath)) {
  app.get('/qr-test', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.sendFile(testQrPath);
  });
}

if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), 'dist', 'client');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const HOST = process.env.HOST || '0.0.0.0';
app.listen(Number(PORT), HOST, () => {
  console.log(`🚀 WALIKELASPRO server running on http://${HOST}:${PORT}`);
  console.log(`📱 App: https://walas.my.id`);
  console.log(`📱 WhatsApp: Ready for connection`);
});
