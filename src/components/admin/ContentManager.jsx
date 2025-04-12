
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContentManager = () => {
  // This would typically come from a database
  const [pages, setPages] = useState({
    terms: {
      title: "Terms of Service",
      sections: [
        {
          id: 1,
          title: "Acceptance of Terms",
          content: "By accessing or using The Puzzle Boss platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. In accordance with New Zealand's Consumer Guarantees Act 1993, we provide guarantees regarding the quality and fitness of our services."
        },
        {
          id: 2,
          title: "Eligibility",
          content: "You must be at least 18 years old to participate in puzzle competitions with prizes. Users between 13-17 years old may use the platform with parental consent but are not eligible to win prizes. In compliance with New Zealand's Gambling Act 2003, our skill-based competitions are designed to avoid classification as gambling activities."
        },
        {
          id: 3,
          title: "Account Registration",
          content: "You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to provide accurate and complete information during registration and to update such information as needed. In accordance with New Zealand's Privacy Act 2020, we are committed to protecting your personal information."
        },
        {
          id: 4,
          title: "Credits and Payments",
          content: "Credits purchased on The Puzzle Boss are non-refundable except where required by law. Subscription plans auto-renew until canceled. Pricing is displayed in New Zealand Dollars (NZD) and includes GST as required by New Zealand's Goods and Services Tax Act 1985."
        },
        {
          id: 5,
          title: "Puzzle Competitions",
          content: "All puzzles have specific time limits and rules. The Puzzle Boss reserves the right to disqualify users suspected of cheating or fraudulent activity. Prize fulfillment may take up to 30 days after verification of winner. Our competitions comply with New Zealand's Fair Trading Act 1986, ensuring that all contests are conducted fairly and transparently."
        },
        {
          id: 6,
          title: "Code of Conduct",
          content: "Users agree not to engage in harassment, cheating, or disruptive behavior. The Puzzle Boss reserves the right to terminate accounts that violate our code of conduct without refund. We maintain a zero-tolerance policy for harmful digital communications in accordance with New Zealand's Harmful Digital Communications Act 2015."
        },
        {
          id: 7,
          title: "Termination",
          content: "The Puzzle Boss reserves the right to terminate or suspend any account at its sole discretion, with or without notice, for conduct that violates these terms or impairs the rights of others."
        },
        {
          id: 8,
          title: "Modifications to Terms",
          content: "We may modify these terms at any time. Your continued use of the platform after changes constitutes acceptance of the modified terms. Notice of significant changes will be provided in accordance with New Zealand consumer protection laws."
        },
        {
          id: 9,
          title: "Governing Law",
          content: "These terms are governed by the laws of New Zealand, and any disputes shall be resolved in the courts of New Zealand. Users agree to submit to the jurisdiction of New Zealand courts for any legal proceedings related to these terms or use of the platform."
        }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      sections: [
        {
          id: 1,
          title: "Information We Collect",
          content: "We collect personal information such as name, email address, and payment information when you register and use our services. We also collect usage data including puzzle completion times, scores, and interaction patterns. All data collection complies with New Zealand's Privacy Act 2020."
        },
        {
          id: 2,
          title: "How We Use Your Information",
          content: "We use your information to provide and improve our services, process payments, verify winners, communicate about contests and updates, and ensure fair play on our platform. In accordance with New Zealand privacy principles, we only use your information for the purposes for which it was collected."
        },
        {
          id: 3,
          title: "Data Storage and Security",
          content: "Your data is stored securely on our servers with industry-standard encryption. We implement appropriate security measures to protect against unauthorized access or alteration of your personal information. We comply with New Zealand's Privacy Act 2020 requirements for data security."
        },
        {
          id: 4,
          title: "Sharing Your Information",
          content: "We do not sell your personal information to third parties. We may share data with service providers who help us operate our platform, process payments, or fulfill prizes. We may disclose information when required by New Zealand law, including to the Privacy Commissioner if necessary."
        },
        {
          id: 5,
          title: "Cookies and Tracking",
          content: "We use cookies and similar technologies to enhance your experience, analyze usage patterns, and store certain preferences. You can manage cookie settings through your browser. Our cookie usage complies with the guidance from New Zealand's Privacy Commissioner."
        },
        {
          id: 6,
          title: "Your Rights",
          content: "Under New Zealand's Privacy Act 2020, you have the right to access, correct, and in some cases, delete your personal data. You can request a copy of the information we hold about you, and we will respond within 20 working days as required by law."
        },
        {
          id: 7,
          title: "Children's Privacy",
          content: "Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If we learn we have collected information from a child under 13, we will delete that information promptly in accordance with New Zealand law."
        },
        {
          id: 8,
          title: "International Data Transfers",
          content: "Your information may be transferred to and processed in countries other than New Zealand. We ensure appropriate safeguards are in place to protect your information in compliance with New Zealand's Privacy Act 2020, including when transferring data overseas."
        },
        {
          id: 9,
          title: "Changes to This Policy",
          content: "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on our website or via email, in accordance with New Zealand privacy law requirements."
        },
        {
          id: 10,
          title: "Contact Us",
          content: "If you have questions about this Privacy Policy or our data practices, please contact our Privacy Officer at privacy@puzzleboss.com. You also have the right to lodge a complaint with New Zealand's Privacy Commissioner if you believe we have violated your privacy rights."
        }
      ]
    },
    cookie: {
      title: "Cookie Policy",
      sections: [
        {
          id: 1,
          title: "What Are Cookies",
          content: "Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners. Our use of cookies complies with guidelines from New Zealand's Privacy Commissioner."
        },
        {
          id: 2,
          title: "How We Use Cookies",
          content: "The Puzzle Boss uses cookies to enhance your experience on our platform, analyze site usage, and assist in our marketing efforts. We use both session cookies, which expire when you close your browser, and persistent cookies, which stay on your device until deleted."
        },
        {
          id: 3,
          title: "Types of Cookies We Use",
          content: "Essential cookies: These are necessary for the website to function properly and cannot be switched off.\n\nPerformance cookies: These help us understand how visitors interact with our website, such as which pages are visited most often.\n\nFunctionality cookies: These remember choices you make to improve your experience, such as your username or language preference.\n\nTargeting cookies: These may be set through our site by our advertising partners to build a profile of your interests."
        },
        {
          id: 4,
          title: "Managing Cookies",
          content: "Most web browsers used in New Zealand allow some control of cookies through browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage or delete them, visit www.allaboutcookies.org."
        },
        {
          id: 5,
          title: "Third-Party Cookies",
          content: "We may use third-party services that use cookies, such as Google Analytics, payment processors, and social media platforms. These third parties may use cookies, web beacons, and similar technologies to collect information about your use of our website."
        },
        {
          id: 6,
          title: "Changes to Our Cookie Policy",
          content: "We may update this Cookie Policy from time to time in accordance with evolving regulations in New Zealand. We encourage you to periodically review this page for the latest information on our cookie practices."
        }
      ]
    },
    contest: {
      title: "Contest Rules",
      sections: [
        {
          id: 1,
          title: "Eligibility",
          content: "All contests on The Puzzle Boss are open to registered users who are at least 18 years of age at the time of entry. Employees of The Puzzle Boss and their immediate family members are not eligible to participate in contests. In compliance with New Zealand's Gambling Act 2003, our contests are skill-based competitions rather than games of chance."
        },
        {
          id: 2,
          title: "How to Enter",
          content: "To participate in a puzzle contest, users must:\n- Have a registered account on The Puzzle Boss\n- Have sufficient credits in their account for the specific contest\n- Complete the puzzle within the specified time limit\n- Adhere to all platform rules and fair play guidelines\n\nAll entry procedures comply with New Zealand's Fair Trading Act 1986."
        },
        {
          id: 3,
          title: "Contest Structure",
          content: "Each puzzle contest has a defined structure with specific:\n- Start and end times (displayed in New Zealand Standard Time where applicable)\n- Entry fee (in credits)\n- Maximum number of participants\n- Prize details\n- Puzzle difficulty level"
        },
        {
          id: 4,
          title: "Winner Determination",
          content: "Winners are determined based on:\n- Completion time (fastest time wins)\n- Accuracy of puzzle completion\n- Adherence to all contest rules\n\nIn the event of a tie, the user who started the puzzle first will be declared the winner. All contests are conducted fairly and in accordance with New Zealand consumer protection laws."
        },
        {
          id: 5,
          title: "Prizes and Fulfillment",
          content: "Prize details are specified for each contest. Winners must complete identity verification within 7 days of winning. Prizes will be shipped to the verified address within 30 days of verification. For New Zealand winners, all prizes values are inclusive of GST, and winners are responsible for any additional taxes or duties as required by New Zealand law."
        },
        {
          id: 6,
          title: "Fair Play Policy",
          content: "The Puzzle Boss maintains a strict fair play policy. Any user found to be:\n- Using automated tools or bots\n- Creating multiple accounts\n- Manipulating the system in any way\n- Sharing solutions or collaborating during a contest\n\nWill be immediately disqualified and may have their account suspended or terminated without refund, in accordance with New Zealand's Fair Trading Act 1986."
        },
        {
          id: 7,
          title: "Dispute Resolution",
          content: "All decisions made by The Puzzle Boss regarding contest winners, rule violations, or prize fulfillment are final. If you believe there has been an error, please contact our support team within 48 hours of the contest end. New Zealand users may also have rights to resolution through the Disputes Tribunal for qualifying disputes."
        }
      ]
    },
    support: {
      title: "Support Center",
      sections: [
        {
          id: 1,
          title: "Contact Methods",
          content: "Email Support: support@puzzleboss.com\nLive Chat: Available 24/7\nPhone Support (New Zealand): +64 9 123 4567 (Mon-Fri, 9am-5pm NZST)"
        },
        {
          id: 2,
          title: "Frequently Asked Questions",
          content: "How do I purchase credits?\nYou can purchase credits from your account dashboard. We accept various payment methods including credit cards and PayPal. All prices are displayed in New Zealand Dollars (NZD) and include GST.\n\nWhat happens if I don't complete a puzzle?\nIf you don't complete a puzzle within the time limit, your entry fee is not refunded. You can always try again in another contest.\n\nHow do I claim my prize?\nWhen you win a contest, you'll receive instructions via email on how to verify your identity and provide shipping information. For New Zealand winners, we comply with all local delivery and customs requirements."
        },
        {
          id: 3,
          title: "Technical Support",
          content: "If you're experiencing technical issues with the platform, please try the following steps:\n1. Clear your browser cache and cookies\n2. Update your browser to the latest version\n3. Try using a different browser\n4. Disable browser extensions that might interfere with the platform\n\nIf the issue persists, please contact our technical support team with details about your device, browser, and the problem you're experiencing."
        },
        {
          id: 4,
          title: "Account Issues",
          content: "For account-related issues such as login problems, password resets, or account verification, please contact our support team. For New Zealand users, we can provide support during local business hours (9am-5pm NZST) for urgent account matters."
        },
        {
          id: 5,
          title: "Feedback and Suggestions",
          content: "We value your feedback! If you have suggestions for improving The Puzzle Boss, please send them to feedback@puzzleboss.com. We review all suggestions and continuously work to enhance the user experience."
        }
      ]
    },
    partnerships: {
      title: "Partnership Opportunities",
      sections: [
        {
          id: 1,
          title: "Why Partner With Us",
          content: "Join forces with The Puzzle Boss to create exciting opportunities for puzzle enthusiasts worldwide. As New Zealand's premier puzzle competition platform, we offer unique opportunities to reach engaged audiences across the country and globally."
        },
        {
          id: 2,
          title: "Partnership Types",
          content: "Prize Sponsorship: Provide products to be featured as prizes in our puzzle competitions.\n\nCo-branded Contests: Create unique puzzle experiences featuring your brand's visual identity.\n\nMedia Partnerships: Cross-promotion opportunities with complementary platforms and services.\n\nAffiliate Program: Earn commissions by referring new users to The Puzzle Boss."
        },
        {
          id: 3,
          title: "Benefits",
          content: "- Reach a highly engaged audience of puzzle enthusiasts\n- Showcase your products or services as premium prizes\n- Increase brand awareness through co-branded puzzle competitions\n- Access detailed analytics about user engagement with your brand\n- Benefit from our global reach including a strong presence in New Zealand\n- Compliance with all New Zealand advertising and sponsorship regulations"
        },
        {
          id: 4,
          title: "New Zealand Brand Partnerships",
          content: "We're particularly interested in partnering with New Zealand brands to highlight local products and services. Special partnership terms are available for New Zealand-based businesses looking to reach both local and international audiences."
        },
        {
          id: 5,
          title: "Contact Information",
          content: "To discuss partnership opportunities, please contact our partnerships team:\nEmail: partnerships@puzzleboss.com\nPhone (New Zealand): +64 9 987 6543"
        }
      ]
    },
    careers: {
      title: "Careers at The Puzzle Boss",
      sections: [
        {
          id: 1,
          title: "Join Our Team",
          content: "The Puzzle Boss is always looking for talented individuals to join our growing team. Based in Auckland, New Zealand with remote team members worldwide, we offer a dynamic work environment with competitive benefits and exciting challenges."
        },
        {
          id: 2,
          title: "Our Values",
          content: "Innovation: We constantly seek new ways to improve our platform and user experience.\n\nIntegrity: We operate with transparency and honesty in all our dealings.\n\nInclusion: We value diversity and create an inclusive environment for all team members.\n\nImpact: We aim to make a positive difference in our users' lives through engaging puzzles and rewarding experiences."
        },
        {
          id: 3,
          title: "Benefits",
          content: "- Competitive salary packages in line with New Zealand market rates\n- Flexible working arrangements including remote options\n- Professional development opportunities\n- Health and wellness benefits\n- Team building events and activities\n- Opportunity to work with a global user base while being part of New Zealand's growing tech sector"
        },
        {
          id: 4,
          title: "Current Openings",
          content: "Software Developer (Auckland or Remote)\n\nUX/UI Designer (Auckland or Remote)\n\nCommunity Manager (Auckland)\n\nPartnership Coordinator (Auckland)\n\nCustomer Support Specialist (Remote, New Zealand time zone preferred)"
        },
        {
          id: 5,
          title: "Application Process",
          content: "Our recruitment process typically includes:\n1. Initial application review\n2. Phone or video screening\n3. Technical or skills assessment\n4. Team interview\n5. Reference checks\n6. Job offer\n\nWe comply with all New Zealand employment regulations and are committed to fair hiring practices."
        }
      ]
    },
    press: {
      title: "Press & Media",
      sections: [
        {
          id: 1,
          title: "Media Contacts",
          content: "For press inquiries and interview requests:\nContact: Sarah Williams\nEmail: press@puzzleboss.com\nPhone (New Zealand): +64 9 123 7890"
        },
        {
          id: 2,
          title: "Press Releases",
          content: "April 10, 2025: The Puzzle Boss Launches Global Puzzle Competition Platform\nThe Puzzle Boss announces the official launch of its global, skill-based jigsaw puzzle platform where players can compete to win premium brand-name prizes. Based in Auckland, New Zealand, the platform aims to connect puzzle enthusiasts worldwide.\n\nMarch 15, 2025: The Puzzle Boss Secures $5M in Seed Funding\nLeading tech investors back The Puzzle Boss in its mission to revolutionize online puzzle competitions with a $5 million seed funding round, highlighting New Zealand's growing presence in the global tech startup ecosystem."
        },
        {
          id: 3,
          title: "Company Info",
          content: "The Puzzle Boss is a global, skill-based jigsaw puzzle platform where players race to complete puzzles to win premium brand-name prizes. Founded in 2025 and headquartered in Auckland, New Zealand, the company is focused on creating fair, engaging, and secure puzzle competitions for enthusiasts around the world."
        },
        {
          id: 4,
          title: "Leadership Team",
          content: "Alan Thompson - Co-Founder & CEO\nTamara Rodriguez - Co-Founder & CTO\nVincent Lee - Chief Operating Officer\nJulie Chen - Chief Marketing Officer\n\nAs a New Zealand-based company, we're proud to contribute to the country's innovation economy and tech sector growth."
        },
        {
          id: 5,
          title: "Brand Assets",
          content: "Download official logos, icons, and brand graphics for The Puzzle Boss. Available in various formats for both digital and print use."
        }
      ]
    }
  });

  const [editingPage, setEditingPage] = useState(null);
  const [editingSection, setEditingSection] = useState(null);

  const handleSaveSection = () => {
    setEditingSection(null);
    toast.success("Section updated successfully");
    // In a real app, this would save to the database
  };

  const handleSavePage = () => {
    setEditingPage(null);
    toast.success("Page title updated successfully");
    // In a real app, this would save to the database
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-puzzle-gold">Content Management</h2>
        <Link to="/admin">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      
      <p className="text-muted-foreground">
        Manage the content of static pages on The Puzzle Boss platform. Click on any section to edit its content.
      </p>
      
      <Tabs defaultValue="terms" className="w-full">
        <TabsList className="grid grid-cols-4 md:grid-cols-8 mb-6">
          <TabsTrigger value="terms">Terms</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="cookie">Cookie</TabsTrigger>
          <TabsTrigger value="contest">Contest Rules</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
          <TabsTrigger value="careers">Careers</TabsTrigger>
          <TabsTrigger value="press">Press</TabsTrigger>
        </TabsList>
        
        {Object.keys(pages).map((pageKey) => (
          <TabsContent key={pageKey} value={pageKey} className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              {editingPage === pageKey ? (
                <div className="flex items-center gap-2 w-full">
                  <Input 
                    value={pages[pageKey].title} 
                    onChange={(e) => {
                      const newPages = {...pages};
                      newPages[pageKey].title = e.target.value;
                      setPages(newPages);
                    }}
                    className="max-w-md"
                  />
                  <Button onClick={handleSavePage} className="flex items-center gap-2 bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90">
                    <Save size={16} />
                    Save
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-puzzle-aqua">{pages[pageKey].title}</h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingPage(pageKey)}
                    className="text-xs"
                  >
                    Edit Title
                  </Button>
                </>
              )}
            </div>
            
            <div className="space-y-6">
              {pages[pageKey].sections.map((section) => (
                <div key={section.id} className="border rounded-lg p-4 bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{section.title}</h4>
                    <Button 
                      variant="ghost" 
                      className="text-xs"
                      onClick={() => setEditingSection({pageKey, sectionId: section.id})}
                    >
                      Edit Content
                    </Button>
                  </div>
                  
                  {editingSection && editingSection.pageKey === pageKey && editingSection.sectionId === section.id ? (
                    <div className="space-y-4">
                      <Textarea 
                        value={section.content}
                        onChange={(e) => {
                          const newPages = {...pages};
                          const sectionIndex = newPages[pageKey].sections.findIndex(s => s.id === section.id);
                          newPages[pageKey].sections[sectionIndex].content = e.target.value;
                          setPages(newPages);
                        }}
                        rows={8}
                        className="w-full"
                      />
                      <div className="flex justify-end">
                        <Button 
                          onClick={handleSaveSection}
                          className="flex items-center gap-2 bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
                        >
                          <Save size={16} />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p className="whitespace-pre-line text-card-foreground">{section.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ContentManager;
