export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  school_name?: string;
  role: 'admin' | 'user';
  premium_expires_at?: string | null;
}

export interface ClassRoom {
  id: string;
  user_id: string;
  name: string;
  academic_year: string;
  room?: string;
  phone_petugas?: string;
  phone_walikelas?: string;
  student_count?: number;
}

export interface Student {
  id: string;
  class_id: string;
  nis: string;
  name: string;
  gender: 'L' | 'P';
  phone_parent?: string;
  photo?: string;
  discipline_points: number;
  address?: string;
}

export interface AttendanceSession {
  id: string;
  class_id: string;
  token: string;
  daily_pin: string;
  expires_at: string;
  status: 'active' | 'expired';
  created_from?: string;
  created_at: string;
}

export interface Attendance {
  id: string;
  session_id: string;
  student_id: string;
  status: 'hadir' | 'sakit' | 'izin' | 'alfa';
  notes?: string;
  verified_by?: string;
  attended_at: string;
}

export interface Violation {
  id: string;
  student_id: string;
  category: string;
  description: string;
  point_deducted: number;
  violation_date: string;
  handled_by?: string;
}

export interface CashLedger {
  id: string;
  class_id: string;
  student_id?: string | null; // nullable if general
  type: 'income' | 'expense';
  amount: number;
  description: string;
  transaction_date: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  status: 'pending' | 'success' | 'failed';
  package_name: string;
  amount: number;
  payment_url?: string;
  expires_at?: string;
  created_at: string;
}
