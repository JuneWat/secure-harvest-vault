import { Shield } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-6 h-6 text-primary-foreground"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L4 6v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V6l-8-4z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M12 8v4m0 3h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="absolute -right-1 -top-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 text-accent-foreground">
            <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
        FarmGuard
      </span>
    </div>
  );
};
