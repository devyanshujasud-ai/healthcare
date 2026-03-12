-- Add payment and review system tables

-- Add payment status to appointments
ALTER TABLE appointments ADD COLUMN payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed'));
ALTER TABLE appointments ADD COLUMN payment_method TEXT CHECK (payment_method IN ('cash', 'online'));
ALTER TABLE appointments ADD COLUMN payment_amount INTEGER;

-- Create reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  doctor_id UUID NOT NULL,
  appointment_id UUID NOT NULL UNIQUE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Reviews policies
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews for their appointments"
  ON reviews FOR INSERT
  WITH CHECK (
    patient_id::text = auth.uid()::text 
    AND EXISTS (
      SELECT 1 FROM appointments 
      WHERE id = appointment_id 
      AND patient_id::text = auth.uid()::text
      AND status = 'completed'
    )
  );

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (patient_id::text = auth.uid()::text);

-- Create user roles table for doctor access
CREATE TYPE app_role AS ENUM ('patient', 'doctor', 'admin');

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'patient',
  doctor_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON user_roles FOR SELECT
  USING (user_id::text = auth.uid()::text);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Add trigger for reviews updated_at
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update doctors table to recalculate ratings from reviews
CREATE OR REPLACE FUNCTION update_doctor_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE doctors
  SET 
    rating = (SELECT COALESCE(AVG(rating), 5.0) FROM reviews WHERE doctor_id = NEW.doctor_id),
    reviews_count = (SELECT COUNT(*) FROM reviews WHERE doctor_id = NEW.doctor_id)
  WHERE id = NEW.doctor_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_doctor_rating_on_review
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_doctor_rating();