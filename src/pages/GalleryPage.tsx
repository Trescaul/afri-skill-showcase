import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SkillCard from '@/components/SkillCard';
import type { SkillCardData } from '@/components/SkillCard';
import { Search, Filter, Users, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Extended sample skill cards for gallery
const sampleSkillCards: SkillCardData[] = [
  {
    id: '1',
    name: 'John Kariuki',
    skillCategory: 'Carpentry',
    bio: 'Master carpenter with 15+ years experience in furniture making and home construction. Specializes in custom wooden furniture and kitchen cabinets.',
    location: 'Nairobi, Kenya',
    phone: '0722123456',
    email: 'john.kariuki@example.com',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    starRating: 5,
    isVerified: true,
    joinDate: '2023-06-15',
  },
  {
    id: '2',
    name: 'Amara Diallo',
    skillCategory: 'Tailoring',
    bio: 'Expert fashion designer and tailor creating beautiful African-inspired clothing. Specializes in traditional wear and modern fashion fusion.',
    location: 'Lagos, Nigeria',
    phone: '0803456789',
    email: 'amara.diallo@example.com',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b434?w=400&h=400&fit=crop&crop=face',
    starRating: 5,
    isVerified: true,
    joinDate: '2023-03-22',
  },
  {
    id: '3',
    name: 'Moses Mbeki',
    skillCategory: 'Farming',
    bio: 'Sustainable agriculture specialist with expertise in modern farming techniques. Helps farmers increase yield using organic methods.',
    location: 'Cape Town, South Africa',
    phone: '0824567890',
    email: 'moses.mbeki@example.com',
    profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    starRating: 4,
    isVerified: true,
    joinDate: '2023-08-10',
  },
  {
    id: '4',
    name: 'Grace Wanjiku',
    skillCategory: 'Technology',
    bio: 'Full-stack developer and digital solutions expert. Creates websites and mobile apps for small businesses across East Africa.',
    location: 'Kampala, Uganda',
    phone: '0701234567',
    email: 'grace.wanjiku@example.com',
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    starRating: 4,
    isVerified: true,
    joinDate: '2023-09-05',
  },
  {
    id: '5',
    name: 'Ahmed Hassan',
    skillCategory: 'Mechanics',
    bio: 'Certified automotive technician specializing in engine repair and maintenance. 12 years experience with all vehicle types.',
    location: 'Cairo, Egypt',
    phone: '01012345678',
    email: 'ahmed.hassan@example.com',
    profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    starRating: 4,
    isVerified: true,
    joinDate: '2023-07-18',
  },
  {
    id: '6',
    name: 'Fatou Sall',
    skillCategory: 'Painting',
    bio: 'Professional painter and decorator with artistic flair. Specializes in interior design and custom wall art for homes and offices.',
    location: 'Dakar, Senegal',
    phone: '0771234567',
    email: 'fatou.sall@example.com',
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    starRating: 3,
    isVerified: true,
    joinDate: '2023-10-12',
  },
  {
    id: '7',
    name: 'David Okafor',
    skillCategory: 'Plumbing',
    bio: 'Licensed plumber with expertise in residential and commercial installations. Quick response for emergency repairs.',
    location: 'Abuja, Nigeria',
    phone: '0812345678',
    email: 'david.okafor@example.com',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    starRating: 3,
    isVerified: true,
    joinDate: '2023-11-20',
  },
  {
    id: '8',
    name: 'Asha Mohamed',
    skillCategory: 'Catering',
    bio: 'Professional chef specializing in East African cuisine. Provides catering services for events, weddings, and corporate functions.',
    location: 'Dar es Salaam, Tanzania',
    phone: '0754321098',
    email: 'asha.mohamed@example.com',
    profilePhoto: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop&crop=face',
    starRating: 5,
    isVerified: true,
    joinDate: '2023-05-08',
  },
];

const skillCategories = [
  'All Categories',
  'Carpentry',
  'Tailoring', 
  'Farming',
  'Technology',
  'Mechanics',
  'Painting',
  'Plumbing',
  'Catering',
  'Photography',
  'Driving',
  'Security',
  'Cleaning Services',
  'Beauty & Hair',
];

const locations = [
  'All Locations',
  'Kenya',
  'Nigeria', 
  'South Africa',
  'Uganda',
  'Egypt',
  'Senegal',
  'Tanzania',
  'Ghana',
  'Morocco',
];

export default function GalleryPage() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All Categories'
  );
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [sortBy, setSortBy] = useState('rating');

  // Filter and sort skill cards
  const filteredAndSortedCards = useMemo(() => {
    let filtered = sampleSkillCards.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          card.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          card.skillCategory.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All Categories' || 
                            card.skillCategory.toLowerCase() === selectedCategory.toLowerCase();
      
      const matchesLocation = selectedLocation === 'All Locations' ||
                            card.location.toLowerCase().includes(selectedLocation.toLowerCase());
      
      return matchesSearch && matchesCategory && matchesLocation;
    });

    // Sort cards
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.starRating - a.starRating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedLocation, sortBy]);

  const handleContactSkillCard = (skillCard: SkillCardData) => {
    toast({
      title: "Contact Form",
      description: `Opening contact form for ${skillCard.name}. This would show a modal to send a message.`,
    });
  };

  const featuredCount = filteredAndSortedCards.filter(card => card.starRating >= 4).length;

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Skill Card <span className="text-accent">Gallery</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover talented professionals across Africa. Filter by skill category, 
          location, or search for specific expertise.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center p-6 bg-card rounded-lg shadow-card">
          <div className="text-2xl font-bold text-foreground">{filteredAndSortedCards.length}</div>
          <div className="text-muted-foreground">Professionals Found</div>
        </div>
        <div className="text-center p-6 bg-card rounded-lg shadow-card">
          <div className="text-2xl font-bold text-accent">{featuredCount}</div>
          <div className="text-muted-foreground">Featured (4+ Stars)</div>
        </div>
        <div className="text-center p-6 bg-card rounded-lg shadow-card">
          <div className="text-2xl font-bold text-primary">{skillCategories.length - 1}</div>
          <div className="text-muted-foreground">Skill Categories</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg shadow-card p-6 mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Filter & Search</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search by name, skill, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {skillCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Location Filter */}
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="recent">Recently Joined</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {(searchQuery || selectedCategory !== 'All Categories' || selectedLocation !== 'All Locations') && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Categories');
                setSelectedLocation('All Locations');
                setSearchParams({});
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Results */}
      {filteredAndSortedCards.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No professionals found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters or search terms to find what you're looking for.
          </p>
          <Button 
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Categories');
              setSelectedLocation('All Locations');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          {/* Featured Professionals */}
          {featuredCount > 0 && (
            <section className="mb-12">
              <div className="flex items-center space-x-2 mb-6">
                <Star className="w-5 h-5 text-star-gold" />
                <h2 className="text-2xl font-bold text-foreground">Featured Professionals</h2>
                <div className="px-2 py-1 bg-accent/10 text-accent text-sm rounded-md">
                  {featuredCount} professionals
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedCards
                  .filter(card => card.starRating >= 4)
                  .map((skillCard) => (
                    <SkillCard 
                      key={skillCard.id}
                      skillCard={skillCard}
                      onContact={handleContactSkillCard}
                    />
                  ))}
              </div>
            </section>
          )}

          {/* All Professionals */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {featuredCount > 0 ? 'All Professionals' : 'Professionals'}
              </h2>
              <div className="text-muted-foreground">
                Showing {filteredAndSortedCards.length} of {sampleSkillCards.length} professionals
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedCards.map((skillCard) => (
                <SkillCard 
                  key={skillCard.id}
                  skillCard={skillCard}
                  onContact={handleContactSkillCard}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}