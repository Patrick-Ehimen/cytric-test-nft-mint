// Importing the default configuration from RainbowKit
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
// Importing various blockchain networks from Wagmi
import { sepolia } from "wagmi/chains";
// Importing various wallet options from RainbowKit
import {
  phantomWallet,
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";

// Defining the wallet groups and their respective wallets
const wallets = [
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet,
      phantomWallet,
      rainbowWallet,
      coinbaseWallet,
      walletConnectWallet,
    ],
  },
  {
    groupName: "Others",
    wallets: [argentWallet, trustWallet, ledgerWallet],
  },
];

console.log(
  "NEXT_PUBLIC_ENABLE_TESTNETS",
  process.env.NEXT_PUBLIC_ENABLE_TESTNETS
);

// Exporting the configuration for Wagmi
export const config = getDefaultConfig({
  // Setting the application name
  appName: "NftMint",
  // Setting the project ID from environment variables
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
  // Defining the blockchain networks to support
  chains: [sepolia],
  // Enabling server-side rendering
  ssr: true,
  // Setting the wallet options
  wallets,
});
