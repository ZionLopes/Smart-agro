import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SensorData {
  time: string;
  soilMoisture: number;
  soilTemp: number;
  airTemp: number;
  humidity: number;
  pH: number;
}

interface DataContextType {
  data: SensorData[];
  currentData: SensorData | null;
  valveOpen: boolean;
  setValveOpen: (open: boolean) => void;
  moistureThreshold: number;
  setMoistureThreshold: (threshold: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const generateInitialData = (): SensorData[] => {
  const data = [];
  const now = new Date();
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: `${time.getHours()}:00`,
      soilMoisture: 30 + Math.random() * 40,
      soilTemp: 15 + Math.random() * 10,
      airTemp: 18 + Math.random() * 15,
      humidity: 40 + Math.random() * 30,
      pH: 6.0 + Math.random() * 1.5,
    });
  }
  return data;
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SensorData[]>([]);
  const [valveOpen, setValveOpen] = useState(false);
  const [moistureThreshold, setMoistureThreshold] = useState(40);

  useEffect(() => {
    setData(generateInitialData());
    
    // Simulate real-time updates every 5 seconds
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1)];
        const now = new Date();
        const last = prevData[prevData.length - 1];
        
        // Add some random walk to make it look realistic
        let newMoisture = last.soilMoisture + (Math.random() - 0.5) * 5;
        
        // If valve is open, moisture goes up rapidly
        if (valveOpen) {
          newMoisture += 5;
        }
        
        newMoisture = Math.max(0, Math.min(100, newMoisture));

        newData.push({
          time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
          soilMoisture: newMoisture,
          soilTemp: Math.max(10, Math.min(35, last.soilTemp + (Math.random() - 0.5) * 2)),
          airTemp: Math.max(10, Math.min(45, last.airTemp + (Math.random() - 0.5) * 2)),
          humidity: Math.max(20, Math.min(100, last.humidity + (Math.random() - 0.5) * 4)),
          pH: Math.max(4, Math.min(9, last.pH + (Math.random() - 0.5) * 0.1)),
        });
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [valveOpen]);

  const currentData = data.length > 0 ? data[data.length - 1] : null;

  return (
    <DataContext.Provider value={{ data, currentData, valveOpen, setValveOpen, moistureThreshold, setMoistureThreshold }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};
