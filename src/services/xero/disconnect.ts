
import { XeroAuthService } from './authService';

export async function disconnect(): Promise<boolean> {
  return XeroAuthService.disconnect();
}
