import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Users, Target, CreditCard, Gift, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const donationAmounts = [
  { amount: 500, label: 'KES 500', description: 'Help 5 professionals get verified' },
  { amount: 1000, label: 'KES 1,000', description: 'Support 10 skill cards creation' },
  { amount: 2500, label: 'KES 2,500', description: 'Fund platform development' },
  { amount: 5000, label: 'KES 5,000', description: 'Support marketing campaigns' },
];

export default function DonatePage() {
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finalAmount = selectedAmount || parseInt(customAmount) || 0;

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!donorName) {
      toast({
        title: "Name required",
        description: "Please enter your name for the donation.",
        variant: "destructive",
      });
      return;
    }

    if (finalAmount < 50) {
      toast({
        title: "Minimum amount",
        description: "Please donate at least KES 50.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Here we would normally:
      // 1. Process payment via Mpesa
      // 2. Save donation record in database
      // 3. Send confirmation
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Thank you for your donation!",
        description: `You'll receive an Mpesa prompt for KES ${finalAmount}. Your support helps skilled professionals across Africa.`,
      });

      // Reset form
      setSelectedAmount(null);
      setCustomAmount('');
      setDonorName('');
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Support <span className="text-accent">Skill Card Africa</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your donations help us keep the platform accessible for skilled professionals 
          across Africa and fund new features that benefit our community.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Donation Form */}
        <div>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-accent" />
                <span>Make a Donation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDonationSubmit} className="space-y-6">
                {/* Donor Name */}
                <div className="space-y-2">
                  <Label htmlFor="donorName">Your Name *</Label>
                  <Input
                    id="donorName"
                    placeholder="Enter your name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Your name will be recorded for our records and thank you message.
                  </p>
                </div>

                {/* Preset Amounts */}
                <div className="space-y-3">
                  <Label>Select Donation Amount</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {donationAmounts.map((donation) => (
                      <button
                        key={donation.amount}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(donation.amount);
                          setCustomAmount('');
                        }}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedAmount === donation.amount
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="font-semibold">{donation.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {donation.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div className="space-y-2">
                  <Label htmlFor="customAmount">Or Enter Custom Amount (KES)</Label>
                  <Input
                    id="customAmount"
                    type="number"
                    placeholder="Enter amount in KES"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    min="50"
                  />
                </div>

                {/* Payment Method */}
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <span className="font-medium">Payment Method</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Payment via Mpesa to <strong>0794780808</strong>. You'll receive an STK push 
                    prompt after clicking donate.
                  </p>
                </div>

                {/* Donation Summary */}
                {finalAmount > 0 && (
                  <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Donation Amount:</span>
                      <span className="font-bold text-accent">KES {finalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting || finalAmount < 50}
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Gift className="w-4 h-4 mr-2" />
                      Donate {finalAmount > 0 ? `KES ${finalAmount.toLocaleString()}` : ''}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Impact Information */}
        <div className="space-y-6">
          {/* Why Donate */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-primary" />
                <span>Why Your Donation Matters</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-verified mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Keep It Affordable</h4>
                    <p className="text-sm text-muted-foreground">
                      Help us keep verification fees low so more professionals can afford to join.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-verified mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Platform Development</h4>
                    <p className="text-sm text-muted-foreground">
                      Fund new features like user messaging, reviews, and mobile apps.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-verified mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Marketing & Outreach</h4>
                    <p className="text-sm text-muted-foreground">
                      Help us reach more skilled professionals and potential clients across Africa.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-verified mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Training & Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Provide resources to help professionals improve their skills and ratings.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Stats */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Your Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">KES 100</div>
                    <div className="text-xs text-muted-foreground">Helps 1 professional get verified</div>
                  </div>
                  <div className="text-center p-4 bg-accent/5 rounded-lg">
                    <div className="text-2xl font-bold text-accent">KES 500</div>
                    <div className="text-xs text-muted-foreground">Supports 5 skill cards</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Every donation, no matter the size, makes a real difference in someone's life.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recognition */}
          <Card className="hero-gradient text-primary-foreground shadow-hero">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-8 h-8" />
                <div>
                  <h3 className="text-xl font-semibold">Join Our Supporters</h3>
                  <p className="opacity-90">Become part of the movement empowering Africa's skilled workforce</p>
                </div>
              </div>
              <div className="space-y-2 text-sm opacity-90">
                <p>✓ Donation receipt via email</p>
                <p>✓ Updates on platform progress</p>
                <p>✓ Recognition as a platform supporter</p>
              </div>
            </CardContent>
          </Card>

          {/* Note about backend */}
          <Card className="bg-muted/30">
            <CardContent className="p-4 text-sm text-muted-foreground">
              <p className="font-medium mb-2">📋 Note:</p>
              <p>
                This donation form shows the interface. To enable Mpesa payments and 
                donation tracking, connect this project to Supabase using the integration button.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}