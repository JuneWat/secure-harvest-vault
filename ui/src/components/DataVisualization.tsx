import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";

export const DataVisualization = () => {
  const soilData = [
    { month: "Jan", pH: 6.5, nitrogen: 45, phosphorus: 30, potassium: 50 },
    { month: "Feb", pH: 6.4, nitrogen: 48, phosphorus: 32, potassium: 52 },
    { month: "Mar", pH: 6.6, nitrogen: 50, phosphorus: 35, potassium: 55 },
    { month: "Apr", pH: 6.5, nitrogen: 47, phosphorus: 33, potassium: 53 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Soil Quality Trends</CardTitle>
            <CardDescription>Historical encrypted data visualization</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
            🔒 End-to-End Encrypted
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {soilData.map((data, index) => (
            <div key={index} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-foreground">{data.month} 2024</span>
                <Badge variant="outline">Decrypted</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">pH Level</p>
                  <p className="font-semibold text-primary">{data.pH}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Nitrogen</p>
                  <p className="font-semibold text-primary">{data.nitrogen} mg/kg</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Phosphorus</p>
                  <p className="font-semibold text-primary">{data.phosphorus} mg/kg</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Potassium</p>
                  <p className="font-semibold text-primary">{data.potassium} mg/kg</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
