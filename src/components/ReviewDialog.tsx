import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ReviewDialogProps {
  appointmentId: string;
  doctorId: string;
  patientId: string;
  onReviewSubmitted: () => void;
}

export const ReviewDialog = ({ appointmentId, doctorId, patientId, onReviewSubmitted }: ReviewDialogProps) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      appointment_id: appointmentId,
      doctor_id: doctorId,
      patient_id: patientId,
      rating,
      comment: comment || null,
    });

    if (error) {
      toast({
        title: "Error submitting review",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback",
      });
      setOpen(false);
      setRating(0);
      setComment("");
      onReviewSubmitted();
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Leave Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate Your Experience</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Rating</label>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setRating(i + 1)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      i < rating ? "fill-accent text-accent" : "text-muted"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Comment (Optional)</label>
            <Textarea
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
          <Button onClick={handleSubmit} disabled={submitting} className="w-full">
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};