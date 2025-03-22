declare module '@worldcoin/minikit-js' {
    export class MiniKit {
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
    }
  }