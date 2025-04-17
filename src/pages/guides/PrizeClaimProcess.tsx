
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Trophy, ShieldCheck, Truck, ClipboardCheck, Clock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const PrizeClaimProcess = () => {
  return (
    <PageLayout
      title="Prize Claim Process"
      subtitle="Step-by-step instructions for claiming your prizes after winning"
      className="prose prose-invert prose-headings:text-puzzle-white prose-a:text-puzzle-aqua max-w-4xl"
    >
      <div className="flex items-center text-muted-foreground text-sm mb-6">
        <Link to="/" className="hover:text-puzzle-aqua">Home</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link to="/support" className="hover:text-puzzle-aqua">Support</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-puzzle-aqua">Prize Claim Process</span>
      </div>

      <div className="mb-8">
        <Card className="bg-puzzle-black/30 border-puzzle-aqua/20 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 text-puzzle-aqua mb-4">
              <Trophy className="h-8 w-8" />
              <h2 className="text-2xl font-bold m-0">Congratulations on Your Win!</h2>
            </div>
            <p className="text-muted-foreground">
              You've successfully competed and won a prize on The Puzzle Boss! This guide will walk you through the process of claiming and receiving your prize.
            </p>
          </CardContent>
        </Card>

        <Alert className="bg-puzzle-gold/10 border-puzzle-gold mb-8">
          <AlertTriangle className="h-4 w-4 text-puzzle-gold" />
          <AlertTitle className="text-puzzle-gold">Important</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            All prizes must be claimed within 30 days of winning. After this period, unclaimed prizes may be forfeited.
          </AlertDescription>
        </Alert>

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Prize Claim Timeline</h2>
        <div className="relative border-l-2 border-puzzle-aqua/30 pl-6 ml-4 mb-8">
          <div className="relative mb-8">
            <div className="absolute -left-[30px] bg-puzzle-black p-1 rounded-full border-2 border-puzzle-aqua">
              <Clock className="h-4 w-4 text-puzzle-aqua" />
            </div>
            <h3 className="text-puzzle-white text-xl font-bold mb-2">Winning Notification</h3>
            <p className="text-muted-foreground">
              Immediately after the contest ends, winners are notified via:
            </p>
            <ul className="pl-4 mt-2 space-y-1 text-muted-foreground">
              <li>In-app notification</li>
              <li>Email alert</li>
              <li>Dashboard win banner</li>
            </ul>
          </div>
          
          <div className="relative mb-8">
            <div className="absolute -left-[30px] bg-puzzle-black p-1 rounded-full border-2 border-puzzle-aqua">
              <ShieldCheck className="h-4 w-4 text-puzzle-aqua" />
            </div>
            <h3 className="text-puzzle-white text-xl font-bold mb-2">Identity Verification (1-3 days)</h3>
            <p className="text-muted-foreground">
              Before we can ship your prize, we need to verify your identity to ensure fair play and proper delivery:
            </p>
            <ul className="pl-4 mt-2 space-y-1 text-muted-foreground">
              <li>Upload government-issued ID</li>
              <li>Confirm your shipping address</li>
              <li>Complete any required tax forms (for high-value prizes)</li>
            </ul>
          </div>
          
          <div className="relative mb-8">
            <div className="absolute -left-[30px] bg-puzzle-black p-1 rounded-full border-2 border-puzzle-aqua">
              <ClipboardCheck className="h-4 w-4 text-puzzle-aqua" />
            </div>
            <h3 className="text-puzzle-white text-xl font-bold mb-2">Claim Processing (2-3 days)</h3>
            <p className="text-muted-foreground">
              After verification, our team processes your claim:
            </p>
            <ul className="pl-4 mt-2 space-y-1 text-muted-foreground">
              <li>Prize is reserved in our inventory</li>
              <li>Shipping labels are generated</li>
              <li>You receive a confirmation email with tracking information</li>
            </ul>
          </div>
          
          <div className="relative mb-8">
            <div className="absolute -left-[30px] bg-puzzle-black p-1 rounded-full border-2 border-puzzle-aqua">
              <Truck className="h-4 w-4 text-puzzle-aqua" />
            </div>
            <h3 className="text-puzzle-white text-xl font-bold mb-2">Prize Shipping (7-14 days)</h3>
            <p className="text-muted-foreground">
              Your prize is carefully packaged and shipped:
            </p>
            <ul className="pl-4 mt-2 space-y-1 text-muted-foreground">
              <li>Domestic shipping typically takes 7-10 days</li>
              <li>International shipping may take 10-14 days</li>
              <li>Premium members receive expedited shipping options</li>
            </ul>
          </div>
          
          <div className="relative">
            <div className="absolute -left-[30px] bg-puzzle-black p-1 rounded-full border-2 border-puzzle-aqua">
              <Trophy className="h-4 w-4 text-puzzle-aqua" />
            </div>
            <h3 className="text-puzzle-white text-xl font-bold mb-2">Prize Delivery</h3>
            <p className="text-muted-foreground">
              Your prize arrives at your doorstep! We'll ask you to confirm receipt through your account dashboard.
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Identity Verification Process</h2>
        <p className="text-muted-foreground mb-4">
          Our identity verification process helps ensure the integrity of our competitions and prevents fraud:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-puzzle-black/30 border-puzzle-aqua/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-puzzle-aqua mb-2">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="text-lg font-bold m-0">Why We Verify</h3>
              </div>
              <ul className="pl-4 mt-2 space-y-1 text-muted-foreground text-sm">
                <li>Ensure fair play and prevent cheating</li>
                <li>Confirm prize eligibility based on location</li>
                <li>Prevent duplicate or fraudulent claims</li>
                <li>Comply with legal and tax requirements</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-puzzle-black/30 border-puzzle-aqua/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-puzzle-aqua mb-2">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="text-lg font-bold m-0">What You'll Need</h3>
              </div>
              <ul className="pl-4 mt-2 space-y-1 text-muted-foreground text-sm">
                <li>Government-issued photo ID (passport, driver's license)</li>
                <li>Proof of address (utility bill, bank statement)</li>
                <li>Contest win confirmation email</li>
                <li>Your Puzzle Boss account credentials</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="bg-puzzle-aqua/10 p-6 rounded-lg mb-8">
          <h3 className="text-puzzle-white text-xl font-bold mb-2">Privacy Commitment</h3>
          <p className="text-muted-foreground">
            Your personal information is handled with the utmost care and used solely for prize verification and delivery. We adhere to strict data protection standards and never share your information with third parties except as required to fulfill prize delivery.
          </p>
        </div>

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Shipping Information</h2>
        <p className="text-muted-foreground mb-4">
          Here's what you need to know about prize shipping:
        </p>
        
        <div className="space-y-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-puzzle-aqua/20 p-2 rounded-full mt-1">
              <Truck className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <h3 className="text-puzzle-white text-xl font-bold mb-1">Shipping Costs</h3>
              <p className="text-muted-foreground">
                Standard shipping is free for all prize deliveries. For international winners, any import duties or taxes are the responsibility of the recipient and are not covered by The Puzzle Boss.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-puzzle-aqua/20 p-2 rounded-full mt-1">
              <Truck className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <h3 className="text-puzzle-white text-xl font-bold mb-1">Tracking Your Prize</h3>
              <p className="text-muted-foreground">
                Once your prize ships, you'll receive a tracking number via email. You can also monitor the status of your shipment through your account dashboard.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-puzzle-aqua/20 p-2 rounded-full mt-1">
              <Truck className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <h3 className="text-puzzle-white text-xl font-bold mb-1">Delivery Issues</h3>
              <p className="text-muted-foreground">
                If there are any issues with your delivery (damaged package, wrong address, etc.), contact our support team immediately. We recommend checking your package upon delivery to ensure everything is in order.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Prize Alternatives</h2>
        <p className="text-muted-foreground mb-4">
          In some cases, we offer alternatives to the physical prize:
        </p>
        
        <ul className="space-y-4 mb-8">
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Cash Value Option:</span> For select prizes, winners may choose to receive the cash value instead of the physical item. This option will be presented during the claim process if available.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Alternative Prize:</span> If a specific prize is unavailable due to inventory issues, we'll offer an equivalent or higher value alternative.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Digital Prizes:</span> For digital prizes (gift cards, subscriptions), these will be delivered via email rather than physical shipping.
          </li>
        </ul>

        <Alert className="bg-puzzle-black/30 border-puzzle-aqua/20 mb-8">
          <AlertTriangle className="h-4 w-4 text-puzzle-aqua" />
          <AlertTitle className="text-puzzle-white">Regional Restrictions</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Some prizes may have regional restrictions due to shipping limitations or local regulations. In these cases, alternative prizes of equal value will be offered.
          </AlertDescription>
        </Alert>

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        
        <div className="space-y-4 mb-8">
          <div>
            <h3 className="text-puzzle-white text-xl font-bold mb-1">What happens if I miss the claim deadline?</h3>
            <p className="text-muted-foreground">
              Prizes must be claimed within 30 days of winning. If you fail to complete the verification process within this timeframe, your prize may be forfeited. If there are extenuating circumstances, contact our support team immediately.
            </p>
          </div>
          
          <div>
            <h3 className="text-puzzle-white text-xl font-bold mb-1">Can someone else receive my prize?</h3>
            <p className="text-muted-foreground">
              Prizes must be shipped to the verified address of the account holder. If you need to designate an alternate recipient, you must contact support during the verification process.
            </p>
          </div>
          
          <div>
            <h3 className="text-puzzle-white text-xl font-bold mb-1">Are there tax implications for winning prizes?</h3>
            <p className="text-muted-foreground">
              Yes, depending on your country of residence and the value of the prize, there may be tax implications. For high-value prizes, we may issue tax forms. We recommend consulting with a tax professional regarding your specific situation.
            </p>
          </div>
          
          <div>
            <h3 className="text-puzzle-white text-xl font-bold mb-1">What if my prize arrives damaged?</h3>
            <p className="text-muted-foreground">
              If your prize arrives damaged, take photos of the damage and contact our support team within 48 hours of delivery. We'll work with you to resolve the issue through replacement, repair, or compensation.
            </p>
          </div>
        </div>

        <div className="bg-puzzle-aqua/10 p-6 rounded-lg mb-8 text-center">
          <h3 className="text-puzzle-white text-xl font-bold mb-2">Need Help?</h3>
          <p className="text-muted-foreground mb-4">
            If you have any questions about claiming your prize or need assistance with the verification process, our support team is here to help.
          </p>
          <Link to="/support" className="inline-block bg-puzzle-aqua text-white px-4 py-2 rounded-md hover:bg-puzzle-aqua/80 transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default PrizeClaimProcess;
