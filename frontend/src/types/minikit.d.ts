declare module '@worldcoin/minikit-js' {
  export class MiniKit {
    // Existing methods
    static isInstalled(): boolean;
    static install(appId: string): Promise<void>;
    static signIn(): Promise<{
      nullifier_hash: string;
      merkle_root: string;
      proof: string;
      verification_level: string;
    }>;
    static on(eventName: string, callback: (data: any) => void): void;
    static off(eventName: string, callback: (data: any) => void): void;
    
    // Add Wallet Auth methods and properties
    static wallet_auth(): Promise<{
      address: string;
      signature: string;
      message: string;
    }>;
    
    // Auth property for accessing user data
    static auth: {
      username: string | null;
      profile_picture: string | null;
    };

    // Other methods that might be needed
    static verify(options: {
      app_id: string;
      action_id: string;
      signal: string;
      nullifier_hash: string | null;
    }): Promise<{
      nullifier_hash: string;
      merkle_root: string;
      proof: string;
      verification_level: string;
    }>;
  }
}