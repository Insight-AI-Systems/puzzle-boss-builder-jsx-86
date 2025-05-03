
import { XeroAuthService } from './authService';
import { XeroAuthStatus } from './types';

export async function getConnectionStatus(): Promise<XeroAuthStatus> {
  return XeroAuthService.getConnectionStatus();
}
