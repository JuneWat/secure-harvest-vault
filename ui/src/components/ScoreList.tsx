import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Eye, Calendar, Loader2, History } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface ScoreEntry {
  entryId: number;
  timestamp: number;
  encryptedScore: string;
  decryptedScore?: number;
}

interface ScoreListProps {
  entries: ScoreEntry[];
  isLoading: boolean;
  onDecrypt: (entryId: number) => Promise<void>;
  decryptingId?: number;
}

const ScoreList = ({ entries, isLoading, onDecrypt, decryptingId }: ScoreListProps) => {
  const handleDecrypt = async (entryId: number) => {
    try {
      await onDecrypt(entryId);
    } catch (error) {
      console.error("Decryption failed:", error);
    }
  };

  if (isLoading && entries.length === 0) {
    return (
      <Card className="border-border/40 bg-card/60 backdrop-blur-xl shadow-xl">
        <CardHeader className="pb-8 pt-8 px-8">
          <CardTitle className="text-3xl font-black flex items-center gap-3">
            <History className="w-8 h-8 text-primary" />
            Your Encrypted Vault
          </CardTitle>
          <CardDescription className="text-lg">Loading your secure crop growth records...</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-12">
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">Fetching blockchain data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className="border-border/40 bg-card/60 backdrop-blur-xl shadow-xl">
        <CardHeader className="pb-8 pt-8 px-8">
          <CardTitle className="text-3xl font-black flex items-center gap-3">
            <History className="w-8 h-8 text-primary" />
            Your Encrypted Vault
          </CardTitle>
          <CardDescription className="text-lg">No records found for your address</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-12">
          <div className="text-center py-20 bg-muted/30 rounded-[2rem] border-2 border-dashed border-border/50">
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Lock className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <p className="text-xl text-muted-foreground max-w-sm mx-auto">Your vault is currently empty. Submit your first crop growth score to see it here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden">
      <CardHeader className="pb-8 pt-8 px-8 border-b border-border/40 bg-muted/20">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-black flex items-center gap-3">
              <History className="w-8 h-8 text-primary" />
              Your Encrypted Vault
            </CardTitle>
            <CardDescription className="text-lg mt-1 font-medium">
              {entries.length} secure record{entries.length !== 1 ? "s" : ""} stored on-chain
            </CardDescription>
          </div>
          <Badge variant="outline" className="px-4 py-1 text-sm font-bold border-primary/30 text-primary">
            LIVE FEED
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-8 py-8">
        <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence initial={false}>
            {entries.slice().reverse().map((entry, index) => (
              <motion.div
                key={entry.entryId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                layout
                className="p-6 bg-background/50 rounded-[1.5rem] border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-lg font-bold block leading-none">Record #{entry.entryId}</span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1 font-medium">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(Number(entry.timestamp) * 1000), "PPpp")}</span>
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={entry.decryptedScore !== undefined ? "default" : "secondary"}
                    className={entry.decryptedScore !== undefined ? "bg-primary text-primary-foreground px-4 py-1" : "bg-muted text-muted-foreground px-4 py-1"}
                  >
                    {entry.decryptedScore !== undefined ? "Decrypted" : "Encrypted"}
                  </Badge>
                </div>

                <div className="mb-6">
                  {entry.decryptedScore !== undefined ? (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-4 bg-primary/5 rounded-2xl border border-primary/10"
                    >
                      <div className="text-sm text-primary/70 mb-1 font-bold uppercase tracking-wider">Growth Score</div>
                      <div className="text-4xl font-black text-primary">
                        {entry.decryptedScore}<span className="text-xl text-primary/50">/10</span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="p-4 bg-muted/30 rounded-2xl border border-border/50 group-hover:bg-muted/50 transition-colors">
                      <div className="text-sm text-muted-foreground mb-2 font-bold uppercase tracking-wider">Encrypted Payload</div>
                      <div className="font-mono text-xs text-muted-foreground/70 break-all leading-relaxed line-clamp-2">
                        {entry.encryptedScore}
                      </div>
                    </div>
                  )}
                </div>

                {entry.decryptedScore === undefined && (
                  <Button
                    onClick={() => handleDecrypt(entry.entryId)}
                    disabled={decryptingId === entry.entryId}
                    variant="default"
                    size="lg"
                    className="w-full rounded-xl gap-3 font-bold h-12 shadow-sm hover:shadow-md transition-all"
                  >
                    {decryptingId === entry.entryId ? (
                      <div className="flex items-center gap-3" key="loading">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing Decryption...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3" key="idle">
                        <Eye className="w-5 h-5" />
                        Reveal Encrypted Score
                      </div>
                    )}
                  </Button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreList;


