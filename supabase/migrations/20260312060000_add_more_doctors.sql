-- ============================================================
-- Migration: Add more doctor profiles
-- Date: 2026-03-12
-- Description: Adds 15 new doctors across all specializations
-- ============================================================

-- ─── OPHTHALMOLOGY ───────────────────────────────────────────

INSERT INTO public.doctors (name, specialization_id, image_url, rating, reviews_count, consultation_fee, experience_years, qualification, about, address, city, latitude, longitude)
SELECT
  'Dr. Anika Sharma',
  id,
  'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400',
  4.7,
  98,
  520,
  9,
  'MBBS, MS (Ophthalmology)',
  'Specializes in pediatric ophthalmology and strabismus correction. Known for her gentle approach with young patients.',
  '22 Vision Care Lane, Suite 103',
  'New York',
  40.7306,
  -73.9352
FROM public.specializations WHERE name = 'Ophthalmology';

INSERT INTO public.doctors (name, specialization_id, image_url, rating, reviews_count, consultation_fee, experience_years, qualification, about, address, city, latitude, longitude)
SELECT
  'Dr. Robert Hayes',
  id,
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
  4.6,
  74,
  480,
  14,
  'MBBS, FRCS (Ophthalmology)',
  'Experienced in glaucoma management and retinal detachment surgeries. Over 2000 successful surgeries performed.',
  '77 Eye Health Blvd',
  'Chicago',
  41.8781,
  -87.6298
FROM public.specializations WHERE name = 'Ophthalmology';

-- ─── ENT ─────────────────────────────────────────────────────

INSERT INTO public.doctors (name, specialization_id, image_url, rating, reviews_count, consultation_fee, experience_years, qualification, about, address, city, latitude, longitude)
SELECT
  'Dr. Fatima Al-Hassan',
  id,
  'https://images.unsplash.com/photo-1588776814546-1ffbb0b3fc78?w=400',
  4.8,
  163,
  580,
  11,
  'MBBS, MS (ENT), Fellowship (Head & Neck Surgery)',
  'Specialist in nasal reconstruction and voice disorders. Multilingual doctor offering consultations in 3 languages.',
  '14 Sound & Sinus Clinic',
  'Los Angeles',
  34.0522,
  -118.2437
FROM public.specializations WHERE name = 'ENT';

INSERT INTO public.doctors (name, specialization_id, image_url, rating, reviews_count, consultation_fee, experience_years, qualification, about, address, city, latitude, longitude)
SELECT
  'Dr. Daniel Osei',
  id,
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400',
  4.5,
  89,
  530,
  7,
  'MBBS, DOHNS (ENT)',
  'Young and dynamic ENT specialist focused on minimally invasive endoscopic procedures and allergy-related sinus conditions.',
  '38 Clarity ENT Center',
  'Houston',
  29.7604,
  -95.3698
FROM public.specializations WHERE name = 'ENT';

-- ─── PEDIATRICS ──────────────────────────────────────────────

INSERT INTO public.doctors (name, specialization_id, image_url, rating, reviews_count, consultation_fee, experience_years, qualification, about, address, city, latitude, longitude)
SELECT
  'Dr. Mei Lin',
  id,
  'https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=400',
  5.0,
  211,
  460,
  13,
  'MBBS, MD (Pediatrics), DCH',
  'Award-winning pediatrician specializing in neonatal care and childhood developmental disorders. Voted Best Pediatrician 2023.',
  '56 Little Stars Child Clinic',
  'San Francisco',
  37.7749,
  -122.4194
FROM public.specializations WHERE name = 'Pediatrics';

INSERT INTO public.doctors (name, specialization_id, image_url, rating, reviews_count, consultation_fee, experience_years, qualification, about, address, city, latitude, longitude)
SELECT
  'Dr. Carlos Mendez',
  id,
  'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400',
  4.7,
  132,
  420,
  6,
  'MBBS, MD (Pediatrics)',
  'Focuses on pediatric infectious diseases and adolescent medicine. Passionate about community health programs.',
  '90 BrightStart Pediatric Hub',
  'Miami',
  25.7617,
  -80.1918
FROM public.specializations WHERE name = 'Pediatrics';

INSERT INTO public.doctors (name, specialization_id, image_url, rating, reviews_count, consultation_fee, experience_years, qualification, about, address, city, latitude, longitude)
SELECT
  'Dr. Sophia Iyer',
  id,
  'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400',
  4.9,
  178,
  440,
  10,
  'MBBS, DNB (Pediatrics)',
  'Expert in pediatric allergy, immunology, and asthma management. Parent-friendly consultation style.',
  '12 KidsCare Medical Center',
  'New York',
  40.7128,
  -74.0059
FROM public.specializations WHERE name = 'Pediatrics';

-- ─── CARDIOLOGY ─────────────────────────────────────────────

INSERT INTO public.doctors (name, specialization_id, image_url, rating, reviews_count, consultation_fee, experience_years, qualification, about, address, city, latitude, longitude)
SELECT
  'Dr. Amara Nwosu',
  id,
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&sig=1',
  4.9,
  241,
  750,
  20,
  'MBBS, DM (Cardiology), FACC',
  'Renowned interventional cardiologist with expertise in complex angioplasties and structural heart disease.',
  '200 HeartFirst Medical Tower',
  'Boston',
  42.3601,
  -71.0589
FROM public.specializations WHERE name = 'Cardiology';

