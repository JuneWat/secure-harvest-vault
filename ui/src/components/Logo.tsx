import { Leaf } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
        <Leaf className="w-6 h-6 text-primary-foreground" />
      </div>
      <div>
        <div className="font-bold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Secure Harvest Vault
        </div>
        <div className="text-xs text-muted-foreground">Encrypted Farm Data</div>
      </div>
    </div>
  );
};

export default Logo;
