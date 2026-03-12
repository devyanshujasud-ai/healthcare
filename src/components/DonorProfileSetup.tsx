import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Settings, Loader2 } from "lucide-react";

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

interface DonorProfileSetupProps {
  userId: string;
  trigger?: React.ReactNode;
}

interface DonorProfile {
  blood_type: string | null;
  city: string | null;
  is_available: boolean;
  receive_emergency_alerts: boolean;
  last_donation_date: string | null;
}

export function DonorProfileSetup({ userId, trigger }: DonorProfileSetupProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const { toast } = useToast();

  const [profile, setProfile] = useState<DonorProfile>({
    blood_type: null,
    city: null,
    is_available: true,
    receive_emergency_alerts: true,
    last_donation_date: null,
  });

  useEffect(() => {
    if (open) {
      fetchProfile();
    }
  }, [open, userId]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("donor_profiles" as any)
      .select("*")
      .eq("user_id", userId)
      .single();

    if (data && !error) {
      setHasProfile(true);
      setProfile(data as unknown as DonorProfile);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    
    const profileData = {
      user_id: userId,
      blood_type: profile.blood_type,
      city: profile.city,
      is_available: profile.is_available,
      receive_emergency_alerts: profile.receive_emergency_alerts,
      last_donation_date: profile.last_donation_date,
    };

    let error;
    if (hasProfile) {
      ({ error } = await supabase
        .from("donor_profiles" as any)
        .update(profileData)
        .eq("user_id", userId));
    } else {
      ({ error } = await supabase.from("donor_profiles" as any).insert(profileData));
    }

    setLoading(false);

    if (error) {
      toast({ title: "Failed to save profile", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Donor profile saved!", description: "You'll receive alerts for matching blood requests." });
      setHasProfile(true);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Donor Settings
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Donor Profile & Notifications
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Your Blood Type</Label>
            <Select 
              value={profile.blood_type || ""} 
              onValueChange={(v) => setProfile({...profile, blood_type: v})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your blood type" />
              </SelectTrigger>
              <SelectContent>
                {BLOOD_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>City</Label>
            <Input 
              placeholder="Your city"
              value={profile.city || ""}
              onChange={(e) => setProfile({...profile, city: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Last Donation Date</Label>
            <Input 
              type="date"
              value={profile.last_donation_date || ""}
              onChange={(e) => setProfile({...profile, last_donation_date: e.target.value || null})}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <div className="font-medium">Available to Donate</div>
              <div className="text-sm text-muted-foreground">Show as available donor</div>
            </div>
            <Switch 
              checked={profile.is_available}
              onCheckedChange={(v) => setProfile({...profile, is_available: v})}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
            <div>
              <div className="font-medium text-red-700 dark:text-red-400">Emergency Alerts</div>
              <div className="text-sm text-muted-foreground">Get notified for urgent blood requests</div>
            </div>
            <Switch 
              checked={profile.receive_emergency_alerts}
              onCheckedChange={(v) => setProfile({...profile, receive_emergency_alerts: v})}
            />
          </div>

          <Button className="w-full" onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Donor Profile"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}