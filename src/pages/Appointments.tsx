import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin, X } from "lucide-react";
import { format } from "date-fns";
import { ReviewDialog } from "@/components/ReviewDialog";
import { Logo } from "@/components/Logo";

const Appointments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchAppointments(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchAppointments(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchAppointments = async (userId: string) => {
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        doctor:doctors(
          *,
          specialization:specializations(name, icon)
        )
      `)
      .eq("patient_id", userId)
      .order("appointment_date", { ascending: true });

    if (data) {
      setAppointments(data);
      // Check which appointments have reviews
      const appointmentIds = data.map(apt => apt.id);
      const { data: reviewData } = await supabase
        .from("reviews")
        .select("appointment_id")
        .in("appointment_id", appointmentIds);
      
      const reviewMap: Record<string, boolean> = {};
      reviewData?.forEach((review) => {
        reviewMap[review.appointment_id] = true;
      });
      setReviews(reviewMap);
    }
    setLoading(false);
  };

  const handleCancel = async (appointmentId: string) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", appointmentId);

    if (error) {
      toast({
        title: "Cancellation failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Appointment cancelled",
        description: "Your appointment has been cancelled",
      });
      if (user) {
        fetchAppointments(user.id);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    };
    return (
      <Badge className={variants[status] || ""}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/doctors">Find Doctors</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Appointments</h1>
          <p className="text-muted-foreground text-lg">
            View and manage your upcoming appointments
          </p>
        </div>

        {appointments.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">No appointments yet</h3>
            <p className="text-muted-foreground mb-6">
              Book your first appointment with a doctor
            </p>
            <Button asChild>
              <Link to="/doctors">Browse Doctors</Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment: any) => (
              <Card key={appointment.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={appointment.doctor.image_url}
                    alt={appointment.doctor.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-3xl">{appointment.doctor.specialization.icon}</span>
                          <h3 className="text-xl font-bold">{appointment.doctor.name}</h3>
                        </div>
                        <p className="text-muted-foreground">
                          {appointment.doctor.specialization.name}
                        </p>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(new Date(appointment.appointment_date), "MMMM dd, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.appointment_time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground md:col-span-2">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.doctor.address}, {appointment.doctor.city}</span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mb-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Notes:</p>
                        <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/doctor/${appointment.doctor.id}`}>
                          View Doctor
                        </Link>
                      </Button>
                      {appointment.status === "pending" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancel(appointment.id)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                      {appointment.status === "completed" && !reviews[appointment.id] && user && (
                        <ReviewDialog
                          appointmentId={appointment.id}
                          doctorId={appointment.doctor.id}
                          patientId={user.id}
                          onReviewSubmitted={() => user && fetchAppointments(user.id)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
