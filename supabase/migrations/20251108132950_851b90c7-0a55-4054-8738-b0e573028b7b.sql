-- Create enum for appointment status
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create specializations table
CREATE TABLE public.specializations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialization_id UUID NOT NULL REFERENCES public.specializations(id) ON DELETE CASCADE,
  image_url TEXT,
  rating DECIMAL(2,1) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER DEFAULT 0,
  consultation_fee INTEGER NOT NULL,
  experience_years INTEGER DEFAULT 0,
  qualification TEXT NOT NULL,
  about TEXT,
  address TEXT,
  city TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctor availability table
CREATE TABLE public.doctor_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(doctor_id, day_of_week, start_time)
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status appointment_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for patients
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for specializations (public read)
CREATE POLICY "Specializations are viewable by everyone"
  ON public.specializations FOR SELECT
  USING (true);

-- RLS Policies for doctors (public read)
CREATE POLICY "Doctors are viewable by everyone"
  ON public.doctors FOR SELECT
  USING (true);

-- RLS Policies for doctor availability (public read)
CREATE POLICY "Doctor availability is viewable by everyone"
  ON public.doctor_availability FOR SELECT
  USING (true);

-- RLS Policies for appointments
CREATE POLICY "Users can view their own appointments"
  ON public.appointments FOR SELECT
  USING (patient_id::text = auth.uid()::text);

CREATE POLICY "Users can create their own appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (patient_id::text = auth.uid()::text);

CREATE POLICY "Users can update their own appointments"
  ON public.appointments FOR UPDATE
  USING (patient_id::text = auth.uid()::text);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (id::text = auth.uid()::text);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (id::text = auth.uid()::text);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (id::text = auth.uid()::text);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample specializations
INSERT INTO public.specializations (name, icon, description) VALUES
  ('Ophthalmology', '👁️', 'Eye care and vision specialists'),
  ('ENT', '👂', 'Ear, Nose, and Throat specialists'),
  ('Pediatrics', '👶', 'Child healthcare specialists'),
  ('Cardiology', '❤️', 'Heart and cardiovascular specialists'),
  ('Dermatology', '💆‍♂️', 'Skin care specialists'),
  ('General Medicine', '🩺', 'General health and wellness');

-- Insert sample doctors
INSERT INTO public.doctors (name, specialization_id, image_url, rating, reviews_count, consultation_fee, experience_years, qualification, about, address, city, latitude, longitude)
SELECT 
  'Dr. Sarah Johnson',
  id,
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
  4.8,
  127,
  500,
  12,
  'MBBS, MD (Ophthalmology)',
  'Specialized in cataract surgery and laser eye treatments',
  '123 Medical Plaza, Suite 200',
  'New York',
  40.7128,
  -74.0060
FROM public.specializations WHERE name = 'Ophthalmology';

INSERT INTO public.doctors (name, specialization_id, image_url, rating, reviews_count, consultation_fee, experience_years, qualification, about, address, city, latitude, longitude)
SELECT 
  'Dr. Michael Chen',
  id,
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
  4.9,
  203,
  600,
  15,
  'MBBS, MS (ENT)',
  'Expert in sinus surgery and hearing disorders',
  '456 Healthcare Center',
  'New York',
  40.7580,
  -73.9855
FROM public.specializations WHERE name = 'ENT';

INSERT INTO public.doctors (name, specialization_id, image_url, rating, reviews_count, consultation_fee, experience_years, qualification, about, address, city, latitude, longitude)
SELECT 
  'Dr. Emily Rodriguez',
  id,
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
  5.0,
  156,
  450,
  10,
  'MBBS, MD (Pediatrics)',
  'Passionate about child health and development',
  '789 Kids Health Clinic',
  'New York',
  40.7489,
  -73.9680
FROM public.specializations WHERE name = 'Pediatrics';

INSERT INTO public.doctors (name, specialization_id, image_url, rating, reviews_count, consultation_fee, experience_years, qualification, about, address, city, latitude, longitude)
SELECT 
  'Dr. James Wilson',
  id,
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
  4.7,
  189,
  700,
  18,
  'MBBS, DM (Cardiology)',
  'Specializes in preventive cardiology and heart disease management',
  '321 Heart Care Institute',
  'New York',
  40.7614,
  -73.9776
FROM public.specializations WHERE name = 'Cardiology';

INSERT INTO public.doctors (name, specialization_id, image_url, rating, reviews_count, consultation_fee, experience_years, qualification, about, address, city, latitude, longitude)
SELECT 
  'Dr. Priya Patel',
  id,
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
  4.9,
  142,
  550,
  8,
  'MBBS, MD (Dermatology)',
  'Expert in cosmetic and medical dermatology',
  '555 Skin Care Center',
  'New York',
  40.7282,
  -73.9942
FROM public.specializations WHERE name = 'Dermatology';

-- Insert sample availability (Monday to Friday, 9 AM to 5 PM)
INSERT INTO public.doctor_availability (doctor_id, day_of_week, start_time, end_time)
SELECT d.id, dow, '09:00'::TIME, '17:00'::TIME
FROM public.doctors d
CROSS JOIN generate_series(1, 5) AS dow;