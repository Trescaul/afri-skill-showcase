import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SkillCard from '@/components/SkillCard';
import type { SkillCardData } from '@/components/SkillCard';
import { 
  Hammer, 
  Scissors, 
  Tractor, 
  Code, 
  Wrench, 
  PaintBucket, 
  Star, 
  Users, 
  Shield, 
  TrendingUp 
} from 'lucide-react';

// Sample featured skill cards
const featuredSkillCards: SkillCardData[] = [
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
];

const skillCategories = [
  { icon: Hammer, name: 'Carpentry', count: '2,450+' },
  { icon: Scissors, name: 'Tailoring', count: '1,890+' },
  { icon: Tractor, name: 'Farming', count: '3,200+' },
  { icon: Code, name: 'Technology', count: '1,200+' },
  { icon: Wrench, name: 'Mechanics', count: '2,100+' },
  { icon: PaintBucket, name: 'Painting', count: '1,750+' },
];

export default function HomePage() {
  const handleContactSkillCard = (skillCard: SkillCardData) => {
    // This would open a contact modal - for now just log
    console.log('Contact:', skillCard.name);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="hero-gradient">
          <div className="container mx-auto px-4 py-20 md:py-28">
            <div className="max-w-4xl mx-auto text-center text-primary-foreground">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Show Your Skill.<br />
                Be Seen. <span className="text-accent">Be Hired.</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                Create your digital skill card, showcase your expertise, build trust through our star rating system, 
                and connect with opportunities across Africa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="accent" size="lg" className="text-lg px-8">
                  <Link to="/create">Create Your Skill Card</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Link to="/gallery">Browse Gallery</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-accent/20 rounded-full blur-xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary-foreground/10 rounded-full blur-2xl" />
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Users, number: '12,000+', label: 'Skilled Professionals' },
            { icon: Star, number: '98%', label: 'Success Rate' },
            { icon: Shield, number: '100%', label: 'Verified Skills' },
          ].map((stat, index) => (
            <Card key={index} className="text-center shadow-card hover:shadow-featured transition-all duration-300">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 hero-gradient rounded-lg mb-4">
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Skill Categories */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore Skill Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover talented professionals across various industries and skills
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {skillCategories.map((category) => (
            <Link 
              key={category.name}
              to={`/gallery?category=${category.name.toLowerCase()}`}
              className="group"
            >
              <Card className="text-center hover:shadow-lg transition-all duration-300 group-hover:scale-105 border-2 border-transparent group-hover:border-primary/20">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 group-hover:hero-gradient rounded-lg mb-4 transition-all duration-300">
                    <category.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} professionals</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Professionals */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Top Skilled Professionals
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet our most trusted and highly-rated professionals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSkillCards.map((skillCard) => (
            <SkillCard 
              key={skillCard.id}
              skillCard={skillCard}
              onContact={handleContactSkillCard}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link to="/gallery">
              View All Professionals
              <TrendingUp className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How Skill Card Africa Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to showcase your skills and get hired
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Create Your Skill Card',
                description: 'Fill out your profile with your skills, experience, and photo. Pay a small verification fee of 100 KES.',
              },
              {
                step: '2',
                title: 'Get Verified & Rated',
                description: 'Receive your verified badge and start with 1 star. Build your reputation through quality work and client reviews.',
              },
              {
                step: '3',
                title: 'Connect & Earn',
                description: 'Clients find you through our gallery, contact you directly, and hire you for projects. Build lasting professional relationships.',
              },
            ].map((item, index) => (
              <Card key={index} className="text-center shadow-card">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 hero-gradient text-primary-foreground text-xl font-bold rounded-full mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 text-center">
        <Card className="hero-gradient text-primary-foreground shadow-hero">
          <CardContent className="p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Showcase Your Skills?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of skilled professionals across Africa who are building trust, 
              growing their reputation, and connecting with opportunities.
            </p>
            <Button asChild variant="accent" size="lg" className="text-lg px-8">
              <Link to="/create">Create Your Skill Card Now</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}