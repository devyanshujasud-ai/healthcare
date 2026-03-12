import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Star, MapPin, DollarSign, Search } from "lucide-react";
import { AdvancedFilters } from "@/components/AdvancedFilters";
import { Logo } from "@/components/Logo";

interface Doctor {
  id: string;
  name: string;
  image_url: string;
  rating: number;
  reviews_count: number;
  consultation_fee: number;
  experience_years: number;
  qualification: string;
  address: string;
  city: string;
  specialization: {
    name: string;
    icon: string;
  };
}

const Doctors = () => {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState(
    searchParams.get("specialization") || "all"
  );
  const [minFee, setMinFee] = useState(0);
  const [maxFee, setMaxFee] = useState(500);
  const [minRating, setMinRating] = useState(0);
  const [minExperience, setMinExperience] = useState(0);

  useEffect(() => {
    fetchSpecializations();
    fetchDoctors();
  }, [selectedSpecialization]);

  const fetchSpecializations = async () => {
    const { data } = await supabase
      .from("specializations")
      .select("*")
      .order("name");
    if (data) setSpecializations(data);
  };

  const fetchDoctors = async () => {
    setLoading(true);
    let query = supabase
      .from("doctors")
      .select(`
        *,
        specialization:specializations(name, icon)
      `)
      .order("rating", { ascending: false });

    if (selectedSpecialization !== "all") {
      query = query.eq("specialization_id", selectedSpecialization);
    }

    const { data, error } = await query;
    
    if (data) {
      setDoctors(data);
    }
    setLoading(false);
  };

  const filteredDoctors = doctors.filter((doctor) =>
    (doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    doctor.consultation_fee >= minFee &&
    doctor.consultation_fee <= maxFee &&
    doctor.rating >= minRating &&
    doctor.experience_years >= minExperience
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          <Button variant="ghost" asChild>
            <Link to="/">← Back to Home</Link>
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Find Your Doctor</h1>
          <p className="text-muted-foreground text-lg">
            Browse through our network of verified healthcare professionals
          </p>
        </div>

        {/* Filters */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search by doctor name or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  {specializations.map((spec: any) => (
                    <SelectItem key={spec.id} value={spec.id}>
                      {spec.icon} {spec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <AdvancedFilters
            minFee={minFee}
            maxFee={maxFee}
            minRating={minRating}
            minExperience={minExperience}
            onMinFeeChange={setMinFee}
            onMaxFeeChange={setMaxFee}
            onMinRatingChange={setMinRating}
            onMinExperienceChange={setMinExperience}
          />
        </div>

        {/* Results count */}
        <p className="text-muted-foreground mb-6">
          Found {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? "s" : ""}
        </p>

        {/* Doctors Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="w-full h-48 bg-muted rounded-lg mb-4" />
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </Card>
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No doctors found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Link key={doctor.id} to={`/doctor/${doctor.id}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full border-2 hover:border-primary cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={doctor.image_url}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full flex items-center gap-1 font-semibold">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span>{doctor.rating}</span>
                      <span className="text-muted-foreground text-sm">
                        ({doctor.reviews_count})
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-3xl mb-2">{doctor.specialization.icon}</div>
                    <h3 className="font-bold text-xl mb-1">{doctor.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {doctor.specialization.name} • {doctor.experience_years} years exp
                    </p>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                      {doctor.qualification}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{doctor.address}, {doctor.city}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-1 font-semibold text-primary">
                        <DollarSign className="w-5 h-5" />
                        <span>{doctor.consultation_fee}</span>
                      </div>
                      <Button size="sm">Book Now</Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
