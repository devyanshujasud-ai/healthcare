import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, MapPin, Phone, Droplet } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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

interface EmergencyRequestCardProps {
  request: EmergencyRequest;
  onRespond?: (requestId: string) => void;
}

const urgencyColors = {
  critical: "bg-red-600 text-white animate-pulse",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-500 text-black",
};

export function EmergencyRequestCard({ request, onRespond }: EmergencyRequestCardProps) {
  const timeLeft = formatDistanceToNow(new Date(request.expires_at), { addSuffix: true });
  const createdAgo = formatDistanceToNow(new Date(request.created_at), { addSuffix: true });

  return (
    <Card className="border-2 border-red-200 dark:border-red-900 bg-gradient-to-br from-red-50/50 to-background dark:from-red-950/20">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <CardTitle className="text-lg">Emergency Blood Request</CardTitle>
          </div>
          <Badge className={urgencyColors[request.urgency_level as keyof typeof urgencyColors]}>
            {request.urgency_level.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30">
            <span className="text-2xl font-bold text-red-600">{request.blood_type}</span>
          </div>
          <div>
            <div className="text-lg font-semibold">{request.units_needed} units needed</div>
            {request.patient_name && (
              <div className="text-sm text-muted-foreground">For: {request.patient_name}</div>
            )}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{request.hospital_name}</span>
          </div>
          {request.hospital_address && (
            <div className="ml-6 text-muted-foreground">{request.hospital_address}</div>
          )}
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <a href={`tel:${request.contact_phone}`} className="text-primary hover:underline">
              {request.contact_phone}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>Posted {createdAgo} • Expires {timeLeft}</span>
          </div>
        </div>

        {request.notes && (
          <div className="p-3 bg-muted rounded-lg text-sm">
            <strong>Notes:</strong> {request.notes}
          </div>
        )}

        {onRespond && (
          <Button 
            className="w-full bg-red-600 hover:bg-red-700" 
            onClick={() => onRespond(request.id)}
          >
            <Droplet className="w-4 h-4 mr-2" />
            I Can Donate
          </Button>
        )}
      </CardContent>
    </Card>
  );
}