import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Eye, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";

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
      <Card className="border-border bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">Your Encrypted Scores</CardTitle>
          <CardDescription>Loading your crop growth scores...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className="border-border bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">Your Encrypted Scores</CardTitle>
          <CardDescription>No scores found for your address</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Lock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No encrypted scores have been submitted for your address yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-2xl">Your Encrypted Scores</CardTitle>
        <CardDescription>
          {entries.length} score{entries.length !== 1 ? "s" : ""} stored on blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.entryId}
              className="p-4 bg-muted/50 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-accent" />
                  <span className="font-semibold">Entry #{entry.entryId}</span>
                </div>
                <Badge variant={entry.decryptedScore !== undefined ? "default" : "secondary"}>
                  {entry.decryptedScore !== undefined ? "Decrypted" : "Encrypted"}
                </Badge>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(Number(entry.timestamp) * 1000), "PPpp")}
                  </span>
                </div>
                {entry.decryptedScore !== undefined ? (
                  <div className="mt-2">
                    <div className="text-sm text-muted-foreground mb-1">Decrypted Score:</div>
                    <div className="text-2xl font-bold text-primary">
                      {entry.decryptedScore}/10
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    <div className="text-sm text-muted-foreground mb-1">Encrypted Score:</div>
                    <div className="font-mono text-xs text-muted-foreground break-all">
                      {entry.encryptedScore}
                    </div>
                  </div>
                )}
              </div>

              {entry.decryptedScore === undefined && (
                <Button
                  onClick={() => handleDecrypt(entry.entryId)}
                  disabled={decryptingId === entry.entryId}
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                >
                  {decryptingId === entry.entryId ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Decrypting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Decrypt Score
                    </span>
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreList;

