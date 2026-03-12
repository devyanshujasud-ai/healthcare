import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { Calendar, Clock, User, DollarSign, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkDoctorAccess();
  }, []);

  const checkDoctorAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);

    // Check if user has doctor role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("*, doctors(*)")
      .eq("user_id", session.user.id)
      .eq("role", "doctor")
      .single();

    if (!roleData || !roleData.doctor_id) {
      toast({
        title: "Access Denied",
        description: "You don't have doctor permissions",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    const { data: doctorData } = await supabase
      .from("doctors")
      .select("*, specialization:specializations(*)")
      .eq("id", roleData.doctor_id)
      .single();

    setDoctorInfo(doctorData);
    fetchAppointments(roleData.doctor_id);
  };

  const fetchAppointments = async (doctorId: string) => {
    setLoading(true);
    const { data } = await supabase
      .from("appointments")
      .select("*, profiles(full_name)")
      .eq("doctor_id", doctorId)
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });

    if (data) setAppointments(data);
    setLoading(false);
  };

  const updateAppointmentStatus = async (id: string, status: "pending" | "confirmed" | "completed" | "cancelled") => {
    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Appointment ${status}`,
      });
      if (doctorInfo) fetchAppointments(doctorInfo.id);
    }
  };

  const filterAppointments = (status: string) => {
    return appointments.filter(apt => apt.status === status);
  };

  if (loading || !doctorInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Dr. {doctorInfo.name}</span>
            <Button variant="ghost" onClick={() => supabase.auth.signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Manage your appointments and schedule</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{appointments.length}</p>
                <p className="text-sm text-muted-foreground">Total Appointments</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">{filterAppointments("pending").length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{doctorInfo.rating}</p>
                <p className="text-sm text-muted-foreground">Rating</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{filterAppointments("completed").length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <div className="space-y-4">
              {filterAppointments("pending").map((apt) => (
                <Card key={apt.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{apt.profiles?.full_name}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {apt.appointment_date}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {apt.appointment_time}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="w-4 h-4" />
                          ${apt.payment_amount} - {apt.payment_method}
                        </div>
                      </div>
                      {apt.notes && (
                        <p className="mt-3 text-sm text-muted-foreground">
                          <strong>Notes:</strong> {apt.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => updateAppointmentStatus(apt.id, "confirmed")}>
                        Confirm
                      </Button>
                      <Button variant="destructive" onClick={() => updateAppointmentStatus(apt.id, "cancelled")}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {filterAppointments("pending").length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No pending appointments</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="confirmed" className="mt-6">
            <div className="space-y-4">
              {filterAppointments("confirmed").map((apt) => (
                <Card key={apt.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{apt.profiles?.full_name}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {apt.appointment_date}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {apt.appointment_time}
                        </div>
                      </div>
                      {apt.notes && (
                        <p className="mt-3 text-sm text-muted-foreground">
                          <strong>Notes:</strong> {apt.notes}
                        </p>
                      )}
                    </div>
                    <Button onClick={() => updateAppointmentStatus(apt.id, "completed")}>
                      Mark Complete
                    </Button>
                  </div>
                </Card>
              ))}
              {filterAppointments("confirmed").length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No confirmed appointments</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="space-y-4">
              {filterAppointments("completed").map((apt) => (
                <Card key={apt.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{apt.profiles?.full_name}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {apt.appointment_date}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {apt.appointment_time}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {filterAppointments("completed").length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No completed appointments</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorDashboard;