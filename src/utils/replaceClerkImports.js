// Temporary utility script to help replace all useClerkAuth imports
const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/components/admin/dashboard/partners/AddPartnerDialog.tsx',
  'src/components/admin/dashboard/partners/CommunicationsCenter.tsx',
  'src/components/admin/image-library/components/ImageSelector.tsx',
  'src/components/admin/user-management/UserManagement.tsx',
  'src/components/auth/AuthContent.tsx',
  'src/components/auth/ProtectedRoute.tsx',
  'src/components/auth/RoleBasedAccess.tsx',
  'src/components/debug/AuthDebugPanel.tsx',
  'src/components/games/BaseGameWrapper.tsx',
  'src/components/games/hooks/useGameSession.ts',
  'src/components/games/hooks/useLeaderboardSubmission.ts',
  'src/components/games/hooks/usePaymentVerification.ts',
  'src/components/games/word-search/WordSearchControls.tsx',
  'src/components/games/word-search/hooks/useWordSearchLeaderboard.ts',
  'src/components/navbar/MobileMenu.tsx',
  'src/components/navbar/UserMenu.tsx',
  'src/components/payments/PaymentGate.tsx',
  'src/components/payments/PaymentTestHelper.tsx',
  'src/components/payments/WalletManager.tsx',
  'src/components/support/NewTicketForm.tsx',
  'src/components/support/SupportHome.tsx',
  'src/components/support/TicketList.tsx',
  'src/components/support/admin/AdminTicketDashboard.tsx',
  'src/hooks/admin/useCategoryManagement.ts',
  'src/hooks/admin/useCategoryOperations.ts',
  'src/hooks/profile/useAvatarUpload.tsx',
  'src/hooks/support/useAddTicket.tsx',
  'src/hooks/support/useFetchTickets.tsx',
  'src/hooks/support/useTicketComment.tsx',
  'src/hooks/support/useTicketStatus.tsx',
  'src/hooks/useBetaNotes.tsx',
  'src/hooks/useSecurityContext.tsx',
  'src/pages/AccountDashboard.tsx',
  'src/pages/HomePage.tsx',
  'src/pages/Index.tsx',
  'src/pages/Profile.tsx',
  'src/pages/PuzzlePaymentSuccess.tsx',
  'src/pages/Settings.tsx',
  'src/pages/Support.tsx',
  'src/pages/Unauthorized.tsx'
];

console.log('Files to update:', filesToUpdate.length);