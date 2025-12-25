import { useState } from "react";
import Logo from "@/components/Logo";
import WalletConnect from "@/components/WalletConnect";
import ScoreSubmission from "@/components/ScoreSubmission";
import ScoreList from "@/components/ScoreList";
import { DataCard } from "@/components/DataCard";
import { DataVisualization } from "@/components/DataVisualization";
import { useAccount, useChainId } from "wagmi";
import { useCropGrowthScore } from "@/hooks/useCropGrowthScore";
import { Lock, Loader2, AlertCircle, Leaf, Droplets, Sprout, Database, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

// Contract address - should be set after deployment
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const Index = () => {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { toast } = useToast();
  const [decryptingId, setDecryptingId] = useState<number | undefined>(undefined);

  const {
    entries,
    isLoading,
    message,
    submitScore,
    decryptScore,
    loadEntries,
  } = useCropGrowthScore(CONTRACT_ADDRESS || undefined);

  const handleSubmit = async (farmerAddress: string, score: number) => {
    await submitScore(farmerAddress, score);
    // Reload entries after submission
    setTimeout(() => {
      loadEntries();
    }, 2000);
  };

  const handleDecrypt = async (entryId: number) => {
    try {
      setDecryptingId(entryId);
      await decryptScore(entryId);
      toast({
        title: "Score Decrypted Successfully!",
        description: "The encrypted score has been decrypted.",
      });
    } catch (error: any) {
      toast({
        title: "Decryption Failed",
        description: error?.message || "Failed to decrypt score.",
        variant: "destructive",
      });
    } finally {
      setDecryptingId(undefined);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] bg-secondary/10 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] bg-accent/5 rounded-full blur-[130px]" 
        />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <Logo />
          </motion.div>
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <WalletConnect />
          </motion.div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-6 py-12 pt-28 relative z-10">
        <AnimatePresence mode="wait">
          {!isConnected ? (
            <motion.div
              key="disconnected"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center justify-center min-h-[75vh] text-center"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-32 h-32 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mb-10 relative group cursor-default"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-xl"
                />
                <Lock className="w-16 h-16 text-primary z-10 transition-transform group-hover:rotate-12" />
              </motion.div>
              <h2 className="text-6xl font-black mb-6 tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                Secure Harvest Vault
              </h2>
              <p className="text-2xl text-muted-foreground mb-16 max-w-2xl leading-relaxed font-medium">
                Unlock the power of Fully Homomorphic Encryption for your agricultural data. 
                Connect your Rainbow Wallet to securely manage and store crop growth scores.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
                {[
                  { icon: Shield, title: "End-to-End Encryption", desc: "Military-grade FHE protection for every single bit of data" },
                  { icon: Database, title: "Blockchain Secured", desc: "Immutable decentralized storage with transparent verification" },
                  { icon: Sprout, title: "Privacy First", desc: "You own and control your data with granular permission management" }
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.15, type: "spring" }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="p-10 rounded-[2rem] bg-card/40 border border-border/40 backdrop-blur-md shadow-sm hover:shadow-xl hover:bg-card/60 transition-all duration-300 text-left"
                  >
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : !CONTRACT_ADDRESS ? (
            <motion.div
              key="no-contract"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full"
                />
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Preparing Your Vault</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-md">
                Please deploy the CropGrowthScore contract first. Set VITE_CONTRACT_ADDRESS in your .env file.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-12 pb-20"
            >
              {/* Network Warning */}
              {chainId === 31337 && (
                <motion.div variants={itemVariants} className="max-w-[1800px]">
                  <Alert className="bg-amber-500/10 border-amber-500/20 text-amber-500 py-6 px-8 rounded-2xl">
                    <AlertCircle className="h-6 w-6" />
                    <AlertTitle className="text-lg font-bold">Local Network Detected</AlertTitle>
                    <AlertDescription className="text-base mt-2 opacity-90">
                      Make sure Hardhat node is running with FHEVM support. Run: <code className="text-sm bg-background/50 px-2 py-1 rounded-md font-mono">npx hardhat node</code>
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { title: "Soil Health Index", value: "8.5/10", icon: Leaf, trend: "+2.1% from last month", desc: "pH balanced, nutrients optimal" },
                  { title: "Water Usage", value: "5,240 L", icon: Droplets, trend: "This week usage", desc: "Efficient irrigation maintained" },
                  { title: "Crop Growth Rate", value: "92%", icon: Sprout, trend: "+5% acceleration", desc: "Healthy development stage" },
                  { title: "Encrypted Records", value: entries.length, icon: Database, trend: "Total secured entries", desc: "Blockchain protected records" }
                ].map((stat, i) => (
                  <motion.div 
                    key={i} 
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                  >
                    <DataCard
                      title={stat.title}
                      value={stat.value}
                      icon={stat.icon}
                      trend={stat.trend}
                      description={stat.desc}
                    />
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Score Submission */}
                <motion.div variants={itemVariants} className="lg:col-span-4">
                  <div className="sticky top-28">
                    <ScoreSubmission
                      contractAddress={CONTRACT_ADDRESS}
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                    />
                    
                    {/* Status Message */}
                    <AnimatePresence>
                      {message && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -10, height: 0 }}
                          className="mt-6 bg-primary/10 border border-primary/20 rounded-2xl p-6 backdrop-blur-sm"
                        >
                          <p className="text-base text-primary font-medium flex items-center gap-3">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {message}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Score List & Visualization */}
                <motion.div variants={itemVariants} className="lg:col-span-8 space-y-10">
                  <ScoreList
                    entries={entries}
                    isLoading={isLoading}
                    onDecrypt={handleDecrypt}
                    decryptingId={decryptingId}
                  />
                  
                  <div className="p-1 rounded-[2rem] bg-gradient-to-br from-primary/10 via-transparent to-accent/10">
                    <DataVisualization />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;

