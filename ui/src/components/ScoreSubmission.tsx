import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Leaf, Lock, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";

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
    <Card className="border-border bg-card/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-3xl bg-gradient-primary bg-clip-text text-transparent flex items-center gap-2">
          <Leaf className="w-8 h-8 text-primary" />
          Submit Crop Growth Score
        </CardTitle>
        <CardDescription className="text-base">
          Encrypt and store crop growth scores (0-10) on the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="farmer-address" className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-accent" />
            Farmer Address
          </Label>
          <Input
            id="farmer-address"
            placeholder="0x..."
            value={farmerAddress}
            onChange={(e) => setFarmerAddress(e.target.value)}
            className="bg-background/50 font-mono"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            The address of the farmer who owns the crop
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="score" className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-accent" />
            Growth Score (0-10)
          </Label>
          <Input
            id="score"
            type="number"
            min="0"
            max="10"
            placeholder="Enter score (0-10)"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="bg-background/50"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Crop growth assessment score from agricultural technician
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Lock className="w-4 h-4 text-accent" />
            <span className="text-muted-foreground">Encryption:</span>
            <span className="font-mono text-foreground">FHE (Fully Homomorphic Encryption)</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Your score will be encrypted before blockchain storage. Only the farmer can decrypt it.
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading || !contractAddress || !address}
          className="w-full gap-2 bg-gradient-primary hover:opacity-90 text-primary-foreground"
          size="lg"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Encrypting & Submitting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Submit Encrypted Score
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ScoreSubmission;

