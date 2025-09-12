import { Star, MapPin, Shield, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export interface SkillCardData {
  id: string;
  name: string;
  skillCategory: string;
  bio: string;
  location: string;
  phone?: string;
  email?: string;
  profilePhoto: string;
  starRating: number;
  isVerified: boolean;
  joinDate: string;
}

interface SkillCardProps {
  skillCard: SkillCardData;
  onContact: (skillCard: SkillCardData) => void;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating 
              ? 'text-star-gold fill-star-gold' 
              : 'text-muted-foreground'
          }`}
        />
      ))}
      <span className="text-sm text-muted-foreground ml-2">({rating}/5)</span>
    </div>
  );
};

const TrustLevel = ({ rating }: { rating: number }) => {
  const levels = [
    { min: 1, max: 1, label: 'Beginner', color: 'text-muted-foreground' },
    { min: 2, max: 2, label: 'Proven Once', color: 'text-trust-bronze' },
    { min: 3, max: 3, label: 'Consistent Worker', color: 'text-primary' },
    { min: 4, max: 4, label: 'Highly Trusted', color: 'text-trust-silver' },
    { min: 5, max: 5, label: 'Top Professional', color: 'text-trust-gold' },
  ];

  const level = levels.find(l => rating >= l.min && rating <= l.max);
  if (!level) return null;

  return (
    <span className={`text-xs font-medium ${level.color}`}>
      {level.label}
    </span>
  );
};

export default function SkillCard({ skillCard, onContact }: SkillCardProps) {
  const {
    name,
    skillCategory,
    bio,
    location,
    profilePhoto,
    starRating,
    isVerified,
    joinDate,
  } = skillCard;

  const isFeatured = starRating >= 4;

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${
      isFeatured ? 'shadow-featured border-accent/20' : 'shadow-card'
    }`}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Profile Photo */}
          <div className="relative">
            <div className={`w-20 h-20 rounded-full overflow-hidden ring-4 ${
              isFeatured ? 'ring-accent/30' : 'ring-muted/30'
            }`}>
              <img
                src={profilePhoto}
                alt={`${name}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-verified p-1 rounded-full">
                <Shield className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </div>

          {/* Name and Category */}
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-foreground">{name}</h3>
            <div className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-sm rounded-md">
              {skillCategory}
            </div>
          </div>

          {/* Bio */}
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {bio}
          </p>

          {/* Location */}
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{location}</span>
          </div>

          {/* Trust Level & Stars */}
          <div className="space-y-2">
            <TrustLevel rating={starRating} />
            <StarRating rating={starRating} />
          </div>

          {/* Join Date */}
          <p className="text-xs text-muted-foreground">
            Member since {new Date(joinDate).toLocaleDateString()}
          </p>

          {/* Contact Button */}
          <Button
            variant={isFeatured ? "accent" : "default"}
            size="sm"
            onClick={() => onContact(skillCard)}
            className="w-full"
          >
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Contact {name.split(' ')[0]}</span>
            </div>
          </Button>

          {/* Featured Badge */}
          {isFeatured && (
            <div className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
              Featured
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}