INSERT INTO public.doctors (name, specialization_id, image_url, rating, reviews_count, consultation_fee, experience_years, qualification, about, address, city, latitude, longitude)
SELECT
  'Dr. Elena Petrova',
  id,
  'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400',
  4.8,
  155,
  680,
  16,
  'MBBS, MD, DM (Cardiology)',
  'Specializes in women''s cardiac health and electrophysiology. Pioneer in research on gender differences in heart disease.',
  '45 Cardiac Wellness Clinic',
  'New York',
  40.7400,
  -73.9890
FROM public.specializations WHERE name = 'Cardiology';

INSERT INTO public.doctors (name, specialization_id, image_url, rating, reviews_count, consultation_fee, experience_years, qualification, about, address, city, latitude, longitude)
SELECT
  'Dr. Ahmed Khalil',
  id,
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&sig=2',
  4.6,
  108,
  620,
  12,
  'MBBS, MRCP (Cardiology)',
  'Cardiac imaging expert specializing in echocardiography and cardiac MRI. Over 5000 imaging studies reviewed.',
  '18 Heart Echo Institute',
  'Dallas',
  32.7767,
  -96.7970
FROM public.specializations WHERE name = 'Cardiology';

-- ─── DERMATOLOGY ─────────────────────────────────────────────

INSERT INTO public.doctors (name, specialization_id, image_url, rating, reviews_count, consultation_fee, experience_years, qualification, about, address, city, latitude, longitude)
SELECT
  'Dr. Lara Kingsley',
  id,
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&sig=3',
  4.9,
  196,
  600,
  11,
  'MBBS, MD (Dermatology), DNB',
  'Aesthetic and clinical dermatologist. Pioneering use of AI-assisted skin analysis. Expert in treating complex acne and psoriasis.',
  '33 GlowMed Dermatology',
  'Los Angeles',
  34.0195,
  -118.4912
FROM public.specializations WHERE name = 'Dermatology';

INSERT INTO public.doctors (name, specialization_id, image_url, rating, reviews_count, consultation_fee, experience_years, qualification, about, address, city, latitude, longitude)
SELECT
  'Dr. Rajan Kapoor',
  id,
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&sig=4',
  4.5,
  87,
  500,
  7,
  'MBBS, DVD (Dermatology)',
  'Expert in skin allergies, eczema, and vitiligo. Combines modern dermatology with holistic skin wellness practices.',
  '67 SkinSense Clinic',
  'Chicago',
  41.8827,
  -87.6233
FROM public.specializations WHERE name = 'Dermatology';

-- ─── GENERAL MEDICINE ────────────────────────────────────────

INSERT INTO public.doctors (name, specialization_id, image_url, rating, reviews_count, consultation_fee, experience_years, qualification, about, address, city, latitude, longitude)
SELECT
  'Dr. Olivia Bennett',
  id,
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&sig=5',
  4.8,
  320,
  350,
  15,
  'MBBS, MRCP (Internal Medicine)',
  'Comprehensive general practitioner focusing on chronic disease management, preventive care, and lifestyle medicine.',
  '5 Wellness First Clinic',
  'New York',
  40.7282,
  -73.9942
FROM public.specializations WHERE name = 'General Medicine';

INSERT INTO public.doctors (name, specialization_id, image_url, rating, reviews_count, consultation_fee, experience_years, qualification, about, address, city, latitude, longitude)
SELECT
  'Dr. Marcus Thompson',
  id,
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&sig=5',
  4.7,
  274,
  380,
  17,
  'MBBS, MD (General Medicine)',
  'Trusted family doctor with 17 years of experience in managing diabetes, hypertension, and respiratory conditions.',
  '102 CareFirst Medical Group',
  'Atlanta',
  33.7490,
  -84.3880
FROM public.specializations WHERE name = 'General Medicine';

INSERT INTO public.doctors (name, specialization_id, image_url, rating, reviews_count, consultation_fee, experience_years, qualification, about, address, city, latitude, longitude)
SELECT
  'Dr. Neha Joshi',
  id,
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&sig=2',
  4.9,
  189,
  360,
  9,
  'MBBS, DNB (Family Medicine)',
  'Specializes in women''s health within general medicine — PCOD, thyroid disorders, and nutrition counselling.',
  '29 HolistiCare Wellness Hub',
  'New York',
  40.7589,
  -73.9852
FROM public.specializations WHERE name = 'General Medicine';

-- ─── AVAILABILITY for all new doctors (Mon–Fri, 9 AM to 5 PM) ───
INSERT INTO public.doctor_availability (doctor_id, day_of_week, start_time, end_time)
SELECT d.id, dow, '09:00'::TIME, '17:00'::TIME
FROM public.doctors d
CROSS JOIN generate_series(1, 5) AS dow
WHERE d.name IN (
  'Dr. Anika Sharma',
  'Dr. Robert Hayes',
  'Dr. Fatima Al-Hassan',
  'Dr. Daniel Osei',
  'Dr. Mei Lin',
  'Dr. Carlos Mendez',
  'Dr. Sophia Iyer',
  'Dr. Amara Nwosu',
  'Dr. Elena Petrova',
  'Dr. Ahmed Khalil',
  'Dr. Lara Kingsley',
  'Dr. Rajan Kapoor',
  'Dr. Olivia Bennett',
  'Dr. Marcus Thompson',
  'Dr. Neha Joshi'
)
ON CONFLICT (doctor_id, day_of_week, start_time) DO NOTHING;
