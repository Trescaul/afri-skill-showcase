import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, CreditCard, Shield, Star, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const skillCategories = [
  'Carpentry',
  'Tailoring',
  'Farming',
  'Technology',
  'Mechanics',
  'Painting',
  'Plumbing',
  'Electrical Work',
  'Masonry',
  'Catering',
  'Photography',
  'Driving',
  'Security',
  'Cleaning Services',
  'Beauty & Hair',
  'Other',
];

export default function CreateSkillCardPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    skillCategory: '',
    bio: '',
    location: '',
    phone: '',
    email: '',
    profilePhoto: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'completed' | 'failed'>('idle');
  const [paymentId, setPaymentId] = useState<string | null>(null);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, or WEBP image.",
          variant: "destructive",
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      setFormData(prev => ({ ...prev, profilePhoto: file }));
    }
  };

  // Poll payment status
  const pollPaymentStatus = async (paymentId: string) => {
    const maxAttempts = 30; // Poll for 5 minutes (30 * 10 seconds)
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(
          `https://hjsbrauutylvyyxpvglr.supabase.co/functions/v1/check-payment-status?paymentId=${paymentId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqc2JyYXV1dHlsdnl5eHB2Z2xyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MDQ1NTUsImV4cCI6MjA3MzE4MDU1NX0.KwVlouXAuGo4bpd2ozVlNFtHEUB3VTVwW_om86Ss_2o`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) throw new Error('Failed to check payment status');
        const result = await response.json();
        
        if (result.status === 'completed' && result.skillCardCreated) {
          setPaymentStatus('completed');
          toast({
            title: "Payment Successful!",
            description: "Your skill card has been created and is now live in the gallery.",
          });
          
          // Reset form
          setFormData({
            fullName: '',
            skillCategory: '',
            bio: '',
            location: '',
            phone: '',
            email: '',
            profilePhoto: null,
          });
          
          // Navigate to gallery after success
          setTimeout(() => {
            navigate('/gallery');
          }, 3000);
          return;
        } else if (result.status === 'failed') {
          setPaymentStatus('failed');
          toast({
            title: "Payment Failed",
            description: "Your Mpesa payment was not successful. Please try again.",
            variant: "destructive",
          });
          return;
        }

        // Continue polling if still pending
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          setPaymentStatus('failed');
          toast({
            title: "Payment Timeout",
            description: "Payment verification timed out. Please contact support if you were charged.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000);
        } else {
          setPaymentStatus('failed');
          toast({
            title: "Verification Error",
            description: "Unable to verify payment status. Please contact support.",
            variant: "destructive",
          });
        }
      }
    };

    // Start polling
    setTimeout(poll, 5000); // Wait 5 seconds before first poll
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.skillCategory || !formData.bio || !formData.location || !formData.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.profilePhoto) {
      toast({
        title: "Profile photo required",
        description: "Please upload a profile photo.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setPaymentStatus('pending');

    try {
      // Prepare skill card data
      const skillCardData = {
        name: formData.fullName,
        skill_category: formData.skillCategory,
        bio: formData.bio,
        location: formData.location,
        phone: formData.phone,
        email: formData.email || user?.email || '',
        user_id: user?.id,
      };

      // Initiate Mpesa STK Push
      const { data, error } = await supabase.functions.invoke('mpesa-payment', {
        body: {
          phone: formData.phone,
          amount: 100,
          skillCardData,
        },
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        setPaymentId(data.paymentId);
        toast({
          title: "Payment Request Sent",
          description: "Please check your phone and enter your Mpesa PIN to complete payment.",
        });
        
        // Start polling payment status
        pollPaymentStatus(data.paymentId);
      } else {
        throw new Error(data.error || 'Failed to initiate payment');
      }
      
    } catch (error: any) {
      console.error('Error initiating payment:', error);
      setPaymentStatus('failed');
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate Mpesa payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading if auth is still loading
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  // This shouldn't render if user is not logged in due to useEffect redirect
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Create Your <span className="text-accent">Skill Card</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Showcase your skills to thousands of potential clients across Africa. 
          Get verified, build trust, and start earning.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary" />
                <span>Skill Card Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    required
                  />
                </div>

                {/* Skill Category */}
                <div className="space-y-2">
                  <Label htmlFor="skillCategory">Skill Category *</Label>
                  <Select onValueChange={(value) => handleInputChange('skillCategory', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your primary skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio / Description *</Label>
                  <Textarea
                    id="bio"
                    placeholder="Describe your skills, experience, and what makes you unique..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    {formData.bio.length}/500 characters
                  </p>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="City, Country (e.g., Nairobi, Kenya)"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    required
                  />
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="0712345678"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                </div>

                {/* Profile Photo */}
                <div className="space-y-2">
                  <Label htmlFor="profilePhoto">Profile Photo *</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="profilePhoto"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label 
                      htmlFor="profilePhoto" 
                      className="cursor-pointer flex flex-col items-center space-y-3"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      {formData.profilePhoto ? (
                        <div className="text-sm">
                          <p className="text-primary font-medium">{formData.profilePhoto.name}</p>
                          <p className="text-muted-foreground">Click to change photo</p>
                        </div>
                      ) : (
                        <div className="text-sm">
                          <p className="text-foreground">Click to upload photo</p>
                          <p className="text-muted-foreground">JPG, PNG, or WEBP (Max 5MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Payment Status */}
                {paymentStatus !== 'idle' && (
                  <div className={`p-4 rounded-lg border ${
                    paymentStatus === 'pending' ? 'bg-blue-50 border-blue-200' :
                    paymentStatus === 'completed' ? 'bg-green-50 border-green-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {paymentStatus === 'pending' && (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-blue-800 font-medium">Waiting for Mpesa payment...</span>
                        </>
                      )}
                      {paymentStatus === 'completed' && (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-green-800 font-medium">Payment successful! Skill card created.</span>
                        </>
                      )}
                      {paymentStatus === 'failed' && (
                        <>
                          <span className="text-red-800 font-medium">Payment failed. Please try again.</span>
                        </>
                      )}
                    </div>
                    {paymentStatus === 'pending' && (
                      <p className="text-sm text-blue-600 mt-2">
                        Check your phone for the Mpesa prompt. This may take a few minutes to process.
                      </p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting || paymentStatus === 'pending'}
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : paymentStatus === 'pending' ? (
                    <>Waiting for payment...</>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay with Mpesa (100 KES)
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          {/* Payment Info */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-accent" />
                <span>Payment Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">100 KES</div>
                <p className="text-sm text-muted-foreground">One-time verification fee</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-verified" />
                  <span>Verified badge</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Star className="w-4 h-4 text-star-gold" />
                  <span>1 star rating to start</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Listed in gallery</span>
                </div>
              </div>

              <div className="border-t pt-4 text-xs text-muted-foreground">
                Payment via Mpesa. You'll receive an STK push prompt after clicking submit.
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Why Create a Skill Card?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-3">
                <p className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-verified mt-0.5 flex-shrink-0" />
                  <span>Get discovered by clients looking for your skills</span>
                </p>
                <p className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-verified mt-0.5 flex-shrink-0" />
                  <span>Build trust through our star rating system</span>
                </p>
                <p className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-verified mt-0.5 flex-shrink-0" />
                  <span>Showcase your work to a wider audience</span>
                </p>
                <p className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-verified mt-0.5 flex-shrink-0" />
                  <span>Connect directly with potential clients</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Note about backend */}
          <Card className="bg-muted/30">
            <CardContent className="p-4 text-sm text-muted-foreground">
              <p className="font-medium mb-2">📋 Note:</p>
              <p>
                This form currently shows the interface. To enable payments, photo uploads, 
                and database storage, connect this project to Supabase using the integration button.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}