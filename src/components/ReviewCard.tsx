import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface ReviewCardProps {
  patientName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const ReviewCard = ({ patientName, rating, comment, createdAt }: ReviewCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold text-lg">
          {patientName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">{patientName}</h4>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </span>
          </div>
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < rating ? "fill-accent text-accent" : "text-muted"
                }`}
              />
            ))}
          </div>
          {comment && <p className="text-muted-foreground">{comment}</p>}
        </div>
      </div>
    </Card>
  );
};