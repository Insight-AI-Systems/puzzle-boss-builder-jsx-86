
// Authentication service for Xero integration
import { XeroAuthService } from './authService';

export const auth = {
  initiateAuth: XeroAuthService.initiateAuth,
  refreshToken: XeroAuthService.refreshToken
};
