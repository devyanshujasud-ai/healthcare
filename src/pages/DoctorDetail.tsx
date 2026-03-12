import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Star, MapPin, DollarSign, Clock, Award, ArrowLeft } from "lucide-react";
import { PaymentSelection } from "@/components/PaymentSelection";
import { ReviewCard } from "@/components/ReviewCard";
import { Logo } from "@/components/Logo";

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [booking, setBooking] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">();
  const [reviews, setReviews] = useState<any[]>([]);

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    fetchDoctor();

    return () => subscription.unsubscribe();
  }, [id]);

  const fetchDoctor = async () => {
    const { data, error } = await supabase
      .from("doctors")
      .select(`
        *,
        specialization:specializations(name, icon, description)
      `)
      .eq("id", id)
      .single();

    if (data) {
      setDoctor(data);
      fetchReviews();
    }
    setLoading(false);
  };

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*, profiles(full_name)")
      .eq("doctor_id", id)
      .order("created_at", { ascending: false });
    
    if (data) setReviews(data);
  };

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to book an appointment",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing information",
        description: "Please select both date and time",
        variant: "destructive",
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Payment method required",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    setBooking(true);

    const { error } = await supabase.from("appointments").insert({
      patient_id: user.id,
      doctor_id: id,
      appointment_date: selectedDate.toISOString().split("T")[0],
      appointment_time: selectedTime,
      notes: notes,
      status: "pending",
      payment_method: paymentMethod,
      payment_amount: doctor.consultation_fee,
      payment_status: paymentMethod === "online" ? "completed" : "pending",
    });

    if (error) {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Appointment booked!",
        description: "Your appointment has been successfully scheduled",
      });
      navigate("/appointments");
    }

    setBooking(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Doctor not found</h2>
          <Button asChild>
            <Link to="/doctors">Browse Doctors</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Doctor Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={doctor.image_url}
                  alt={doctor.name}
                  className="w-48 h-48 object-cover rounded-2xl"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-5xl mb-2">{doctor.specialization.icon}</div>
                      <h1 className="text-3xl font-bold mb-2">{doctor.name}</h1>
                      <p className="text-xl text-muted-foreground">
                        {doctor.specialization.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{doctor.rating}</span>
                      <span className="text-muted-foreground">
                        ({doctor.reviews_count} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span>{doctor.experience_years} years experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      <span>{doctor.qualification}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span>{doctor.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <span className="font-semibold">${doctor.consultation_fee}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed">
                {doctor.about || doctor.specialization.description}
              </p>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">Address</h2>
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-primary mt-1" />
                <div>
                  <p className="font-medium">{doctor.address}</p>
                  <p className="text-muted-foreground">{doctor.city}</p>
                </div>
              </div>
            </Card>

            {reviews.length > 0 && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Patient Reviews</h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      patientName={review.profiles?.full_name || "Anonymous"}
                      rating={review.rating}
                      comment={review.comment}
                      createdAt={review.created_at}
                    />
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Book Appointment</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Select Date
                  </label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Select Time
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className="w-full"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Additional Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="Describe your symptoms or reason for visit..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                <PaymentSelection
                  amount={doctor.consultation_fee}
                  selectedMethod={paymentMethod}
                  onPaymentSelect={setPaymentMethod}
                />

                <div className="pt-4 border-t">
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleBooking}
                    disabled={booking || !selectedDate || !selectedTime || !paymentMethod}
                  >
                    {booking ? "Booking..." : "Confirm Booking"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;
