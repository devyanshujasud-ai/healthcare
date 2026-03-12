-- Create emergency blood requests table
CREATE TABLE public.emergency_blood_requests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    blood_bank_id UUID REFERENCES public.blood_banks(id) ON DELETE SET NULL,
    blood_type TEXT NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    units_needed INTEGER NOT NULL DEFAULT 1,
    urgency_level TEXT NOT NULL DEFAULT 'high' CHECK (urgency_level IN ('critical', 'high', 'medium')),
    patient_name TEXT,
    hospital_name TEXT NOT NULL,
    hospital_address TEXT,
    contact_phone TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'cancelled', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donor profiles table for notification preferences
CREATE TABLE public.donor_profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    blood_type TEXT CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    city TEXT,
    is_available BOOLEAN DEFAULT true,
    receive_emergency_alerts BOOLEAN DEFAULT true,
    last_donation_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table for in-app notifications
CREATE TABLE public.blood_notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    emergency_request_id UUID REFERENCES public.emergency_blood_requests(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.emergency_blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_notifications ENABLE ROW LEVEL SECURITY;

-- Emergency requests are publicly viewable when active
CREATE POLICY "Active emergency requests are viewable by everyone" 
ON public.emergency_blood_requests FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create emergency requests" 
ON public.emergency_blood_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update their own emergency requests" 
ON public.emergency_blood_requests FOR UPDATE USING (auth.uid() = requester_id);

-- Donor profiles policies
CREATE POLICY "Users can view their own donor profile" 
ON public.donor_profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own donor profile" 
ON public.donor_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own donor profile" 
ON public.donor_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" 
ON public.blood_notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.blood_notifications FOR UPDATE USING (auth.uid() = user_id);

-- Enable realtime for emergency requests
ALTER PUBLICATION supabase_realtime ADD TABLE public.emergency_blood_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blood_notifications;

-- Triggers for updated_at
CREATE TRIGGER update_emergency_blood_requests_updated_at 
BEFORE UPDATE ON public.emergency_blood_requests 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donor_profiles_updated_at 
BEFORE UPDATE ON public.donor_profiles 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();