-- ============================================
-- Maid Cafe Full Schema for Supabase
-- Run this ENTIRE script in your Supabase SQL Editor
-- ============================================

-- ============================================
-- RESERVATIONS TABLE
-- ============================================
CREATE TABLE public.maidcafe_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  umd_affiliation TEXT DEFAULT 'student',
  contact_method TEXT,
  contact_value TEXT,
  num_guests INTEGER DEFAULT 1 CHECK (num_guests >= 1 AND num_guests <= 6),
  additional_guests JSONB,
  preferred_staff_name TEXT,
  preferred_staff_id TEXT,
  allergies TEXT,
  special_requests TEXT,
  has_addon_package BOOLEAN DEFAULT FALSE,
  total_price INTEGER NOT NULL DEFAULT 15,
  table_number INTEGER,
  selected_seats JSONB,
  agreed_to_terms BOOLEAN DEFAULT TRUE,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.maidcafe_reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert reservations"
  ON public.maidcafe_reservations
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read reservations"
  ON public.maidcafe_reservations
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can update reservations"
  ON public.maidcafe_reservations
  FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX idx_maidcafe_order_id ON public.maidcafe_reservations(order_id);
CREATE INDEX idx_maidcafe_email ON public.maidcafe_reservations(email);
CREATE INDEX idx_maidcafe_payment ON public.maidcafe_reservations(payment_status);

CREATE OR REPLACE FUNCTION update_maidcafe_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER maidcafe_updated_at
  BEFORE UPDATE ON public.maidcafe_reservations
  FOR EACH ROW EXECUTE FUNCTION update_maidcafe_updated_at();

-- ============================================
-- SEATS TABLE (96 seats: 16 tables x 6 seats)
-- ============================================
CREATE TABLE public.maidcafe_seats (
  id SERIAL PRIMARY KEY,
  table_number INTEGER NOT NULL CHECK (table_number >= 1 AND table_number <= 16),
  seat_number INTEGER NOT NULL CHECK (seat_number >= 1 AND seat_number <= 6),
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved')),
  order_id TEXT,
  reserved_at TIMESTAMPTZ,
  UNIQUE(table_number, seat_number)
);

ALTER TABLE public.maidcafe_seats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read seats"
  ON public.maidcafe_seats
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can update seats"
  ON public.maidcafe_seats
  FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Enable realtime for live seat updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.maidcafe_seats;

-- Seed all 96 seats
INSERT INTO public.maidcafe_seats (table_number, seat_number)
SELECT t, s
FROM generate_series(1, 16) AS t,
     generate_series(1, 6) AS s;

-- ============================================
-- ATOMIC SEAT RESERVATION FUNCTION
-- Prevents race conditions when booking seats
-- ============================================
CREATE OR REPLACE FUNCTION reserve_seats(
  p_order_id TEXT,
  p_seats JSONB
) RETURNS BOOLEAN AS $$
DECLARE
  seat JSONB;
  conflict_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO conflict_count
  FROM maidcafe_seats ms, jsonb_array_elements(p_seats) s
  WHERE ms.table_number = (s->>'table_number')::int
    AND ms.seat_number = (s->>'seat_number')::int
    AND ms.status != 'available';

  IF conflict_count > 0 THEN
    RETURN FALSE;
  END IF;

  FOR seat IN SELECT * FROM jsonb_array_elements(p_seats) LOOP
    UPDATE maidcafe_seats
    SET status = 'reserved',
        order_id = p_order_id,
        reserved_at = NOW()
    WHERE table_number = (seat->>'table_number')::int
      AND seat_number = (seat->>'seat_number')::int
      AND status = 'available';
  END LOOP;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
