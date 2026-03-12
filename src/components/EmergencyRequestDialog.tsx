import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Loader2 } from "lucide-react";

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

interface EmergencyRequestDialogProps {
  userId: string;
  onSuccess?: () => void;
}

export function EmergencyRequestDialog({ userId, onSuccess }: EmergencyRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    blood_type: "",
    units_needed: "1",
    urgency_level: "high",
    patient_name: "",
    hospital_name: "",
    hospital_address: "",
    contact_phone: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.blood_type || !formData.hospital_name || !formData.contact_phone) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("emergency_blood_requests" as any).insert({
      requester_id: userId,
      blood_type: formData.blood_type,
      units_needed: parseInt(formData.units_needed),
      urgency_level: formData.urgency_level,
      patient_name: formData.patient_name || null,
      hospital_name: formData.hospital_name,
      hospital_address: formData.hospital_address || null,
      contact_phone: formData.contact_phone,
      notes: formData.notes || null,
    });

    setLoading(false);
    
    if (error) {
      toast({ title: "Failed to create request", description: error.message, variant: "destructive" });
    } else {
      toast({ 
        title: "Emergency request created!", 
        description: "Nearby donors will be notified immediately." 
      });
      setOpen(false);
      setFormData({
        blood_type: "",
        units_needed: "1",
        urgency_level: "high",
        patient_name: "",
        hospital_name: "",
        hospital_address: "",
        contact_phone: "",
        notes: "",
      });
      onSuccess?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="lg" className="gap-2">
          <AlertTriangle className="w-5 h-5" />
          Emergency Request
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Create Emergency Blood Request
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Blood Type *</Label>
              <Select 
                value={formData.blood_type} 
                onValueChange={(v) => setFormData({...formData, blood_type: v})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Units Needed *</Label>
              <Input 
                type="number" 
                min="1" 
                max="10"
                value={formData.units_needed}
                onChange={(e) => setFormData({...formData, units_needed: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Urgency Level *</Label>
            <Select 
              value={formData.urgency_level} 
              onValueChange={(v) => setFormData({...formData, urgency_level: v})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical - Immediate</SelectItem>
                <SelectItem value="high">High - Within hours</SelectItem>
                <SelectItem value="medium">Medium - Within 24 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Patient Name (Optional)</Label>
            <Input 
              placeholder="Patient's name"
              value={formData.patient_name}
              onChange={(e) => setFormData({...formData, patient_name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Hospital/Clinic Name *</Label>
            <Input 
              placeholder="e.g., City General Hospital"
              value={formData.hospital_name}
              onChange={(e) => setFormData({...formData, hospital_name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Hospital Address</Label>
            <Input 
              placeholder="Full address"
              value={formData.hospital_address}
              onChange={(e) => setFormData({...formData, hospital_address: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Contact Phone *</Label>
            <Input 
              type="tel"
              placeholder="+1-555-0000"
              value={formData.contact_phone}
              onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Additional Notes</Label>
            <Textarea 
              placeholder="Any additional information for donors..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Emergency Request"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}