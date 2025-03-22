import { MiniKit } from "@worldcoin/minikit-js";
import { ReactNode, useEffect } from "react";


const APP_ID = import.meta.env.VITE_WORLDCOIN_APP_ID || "app_c5f50a523d7c6140e6ba927571cecfc4";

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
   
    MiniKit.install(APP_ID);
  }, []);

  console.log("Is MiniKit installed correctly? ", MiniKit.isInstalled());

  return <>{children}</>;
}