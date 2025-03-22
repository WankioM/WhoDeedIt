declare module '@worldcoin/minikit-js' {
  // Define VerificationLevel enum
  export enum VerificationLevel {
    Orb = 'orb',
    Device = 'device'
  }

  // Define VerifyCommandInput interface
  export interface VerifyCommandInput {
    action: string;
    signal?: string;
    verification_level?: VerificationLevel;
  }

  // Define response interfaces
  export interface ISuccessResult {
    status: 'success';
    proof: string;
    merkle_root: string;
    nullifier_hash: string;
    verification_level: VerificationLevel;
    version: number;
  }

  export interface IErrorResult {
    status: 'error';
    message: string;
  }

  export interface IVerifyResponse {
    success: boolean;
    error?: string;
    data?: any;
  }

  // Cloud verification function
  export function verifyCloudProof(
    payload: ISuccessResult, 
    app_id: `app_${string}`, 
    action: string, 
    signal?: string
  ): Promise<IVerifyResponse>;

  export class MiniKit {
    // Static methods and properties
    static isInstalled(): boolean;
    static install(appId: string): Promise<void>;
    
    // MiniKit commands async API
    static commandsAsync: {
      walletAuth(options: {
        nonce: string;
        statement?: string;
        expirationTime?: Date;
        notBefore?: Date;
      }): Promise<{
        finalPayload: {
          status: 'success' | 'error';
          address?: string;
          signature?: string;
          message?: string;
          message_hash?: string;
          error?: string;
        }
      }>;
      
      verify(options: VerifyCommandInput): Promise<{
        finalPayload: ISuccessResult | IErrorResult;
      }>;
    };
    
    // Legacy methods
    static signIn(): Promise<{
      nullifier_hash: string;
      merkle_root: string;
      proof: string;
      verification_level: string;
    }>;
    
    static on(eventName: string, callback: (data: any) => void): void;
    static off(eventName: string, callback: (data: any) => void): void;
    
    // Auth property for accessing user data
    static auth: {
      username: string | null;
      profile_picture: string | null;
    };
  }
}