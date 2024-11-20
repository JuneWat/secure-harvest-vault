import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";

interface HeaderProps {
  onConnectWallet: () => void;
  isConnected: boolean;
  address?: string;
}

export const Header = ({ onConnectWallet, isConnected, address }: HeaderProps) => {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Button
              onClick={onConnectWallet}
              variant={isConnected ? "secondary" : "default"}
              className="gap-2"
            >
              <Wallet className="w-4 h-4" />
              {isConnected && address ? formatAddress(address) : "Connect Wallet"}
            </Button>
          </div>
        </div>
        <div className="mt-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Protect Your Farm Data, Secure Your Harvest.
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Store and access encrypted records for soil quality, water usage, and crop growth with complete privacy and data integrity.
          </p>
        </div>
      </div>
    </header>
  );
};
