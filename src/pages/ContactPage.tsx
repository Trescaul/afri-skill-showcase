import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Here we would normally send the message to afriskill@gmail.com
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Message sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Get in <span className="text-accent">Touch</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have questions about Skill Card Africa? Need help with your skill card? 
          Want to partner with us? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <span>Send us a Message</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What is your message about?"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={6}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          {/* Direct Contact */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Direct Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 hero-gradient rounded-lg">
                  <Mail className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <a 
                    href="mailto:afriskill@gmail.com" 
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    afriskill@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 hero-gradient rounded-lg">
                  <Phone className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Phone</p>
                  <a 
                    href="tel:0794780808" 
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    0794780808
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 hero-gradient rounded-lg">
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Coverage Area</p>
                  <p className="text-muted-foreground">Across Africa</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Response Times */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-accent" />
                <span>Response Times</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="font-medium">Email inquiries</span>
                  <span className="text-primary font-medium">Within 24 hours</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="font-medium">Phone calls</span>
                  <span className="text-primary font-medium">9 AM - 6 PM EAT</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="font-medium">Technical support</span>
                  <span className="text-primary font-medium">Within 48 hours</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Common Questions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Common Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-medium text-foreground">How do I create a skill card?</h4>
                  <p className="text-sm text-muted-foreground">
                    Visit our "Create Skill Card" page, fill in your details, upload a photo, 
                    and pay the 100 KES verification fee via Mpesa.
                  </p>
                </div>
                <div className="border-l-4 border-accent pl-4">
                  <h4 className="font-medium text-foreground">How do I increase my star rating?</h4>
                  <p className="text-sm text-muted-foreground">
                    Provide excellent service to clients who contact you through the platform. 
                    Positive reviews and consistent work quality will improve your rating.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-medium text-foreground">Can I edit my skill card?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, contact us with your updates and we'll help you modify your skill card 
                    information. Future updates will allow self-editing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partnership */}
          <Card className="hero-gradient text-primary-foreground shadow-hero">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                Interested in Partnership?
              </h3>
              <p className="mb-4 opacity-90">
                We're always looking for organizations, NGOs, and businesses 
                who share our vision of empowering skilled professionals across Africa.
              </p>
              <Button variant="accent" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Discuss Partnership
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}