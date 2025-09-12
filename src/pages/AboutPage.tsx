import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, Target, Award, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 space-y-16">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          About Skill Card <span className="text-accent">Africa</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Empowering skilled professionals across Africa to showcase their talents, build trust, 
          and connect with opportunities that matter.
        </p>
      </section>

      {/* Founder Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground">Meet Our Founder</h2>
            <h3 className="text-2xl font-semibold text-primary">Francis Ndungu</h3>
          </div>
          
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Francis Ndungu founded Skill Card Africa with a simple but powerful vision: 
              to create a platform where skilled professionals across Africa can showcase 
              their expertise and build meaningful connections with clients who value quality work.
            </p>
            <p>
              Having witnessed countless talented individuals struggle to find recognition 
              for their skills simply because they lacked formal certificates, Francis 
              recognized the need for a trust-based system that values proven ability 
              over paper credentials.
            </p>
            <p>
              "In Africa, we have incredible talent in every field - from master carpenters 
              who can create beautiful furniture with their hands, to innovative farmers 
              who feed communities, to skilled tailors who preserve our cultural heritage. 
              Skill Card Africa exists to ensure these talents are seen, valued, and rewarded."
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="hero">
              <Link to="/contact">Get in Touch</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/create">Create Your Skill Card</Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <Card className="shadow-featured">
            <CardContent className="p-8">
              <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 hero-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">Francis Ndungu</h4>
                  <p className="text-muted-foreground">Founder & Visionary</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-card hover:shadow-featured transition-all duration-300">
          <CardContent className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 hero-gradient rounded-lg">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To democratize access to opportunities for skilled professionals across Africa 
              by providing a trusted platform where talent is recognized, verified, and 
              rewarded based on proven ability rather than formal credentials alone.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-featured transition-all duration-300">
          <CardContent className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 hero-gradient rounded-lg">
                <Award className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              A thriving African continent where every skilled professional has equal 
              opportunity to showcase their talents, build sustainable livelihoods, 
              and contribute to economic growth through a trust-based digital ecosystem.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Why We Exist */}
      <section className="bg-muted/30 -mx-4 px-4 py-16 rounded-2xl">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Why Skill Card Africa Exists
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: Users,
                title: 'Skills Over Certificates',
                description: 'We believe in proven ability over paper qualifications. Many of Africa\'s most skilled professionals learned through experience, mentorship, and practice.',
              },
              {
                icon: Heart,
                title: 'Building Trust',
                description: 'Our star rating system creates trust between clients and professionals, ensuring quality work and fair opportunities for everyone.',
              },
              {
                icon: Target,
                title: 'Economic Empowerment',
                description: 'By connecting skilled professionals with clients who value quality, we help create sustainable livelihoods and drive economic growth across Africa.',
              },
            ].map((item, index) => (
              <Card key={index} className="text-center shadow-card">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 hero-gradient rounded-lg mb-4">
                    <item.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section>
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          Our Core Values
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'Authenticity',
              description: 'We celebrate genuine skills and real experience. Every profile on our platform represents a real person with proven abilities.',
            },
            {
              title: 'Trust & Transparency',
              description: 'Our verification process and rating system ensure transparency, building trust between professionals and clients.',
            },
            {
              title: 'Inclusivity',
              description: 'We welcome skilled professionals from all backgrounds, regardless of formal education or traditional certifications.',
            },
            {
              title: 'Excellence',
              description: 'We encourage continuous improvement and celebrate those who consistently deliver high-quality work.',
            },
            {
              title: 'Community',
              description: 'We foster a supportive community where professionals can learn from each other and grow together.',
            },
            {
              title: 'Innovation',
              description: 'We embrace technology to make it easier for skilled professionals to connect with opportunities across Africa.',
            },
          ].map((value, index) => (
            <Card key={index} className="shadow-card hover:shadow-featured transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="text-center">
        <Card className="hero-gradient text-primary-foreground shadow-hero">
          <CardContent className="p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Have Questions or Want to Partner?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              We'd love to hear from you. Whether you're a skilled professional looking to showcase 
              your talents or a client seeking quality services, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="accent" size="lg">
                <Link to="/contact">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Us
                </Link>
              </Button>
              <div className="flex items-center justify-center space-x-2 text-primary-foreground/80">
                <Phone className="w-4 h-4" />
                <span>0794780808</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}