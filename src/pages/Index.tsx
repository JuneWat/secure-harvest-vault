import { useState } from "react";
import { Header } from "@/components/Header";
import { DataCard } from "@/components/DataCard";
import { DataEntryForm } from "@/components/DataEntryForm";
import { DataVisualization } from "@/components/DataVisualization";
import { Droplets, Leaf, Sprout, Database, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>();
  const { toast } = useToast();

  const handleConnectWallet = () => {
    // Simulate wallet connection
    if (!isConnected) {
      const mockAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
      setWalletAddress(mockAddress);
      setIsConnected(true);
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been securely connected via Rainbow Wallet.",
      });
    } else {
      setIsConnected(false);
      setWalletAddress(undefined);
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Header 
        onConnectWallet={handleConnectWallet}
        isConnected={isConnected}
        address={walletAddress}
      />
      
      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet to Continue</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Connect your Rainbow Wallet to access encrypted farm data storage and management features.
            </p>
            <Button size="lg" onClick={handleConnectWallet} className="gap-2">
              <Shield className="w-5 h-5" />
              Connect Rainbow Wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DataCard
                title="Soil Health Index"
                value="8.5/10"
                icon={Leaf}
                trend="+2.1% from last month"
                description="pH balanced, nutrients optimal"
              />
              <DataCard
                title="Water Usage"
                value="5,240 L"
                icon={Droplets}
                trend="This week"
                description="Efficient irrigation maintained"
              />
              <DataCard
                title="Crop Growth Rate"
                value="92%"
                icon={Sprout}
                trend="+5% growth acceleration"
                description="Healthy development stage"
              />
              <DataCard
                title="Encrypted Records"
                value="147"
                icon={Database}
                trend="Total stored entries"
                description="All data blockchain secured"
              />
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">End-to-End Encryption</h3>
                <p className="text-sm text-muted-foreground">
                  All farm data is encrypted before storage using military-grade encryption protocols.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Blockchain Storage</h3>
                <p className="text-sm text-muted-foreground">
                  Decentralized storage ensures your data is immutable and always accessible.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-secondary/50 to-secondary border border-border rounded-xl p-6">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Privacy First</h3>
                <p className="text-sm text-muted-foreground">
                  Only you have access to your farm data. Complete ownership and control.
                </p>
              </div>
            </div>

            {/* Data Entry and Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DataEntryForm />
              <DataVisualization />
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Encrypted Entries</h3>
              <div className="space-y-3">
                {[
                  { type: "Soil Quality", time: "2 hours ago", status: "Encrypted & Stored" },
                  { type: "Water Usage", time: "5 hours ago", status: "Encrypted & Stored" },
                  { type: "Crop Growth", time: "1 day ago", status: "Encrypted & Stored" },
                ].map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <div>
                      <p className="font-medium">{entry.type} Data</p>
                      <p className="text-sm text-muted-foreground">{entry.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-accent">🔒 {entry.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
