
import React from 'react';
import LegalPageLayout from '@/components/layouts/LegalPageLayout';

const CookiePolicy = () => {
  return (
    <LegalPageLayout 
      title="Cookie Policy" 
      subtitle="This policy explains how we use cookies on our website"
    >
      <h2>1. What Are Cookies</h2>
      <p>
        Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
      </p>
      
      <h2>2. How We Use Cookies</h2>
      <p>
        We use cookies for the following purposes:
      </p>
      
      <h3>2.1 Essential Cookies</h3>
      <p>
        These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account authentication. You cannot opt out of these cookies.
      </p>
      
      <h3>2.2 Performance Cookies</h3>
      <p>
        These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They allow us to recognize and count the number of visitors and see how visitors move around our website.
      </p>
      
      <h3>2.3 Functionality Cookies</h3>
      <p>
        These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
      </p>
      
      <h3>2.4 Targeting Cookies</h3>
      <p>
        These cookies record your visit to our website, the pages you have visited, and the links you have followed. We may use this information to make our website and the advertising displayed on it more relevant to your interests.
      </p>
      
      <h2>3. Specific Cookies We Use</h2>
      <table className="w-full border-collapse my-4">
        <thead>
          <tr className="border-b border-puzzle-aqua/20">
            <th className="text-left py-2">Cookie Name</th>
            <th className="text-left py-2">Purpose</th>
            <th className="text-left py-2">Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-puzzle-aqua/10">
            <td className="py-2">session_id</td>
            <td className="py-2">Maintains user session state across page requests</td>
            <td className="py-2">Session</td>
          </tr>
          <tr className="border-b border-puzzle-aqua/10">
            <td className="py-2">auth_token</td>
            <td className="py-2">Authentication token for logged-in users</td>
            <td className="py-2">30 days</td>
          </tr>
          <tr className="border-b border-puzzle-aqua/10">
            <td className="py-2">_ga</td>
            <td className="py-2">Google Analytics - Used to distinguish users</td>
            <td className="py-2">2 years</td>
          </tr>
          <tr className="border-b border-puzzle-aqua/10">
            <td className="py-2">_gid</td>
            <td className="py-2">Google Analytics - Used to distinguish users</td>
            <td className="py-2">24 hours</td>
          </tr>
          <tr className="border-b border-puzzle-aqua/10">
            <td className="py-2">user_preferences</td>
            <td className="py-2">Stores user preferences such as theme</td>
            <td className="py-2">1 year</td>
          </tr>
        </tbody>
      </table>
      
      <h2>4. Third-Party Cookies</h2>
      <p>
        We use services from the following third parties, which may set cookies on your device:
      </p>
      <ul>
        <li>Google Analytics - For website analytics</li>
        <li>Stripe - For payment processing</li>
        <li>Facebook - For social sharing and advertising</li>
        <li>Intercom - For customer support</li>
      </ul>
      <p>
        Please note that we do not have control over these third-party cookies. You can check the respective privacy policies of these third parties for more information.
      </p>
      
      <h2>5. Managing Cookies</h2>
      <p>
        Most web browsers allow you to manage cookies through their settings preferences. Here's how to do it in popular browsers:
      </p>
      <ul>
        <li><strong>Google Chrome:</strong> Settings &gt; Privacy and security &gt; Cookies and other site data</li>
        <li><strong>Mozilla Firefox:</strong> Options &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
        <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Cookies and website data</li>
        <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions &gt; Cookies and site data</li>
      </ul>
      
      <h2>6. Cookie Consent</h2>
      <p>
        When you first visit our website, we will ask for your consent to set cookies on your device. You can change your cookie preferences at any time by clicking on the "Cookie Settings" link in the footer of our website.
      </p>
      
      <h2>7. Changes to This Cookie Policy</h2>
      <p>
        We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last Updated" date.
      </p>
      
      <h2>8. Contact Us</h2>
      <p>
        If you have any questions about this Cookie Policy, please contact us at privacy@puzzleboss.com.
      </p>
    </LegalPageLayout>
  );
};

export default CookiePolicy;
