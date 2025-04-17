
import React from 'react';
import LegalPageLayout from '@/components/layouts/LegalPageLayout';

const ContestRules = () => {
  return (
    <LegalPageLayout 
      title="Contest Rules" 
      subtitle="Official rules governing participation in our puzzle contests"
    >
      <h2>1. Eligibility</h2>
      <p>
        Puzzle contests on The Puzzle Boss platform are open to individuals who:
      </p>
      <ul>
        <li>Are at least 18 years of age or the legal age of majority in their jurisdiction, whichever is greater</li>
        <li>Have a valid and registered account on the Platform</li>
        <li>Meet any additional eligibility requirements specified in the rules of the specific contest</li>
        <li>Are not employees, contractors, officers, or directors of The Puzzle Boss, its affiliates, subsidiaries, advertising or promotion agencies, or immediate family members of such individuals</li>
      </ul>
      <p>
        Some prizes may have additional eligibility requirements due to regional restrictions, shipping limitations, or prize-specific regulations. These will be clearly indicated in the specific contest details.
      </p>
      
      <h2>2. How to Enter</h2>
      <p>
        To enter a puzzle contest:
      </p>
      <ol>
        <li>Log in to your registered account on The Puzzle Boss platform</li>
        <li>Browse available puzzles and select one you wish to enter</li>
        <li>Purchase the required number of credits for entry (if applicable)</li>
        <li>Click "Start Puzzle" to begin</li>
      </ol>
      <p>
        Each puzzle contest has a specific entry period, which is clearly displayed on the puzzle listing page. No entries will be accepted after the entry period has ended.
      </p>
      
      <h2>3. Contest Mechanics</h2>
      <p>
        Our puzzle contests operate according to these general mechanics:
      </p>
      <ol>
        <li><strong>Skill-Based Competition:</strong> All puzzles are skill-based and require manual completion by the participant</li>
        <li><strong>Timed Completion:</strong> Your completion time begins when you start the puzzle and ends when you submit your solution</li>
        <li><strong>Winner Determination:</strong> The participant with the fastest valid completion time wins the prize</li>
        <li><strong>Ties:</strong> In case of identical completion times, both participants will be awarded the prize</li>
      </ol>
      
      <h2>4. Prohibited Activities</h2>
      <p>
        The following activities are strictly prohibited and will result in disqualification:
      </p>
      <ul>
        <li>Using automated methods, bots, scripts, or AI tools to complete puzzles</li>
        <li>Exploiting bugs or technical glitches in the puzzle system</li>
        <li>Collaborating with others or sharing solutions during active contests</li>
        <li>Creating multiple accounts to gain unfair advantages</li>
        <li>Impersonating other users</li>
        <li>Manipulating the timing system or connection to affect recorded completion times</li>
        <li>Any other forms of cheating or unfair play as determined by The Puzzle Boss</li>
      </ul>
      
      <h2>5. Prize Claim Process</h2>
      <p>
        If you win a puzzle contest:
      </p>
      <ol>
        <li>You will be notified via email and through your account dashboard</li>
        <li>You must respond to the notification within 14 days</li>
        <li>You will be required to complete an identity verification process</li>
        <li>You must provide a valid shipping address (if the prize requires physical delivery)</li>
        <li>You are responsible for any taxes or fees associated with accepting the prize</li>
      </ol>
      <p>
        If a winner fails to respond within the specified timeframe or is determined to be ineligible, the prize may be awarded to the next eligible participant with the fastest completion time.
      </p>
      
      <h2>6. Prize Delivery</h2>
      <p>
        For physical prizes:
      </p>
      <ul>
        <li>Prizes will be shipped to the verified address provided by the winner</li>
        <li>Shipping times vary based on location and prize type (typically 2-4 weeks)</li>
        <li>The Puzzle Boss is not responsible for lost, stolen, or damaged prizes after delivery to the shipping carrier</li>
        <li>Some locations may have import duties or taxes, which are the responsibility of the winner</li>
      </ul>
      <p>
        For digital prizes:
      </p>
      <ul>
        <li>Digital prizes will be delivered to the email address associated with the winner's account</li>
        <li>Delivery typically occurs within 72 hours of successful verification</li>
      </ul>
      
      <h2>7. Dispute Resolution</h2>
      <p>
        In case of disputes regarding contest results:
      </p>
      <ol>
        <li>Contact customer support within 5 days of the contest end</li>
        <li>Provide all relevant information and evidence supporting your claim</li>
        <li>The Puzzle Boss will investigate the dispute and make a final determination</li>
        <li>All decisions made by The Puzzle Boss regarding disputes are final and binding</li>
      </ol>
      
      <h2>8. Changes to Contest Rules</h2>
      <p>
        The Puzzle Boss reserves the right to modify these Contest Rules at any time. Any changes will be effective immediately upon posting the updated rules on the Platform. Specific contests may have additional or modified rules, which will be clearly indicated in the contest details.
      </p>
      
      <h2>9. General Conditions</h2>
      <p>
        By participating in puzzle contests on our Platform:
      </p>
      <ul>
        <li>You agree to abide by these Contest Rules and any specific rules for individual contests</li>
        <li>You acknowledge that your participation is subject to our Terms of Service and Privacy Policy</li>
        <li>You consent to the use of your name, likeness, and puzzle results for promotional purposes without additional compensation, unless prohibited by law</li>
        <li>You release The Puzzle Boss from any liability associated with your participation in contests</li>
      </ul>
      
      <h2>10. Contact Information</h2>
      <p>
        If you have any questions about these Contest Rules, please contact us at contests@puzzleboss.com.
      </p>
    </LegalPageLayout>
  );
};

export default ContestRules;
