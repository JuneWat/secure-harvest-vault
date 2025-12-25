import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, ShieldCheck } from "lucide-react";

export const DataVisualization = () => {
  const soilData = [
    { month: "Jan", pH: 6.5, nitrogen: 45, phosphorus: 30, potassium: 50 },
    { month: "Feb", pH: 6.4, nitrogen: 48, phosphorus: 32, potassium: 52 },
    { month: "Mar", pH: 6.6, nitrogen: 50, phosphorus: 35, potassium: 55 },
    { month: "Apr", pH: 6.5, nitrogen: 47, phosphorus: 33, potassium: 53 },
  ];

  return (
    <Card className="border-border/40 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden">
      <CardHeader className="pb-8 pt-8 px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl font-black">Soil Quality Analytics</CardTitle>
              <CardDescription className="text-lg font-medium mt-1">Historical decrypted data visualization</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            End-to-End Encrypted
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {soilData.map((data, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="border border-border/50 rounded-[2rem] p-6 bg-background/40 hover:bg-background/60 hover:border-primary/30 transition-all duration-300 group shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-xl font-black text-foreground">{data.month} 2024</span>
                </div>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold px-3 py-0.5">
                  Verified
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-2xl group-hover:bg-primary/5 transition-colors">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">pH Level</p>
                  <p className="text-2xl font-black text-primary">{data.pH}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl group-hover:bg-primary/5 transition-colors">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Nitrogen</p>
                  <p className="text-2xl font-black text-primary">{data.nitrogen}<span className="text-xs ml-1 opacity-60">mg/kg</span></p>
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl group-hover:bg-primary/5 transition-colors">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Phosphorus</p>
                  <p className="text-2xl font-black text-primary">{data.phosphorus}<span className="text-xs ml-1 opacity-60">mg/kg</span></p>
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl group-hover:bg-primary/5 transition-colors">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Potassium</p>
                  <p className="text-2xl font-black text-primary">{data.potassium}<span className="text-xs ml-1 opacity-60">mg/kg</span></p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

