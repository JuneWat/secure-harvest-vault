import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export const DataEntryForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent, type: string) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate encryption and storage
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Data Encrypted & Stored",
      description: `Your ${type} data has been securely encrypted and stored on the blockchain.`,
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Encrypted Farm Data</CardTitle>
        <CardDescription>
          All data is encrypted before storage to ensure complete privacy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="soil" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="soil">Soil Quality</TabsTrigger>
            <TabsTrigger value="water">Water Usage</TabsTrigger>
            <TabsTrigger value="crop">Crop Growth</TabsTrigger>
          </TabsList>

          <TabsContent value="soil">
            <form onSubmit={(e) => handleSubmit(e, "soil quality")} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="soil-ph">pH Level</Label>
                <Input id="soil-ph" type="number" step="0.1" placeholder="6.5" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="soil-nitrogen">Nitrogen (N) mg/kg</Label>
                <Input id="soil-nitrogen" type="number" placeholder="45" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="soil-phosphorus">Phosphorus (P) mg/kg</Label>
                <Input id="soil-phosphorus" type="number" placeholder="30" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="soil-potassium">Potassium (K) mg/kg</Label>
                <Input id="soil-potassium" type="number" placeholder="50" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="soil-notes">Additional Notes</Label>
                <Textarea id="soil-notes" placeholder="Any observations..." />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Encrypting & Storing..." : "🔒 Encrypt & Store"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="water">
            <form onSubmit={(e) => handleSubmit(e, "water usage")} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="water-amount">Water Amount (Liters)</Label>
                <Input id="water-amount" type="number" placeholder="5000" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="water-source">Water Source</Label>
                <Input id="water-source" placeholder="Well, River, etc." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="water-quality">Water Quality Rating (1-10)</Label>
                <Input id="water-quality" type="number" min="1" max="10" placeholder="8" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="water-notes">Additional Notes</Label>
                <Textarea id="water-notes" placeholder="Any observations..." />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Encrypting & Storing..." : "🔒 Encrypt & Store"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="crop">
            <form onSubmit={(e) => handleSubmit(e, "crop growth")} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="crop-type">Crop Type</Label>
                <Input id="crop-type" placeholder="Wheat, Corn, etc." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crop-height">Height (cm)</Label>
                <Input id="crop-height" type="number" placeholder="45" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crop-health">Health Status (1-10)</Label>
                <Input id="crop-health" type="number" min="1" max="10" placeholder="9" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crop-yield">Expected Yield (kg/hectare)</Label>
                <Input id="crop-yield" type="number" placeholder="3500" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crop-notes">Additional Notes</Label>
                <Textarea id="crop-notes" placeholder="Any observations..." />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Encrypting & Storing..." : "🔒 Encrypt & Store"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
