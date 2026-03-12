import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface AdvancedFiltersProps {
  minFee: number;
  maxFee: number;
  minRating: number;
  minExperience: number;
  onMinFeeChange: (value: number) => void;
  onMaxFeeChange: (value: number) => void;
  onMinRatingChange: (value: number) => void;
  onMinExperienceChange: (value: number) => void;
}

export const AdvancedFilters = ({
  minFee,
  maxFee,
  minRating,
  minExperience,
  onMinFeeChange,
  onMaxFeeChange,
  onMinRatingChange,
  onMinExperienceChange,
}: AdvancedFiltersProps) => {
  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-lg font-bold">Advanced Filters</h3>

      <div>
        <Label className="mb-3 flex items-center justify-between">
          <span>Consultation Fee Range</span>
          <span className="text-sm text-muted-foreground">
            ${minFee} - ${maxFee}
          </span>
        </Label>
        <div className="space-y-4">
          <div>
            <Label className="text-sm mb-2 block">Min: ${minFee}</Label>
            <Slider
              value={[minFee]}
              onValueChange={(v) => onMinFeeChange(v[0])}
              min={0}
              max={500}
              step={10}
            />
          </div>
          <div>
            <Label className="text-sm mb-2 block">Max: ${maxFee}</Label>
            <Slider
              value={[maxFee]}
              onValueChange={(v) => onMaxFeeChange(v[0])}
              min={0}
              max={500}
              step={10}
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="mb-3 flex items-center justify-between">
          <span>Minimum Rating</span>
          <span className="text-sm text-muted-foreground">
            {minRating}+ stars
          </span>
        </Label>
        <Slider
          value={[minRating]}
          onValueChange={(v) => onMinRatingChange(v[0])}
          min={0}
          max={5}
          step={0.5}
        />
      </div>

      <div>
        <Label className="mb-3 flex items-center justify-between">
          <span>Minimum Experience</span>
          <span className="text-sm text-muted-foreground">
            {minExperience}+ years
          </span>
        </Label>
        <Slider
          value={[minExperience]}
          onValueChange={(v) => onMinExperienceChange(v[0])}
          min={0}
          max={30}
          step={1}
        />
      </div>
    </Card>
  );
};