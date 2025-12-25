import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Leaf, Lock, Loader2, Send, Shield } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";

interface ScoreSubmissionProps {
  contractAddress: string | undefined;
  onSubmit: (farmerAddress: string, score: number) => Promise<void>;
  isLoading: boolean;
}

const ScoreSubmission = ({ contractAddress, onSubmit, isLoading }: ScoreSubmissionProps) => {
  const { toast } = useToast();
  const { address } = useAccount();
  const [farmerAddress, setFarmerAddress] = useState("");
  const [score, setScore] = useState("");

  const handleSubmit = async () => {
    if (!contractAddress) {
      toast({
        title: "Contract Not Deployed",
        description: "Please deploy the contract first.",
        variant: "destructive",
      });
      return;
    }

    if (!farmerAddress.trim()) {
      toast({
        title: "Farmer Address Required",
        description: "Please enter a farmer address.",
        variant: "destructive",
      });
      return;
    }

    const trimmedAddress = farmerAddress.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(trimmedAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address.",
        variant: "destructive",
      });
      return;
    }

    // Prevent using contract address as farmer address
    if (contractAddress && trimmedAddress.toLowerCase() === contractAddress.toLowerCase()) {
      toast({
        title: "Invalid Farmer Address",
        description: "Cannot use contract address as farmer address. Please use a different address.",
        variant: "destructive",
      });
      return;
    }

    const scoreNum = parseInt(score, 10);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      toast({
        title: "Invalid Score",
        description: "Score must be a number between 0 and 10.",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(farmerAddress.trim(), scoreNum);
      toast({
        title: "Score Submitted Successfully! 🎉",
        description: `Encrypted score ${scoreNum} has been stored on the blockchain.`,
      });
      setFarmerAddress("");
      setScore("");
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error?.message || "Failed to submit score.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-border/40 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-primary via-primary/50 to-accent" />
      <CardHeader className="pb-8 pt-10 px-8">
        <CardTitle className="text-3xl font-black flex items-center gap-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          <Leaf className="w-8 h-8 text-primary" />
          Data Entry
        </CardTitle>
        <CardDescription className="text-lg font-medium leading-relaxed">
          Encrypt and store secure crop growth scores (0-10) directly on the blockchain.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-10 space-y-8">
        <div className="space-y-3">
          <Label htmlFor="farmer-address" className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            Farmer Wallet Address
          </Label>
          <Input
            id="farmer-address"
            placeholder="0x..."
            value={farmerAddress}
            onChange={(e) => setFarmerAddress(e.target.value)}
            className="h-14 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl font-mono text-base px-6 shadow-inner"
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground/70 pl-1 font-medium italic">
            Target recipient for the encrypted score
          </p>
        </div>

        <div className="space-y-3">
          <Label htmlFor="score" className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Leaf className="w-4 h-4 text-primary" />
            Growth Score (0-10)
          </Label>
          <Input
            id="score"
            type="number"
            min="0"
            max="10"
            placeholder="0"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="h-14 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl text-xl font-black px-6 shadow-inner"
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground/70 pl-1 font-medium italic">
            Scale: 0 (poor) to 10 (excellent)
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-primary/5 rounded-2xl p-6 border border-primary/10 space-y-2 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Shield className="w-16 h-16 text-primary" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Lock className="w-4 h-4 text-primary" />
            <span className="text-primary/70 font-bold uppercase tracking-wider">Security:</span>
            <span className="font-mono text-primary font-black">FHE v2.0</span>
          </div>
          <p className="text-sm text-primary/60 font-medium relative z-10 leading-relaxed">
            Automatic end-to-end encryption. Data remains private even while being processed on-chain.
          </p>
        </motion.div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading || !contractAddress || !address}
          className="w-full h-16 rounded-2xl gap-3 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-black shadow-lg shadow-primary/20 transition-all active:scale-95"
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-3" key="loading">
              <Loader2 className="w-6 h-6 animate-spin" />
              Securing Data...
            </div>
          ) : (
            <div className="flex items-center gap-3" key="idle">
              <Lock className="w-5 h-5" />
              Submit Encrypted Score
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ScoreSubmission;


