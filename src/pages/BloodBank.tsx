import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Droplet, MapPin, Phone, Clock, Heart, Building2, Calendar, AlertTriangle, Bell } from "lucide-react";
import { EmergencyRequestCard } from "@/components/EmergencyRequestCard";
import { EmergencyRequestDialog } from "@/components/EmergencyRequestDialog";
import { DonorProfileSetup } from "@/components/DonorProfileSetup";

interface BloodBank {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string | null;
  operating_hours: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface BloodInventory {
  id: string;
  blood_bank_id: string;
  blood_type: string;
  units_available: number;
  blood_banks?: BloodBank;
}

interface EmergencyRequest {
  id: string;
  blood_type: string;
  units_needed: number;
  urgency_level: string;
  patient_name: string | null;
  hospital_name: string;
  hospital_address: string | null;
  contact_phone: string;
  notes: string | null;
  expires_at: string;
  created_at: string;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const getAvailabilityStatus = (units: number) => {
  if (units >= 20) return { label: "High", variant: "default" as const, color: "bg-green-500" };
  if (units >= 10) return { label: "Medium", variant: "secondary" as const, color: "bg-yellow-500" };
  return { label: "Low", variant: "destructive" as const, color: "bg-red-500" };
};

export default function BloodBank() {
  const [user, setUser] = useState<any>(null);
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [inventory, setInventory] = useState<BloodInventory[]>([]);
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);
  const [selectedBloodType, setSelectedBloodType] = useState<string>("all");
  const [donationDialogOpen, setDonationDialogOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [donationBloodType, setDonationBloodType] = useState<string>("");
  const [preferredDate, setPreferredDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    fetchBloodBanks();
    fetchInventory();
    fetchEmergencyRequests();

    // Subscribe to real-time emergency requests
    const channel = supabase
      .channel('emergency-requests')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'emergency_blood_requests' },
        (payload) => {
          console.log('Emergency request update:', payload);
          fetchEmergencyRequests();
          if (payload.eventType === 'INSERT') {
            const newRequest = payload.new as EmergencyRequest;
            toast({
              title: "🚨 New Emergency Blood Request!",
              description: `${newRequest.blood_type} blood needed at ${newRequest.hospital_name}`,
              variant: "destructive",
            });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBloodBanks = async () => {
    const { data, error } = await supabase
      .from("blood_banks" as any)
      .select("*")
      .order("name");
    
    if (!error && data) {
      setBloodBanks(data as unknown as BloodBank[]);
    }
  };

  const fetchInventory = async () => {
    const { data, error } = await supabase
      .from("blood_inventory" as any)
      .select("*, blood_banks(*)")
      .order("blood_type");
    
    if (!error && data) {
      setInventory(data as unknown as BloodInventory[]);
    }
  };

  const fetchEmergencyRequests = async () => {
    const { data, error } = await supabase
      .from("emergency_blood_requests" as any)
      .select("*")
      .eq("status", "active")
      .order("urgency_level", { ascending: true })
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      setEmergencyRequests(data as unknown as EmergencyRequest[]);
    }
  };

  const handleRespondToEmergency = (requestId: string) => {
    const request = emergencyRequests.find(r => r.id === requestId);
    if (request) {
      window.location.href = `tel:${request.contact_phone}`;
    }
  };

  const handleDonationRequest = async () => {
    if (!user) {
      toast({ title: "Please sign in to request a donation appointment", variant: "destructive" });
      return;
    }

    if (!selectedBank || !donationBloodType) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("donation_requests" as any).insert({
      user_id: user.id,
      blood_bank_id: selectedBank,
      blood_type: donationBloodType,
      preferred_date: preferredDate || null,
      notes: notes || null,
    });

    setLoading(false);
    if (error) {
      toast({ title: "Failed to submit request", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Donation request submitted!", description: "The blood bank will contact you soon." });
      setDonationDialogOpen(false);
      setSelectedBank("");
      setDonationBloodType("");
      setPreferredDate("");
      setNotes("");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const filteredInventory = selectedBloodType === "all" 
    ? inventory 
    : inventory.filter(item => item.blood_type === selectedBloodType);

  const groupedByBloodType = BLOOD_TYPES.map(type => {
    const items = inventory.filter(item => item.blood_type === type);
    const totalUnits = items.reduce((sum, item) => sum + item.units_available, 0);
    return { type, totalUnits, items };
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/doctors">
              <Button variant="ghost">Find Doctors</Button>
            </Link>
            {user ? (
              <>
                <Link to="/appointments">
                  <Button variant="ghost">My Appointments</Button>
                </Link>
                <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
              </>
            ) : (
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Emergency Alerts Banner */}
      {emergencyRequests.length > 0 && (
        <section className="bg-red-600 text-white py-3">
          <div className="container mx-auto px-4 flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <span className="font-medium">{emergencyRequests.length} Active Emergency Request{emergencyRequests.length > 1 ? 's' : ''}</span>
            <a href="#emergencies" className="underline ml-2">View Now</a>
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-background dark:from-red-950/20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
              <Droplet className="w-12 h-12 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blood Bank Supply</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Check real-time blood availability, find nearby blood banks, and schedule your donation appointment.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Dialog open={donationDialogOpen} onOpenChange={setDonationDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  <Heart className="w-5 h-5 mr-2" />
                  Donate Blood
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule Blood Donation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Select Blood Bank *</Label>
                    <Select value={selectedBank} onValueChange={setSelectedBank}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a blood bank" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodBanks.map(bank => (
                          <SelectItem key={bank.id} value={bank.id}>{bank.name} - {bank.city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Your Blood Type *</Label>
                    <Select value={donationBloodType} onValueChange={setDonationBloodType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOOD_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Date</Label>
                    <Input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Notes</Label>
                    <Textarea 
                      placeholder="Any medical conditions or preferences..." 
                      value={notes} 
                      onChange={(e) => setNotes(e.target.value)} 
                    />
                  </div>
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700" 
                    onClick={handleDonationRequest}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Donation Request"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            {user && (
              <>
                <EmergencyRequestDialog userId={user.id} onSuccess={fetchEmergencyRequests} />
                <DonorProfileSetup 
                  userId={user.id} 
                  trigger={
                    <Button variant="outline" size="lg" className="gap-2">
                      <Bell className="w-5 h-5" />
                      Donor Settings
                    </Button>
                  }
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Emergency Requests Section */}
      {emergencyRequests.length > 0 && (
        <section id="emergencies" className="py-12 bg-red-50/50 dark:bg-red-950/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold">Emergency Blood Requests</h2>
              <Badge variant="destructive" className="ml-2">{emergencyRequests.length} Active</Badge>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {emergencyRequests.map(request => (
                <EmergencyRequestCard 
                  key={request.id} 
                  request={request} 
                  onRespond={handleRespondToEmergency}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="availability" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="availability">Blood Availability</TabsTrigger>
              <TabsTrigger value="locations">Blood Banks</TabsTrigger>
            </TabsList>

            <TabsContent value="availability" className="space-y-6">
              {/* Blood Type Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                {groupedByBloodType.map(({ type, totalUnits }) => {
                  const status = getAvailabilityStatus(totalUnits);
                  return (
                    <Card 
                      key={type} 
                      className={`cursor-pointer transition-all hover:scale-105 ${selectedBloodType === type ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setSelectedBloodType(selectedBloodType === type ? "all" : type)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">{type}</div>
                        <div className="text-sm text-muted-foreground">{totalUnits} units</div>
                        <div className={`w-full h-1.5 rounded-full mt-2 ${status.color}`} />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Detailed Inventory */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Detailed Inventory</span>
                    {selectedBloodType !== "all" && (
                      <Button variant="ghost" size="sm" onClick={() => setSelectedBloodType("all")}>
                        Show All
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredInventory.map(item => {
                      const status = getAvailabilityStatus(item.units_available);
                      return (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-semibold">{item.blood_banks?.name}</div>
                            <div className="text-sm text-muted-foreground">{item.blood_banks?.city}</div>
                          </div>
                          <div className="text-right">
                            <Badge className="text-lg px-3 py-1" variant={status.variant}>
                              {item.blood_type}
                            </Badge>
                            <div className="text-sm mt-1">{item.units_available} units</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="locations" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bloodBanks.map(bank => (
                  <Card key={bank.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-red-600" />
                        {bank.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <span>{bank.address}, {bank.city}</span>
                      </div>
                      {bank.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{bank.phone}</span>
                        </div>
                      )}
                      {bank.operating_hours && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{bank.operating_hours}</span>
                        </div>
                      )}
                      <div className="pt-2">
                        <div className="text-xs text-muted-foreground mb-2">Available Blood Types:</div>
                        <div className="flex flex-wrap gap-1">
                          {inventory
                            .filter(item => item.blood_bank_id === bank.id && item.units_available > 0)
                            .map(item => (
                              <Badge key={item.id} variant="outline" className="text-xs">
                                {item.blood_type}: {item.units_available}
                              </Badge>
                            ))}
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-4" 
                        variant="outline"
                        onClick={() => {
                          setSelectedBank(bank.id);
                          setDonationDialogOpen(true);
                        }}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Donation
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Clinexa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}