
import React from 'react';
import LegalPageLayout from '@/components/layouts/LegalPageLayout';

const Privacy = () => {
  return (
    <LegalPageLayout 
      title="Privacy Policy" 
      subtitle="We value your privacy and are committed to protecting your personal data"
    >
      <h2>1. Introduction</h2>
      <p>
        This Privacy Policy explains how The Puzzle Boss ("we", "us", "our") collects, uses, and protects your personal information when you use our platform. We respect your privacy and are committed to protecting your personal data.
      </p>
      
      <h2>2. Information We Collect</h2>
      <p>
        We collect the following types of information:
      </p>
      <h3>2.1 Personal Information</h3>
      <ul>
        <li>Account information: name, email address, username, password</li>
        <li>Profile information: display name, profile picture, preferences</li>
        <li>Payment information: credit card details, billing address (stored securely by our payment processors)</li>
        <li>Identity verification information: for prize winners, we may collect additional verification documents</li>
      </ul>
      
      <h3>2.2 Usage Information</h3>
      <ul>
        <li>Puzzle activity: puzzles played, completion times, results</li>
        <li>Device information: IP address, browser type, device type</li>
        <li>Log data: access times, pages viewed, features used</li>
        <li>Performance data: to detect cheating or unusual activities</li>
      </ul>
      
      <h2>3. How We Use Your Information</h2>
      <p>
        We use your information for the following purposes:
      </p>
      <ul>
        <li>To provide and maintain our services</li>
        <li>To authenticate users and prevent fraud</li>
        <li>To process transactions and deliver prizes</li>
        <li>To improve and personalize user experience</li>
        <li>To communicate with you about your account or transactions</li>
        <li>To send you updates, marketing, or promotional materials (with your consent)</li>
        <li>To enforce our terms and protect our legal rights</li>
      </ul>
      
      <h2>4. Information Sharing</h2>
      <p>
        We may share your information with:
      </p>
      <ul>
        <li>Service providers who help us operate our platform (payment processors, hosting providers, etc.)</li>
        <li>Partners for prize fulfillment (shipping companies, etc.)</li>
        <li>Legal authorities when required by law</li>
        <li>Affiliated companies within our corporate group</li>
      </ul>
      <p>
        We do not sell your personal information to third parties.
      </p>
      
      <h2>5. Data Security</h2>
      <p>
        We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include encryption, access controls, and regular security assessments.
      </p>
      
      <h2>6. Data Retention</h2>
      <p>
        We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
      </p>
      
      <h2>7. Your Rights</h2>
      <p>
        Depending on your location, you may have the following rights regarding your personal information:
      </p>
      <ul>
        <li>Access: Request access to your personal information</li>
        <li>Correction: Request correction of inaccurate information</li>
        <li>Deletion: Request deletion of your personal information</li>
        <li>Restriction: Request restriction of processing of your information</li>
        <li>Portability: Request transfer of your information</li>
        <li>Objection: Object to processing of your information</li>
      </ul>
      
      <h2>8. Cookies and Tracking</h2>
      <p>
        We use cookies and similar tracking technologies to collect and track information about your interactions with our platform. For more details, please see our Cookie Policy.
      </p>
      
      <h2>9. Children's Privacy</h2>
      <p>
        Our platform is not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18 without verification of parental consent, we will take steps to remove that information.
      </p>
      
      <h2>10. International Data Transfers</h2>
      <p>
        Your information may be transferred to and processed in countries other than the country in which you are resident. These countries may have data protection laws that are different from those in your country. We have implemented appropriate safeguards to ensure that your personal information remains protected.
      </p>
      
      <h2>11. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
      </p>
      
      <h2>12. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at privacy@puzzleboss.com.
      </p>
    </LegalPageLayout>
  );
};

export default Privacy;
