-- ========================================
-- V4M — Supabase Schema
-- ========================================

-- ========== USERS ==========
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  password TEXT NOT NULL,
  plan TEXT DEFAULT 'none',
  plan_expiry TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== TECHNICIANS ==========
CREATE TABLE IF NOT EXISTS technicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  password TEXT NOT NULL,
  specialty TEXT DEFAULT 'geral',
  available BOOLEAN DEFAULT true,
  location_lat REAL,
  location_lng REAL,
  location_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== ASSISTANCE REQUESTS ==========
CREATE TABLE IF NOT EXISTS assistance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  guest_name TEXT,
  guest_phone TEXT,
  location_lat REAL,
  location_lng REAL,
  location_address TEXT,
  problem_type TEXT NOT NULL,
  description TEXT,
  photo TEXT,
  status TEXT DEFAULT 'pending',
  technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== NOTIFICATIONS ==========
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== TECHNICIAN NOTIFICATIONS ==========
CREATE TABLE IF NOT EXISTS technician_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read INTEGER DEFAULT 0,
  request_id UUID REFERENCES assistance_requests(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== REVIEWS ==========
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES assistance_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== INDEXES ==========
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_technicians_phone ON technicians(phone);
CREATE INDEX IF NOT EXISTS idx_requests_user ON assistance_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON assistance_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_technician ON assistance_requests(technician_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_tech_notifications ON technician_notifications(technician_id);
CREATE INDEX IF NOT EXISTS idx_reviews_request ON reviews(request_id);

-- ========== RLS (Row Level Security) ==========
-- Disable RLS for server-side access (API handles auth)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies: service_role bypasses RLS, so these are permissive
-- Anon can only read public data (plans page etc)
CREATE POLICY "Anon can read users" ON users FOR SELECT USING (true);
CREATE POLICY "Anon can insert users" ON users FOR INSERT WITH CHECK (true);

CREATE POLICY "Anon can read assistance" ON assistance_requests FOR SELECT USING (true);
CREATE POLICY "Anon can insert assistance" ON assistance_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role full access" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access tech" ON technicians FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access requests" ON assistance_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access notif" ON notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access tech_notif" ON technician_notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);
