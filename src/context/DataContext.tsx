import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { supabase } from '../lib/supabase';

export interface SensorData {
  time: string;
  soilMoisture: number;
  soilTemp: number;
  airTemp: number;
  humidity: number;
  pH: number;
  windSpeed: number;
  solarRadiation: number;
  leafWetness: number;
}

interface DataContextType {
  data: SensorData[];
  currentData: SensorData | null;
  valveOpen: boolean;
  setValveOpen: (open: boolean) => void;
  moistureThreshold: number;
  setMoistureThreshold: (threshold: number) => void;
  irrigationMode: 'manual' | 'auto';
  setIrrigationMode: (mode: 'manual' | 'auto') => void;
  selectedCrop: string;
  setSelectedCrop: (crop: string) => void;
  dbConnected: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper for local mock generation
const generateInitialData = (): SensorData[] => {
  const data = [];
  const now = new Date();
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: `${time.getHours()}:00`,
      soilMoisture: 40 + Math.random() * 20,
      soilTemp: 18 + Math.random() * 10,
      airTemp: 22 + Math.random() * 15,
      humidity: 50 + Math.random() * 30,
      pH: 6.5 + Math.random() * 0.5,
      windSpeed: 5 + Math.random() * 10,
      solarRadiation: 400 + Math.random() * 400,
      leafWetness: Math.random() * 50,
    });
  }
  return data;
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SensorData[]>([]);
  const [valveOpen, setValveOpen] = useState(false);
  const [moistureThreshold, setMoistureThreshold] = useState(50);
  const [irrigationMode, setIrrigationMode] = useState<'manual' | 'auto'>('manual');
  const [selectedCrop, setSelectedCrop] = useState('Tomatoes');
  const [dbConnected, setDbConnected] = useState(false);

  // Use refs for the simulation loop to always access latest state without re-triggering useEffect
  const stateRef = useRef({ valveOpen, irrigationMode, moistureThreshold });
  useEffect(() => {
    stateRef.current = { valveOpen, irrigationMode, moistureThreshold };
  }, [valveOpen, irrigationMode, moistureThreshold]);

  // Dynamic Crop Profiles
  useEffect(() => {
    switch(selectedCrop) {
      case 'Tomatoes': setMoistureThreshold(50); break;
      case 'Wheat': setMoistureThreshold(35); break;
      case 'Corn': setMoistureThreshold(45); break;
      case 'Lettuce': setMoistureThreshold(60); break;
    }
  }, [selectedCrop]);

  useEffect(() => {
    let isSubscribed = true;
    let localDataBuffer = generateInitialData();
    setData(localDataBuffer);

    const initializeDB = async () => {
      try {
        // Test connection & fetch historical data
        const { data: fetchDB, error } = await supabase
          .from('farm_telemetry')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;
        
        if (isSubscribed) setDbConnected(true);

        if (fetchDB && fetchDB.length > 0) {
          const parsedDBData = fetchDB.reverse().map(row => {
            const date = new Date(row.created_at);
            return {
              time: `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`,
              soilMoisture: Number(row.soil_moisture),
              soilTemp: Number(row.soil_temp),
              airTemp: Number(row.air_temp),
              humidity: Number(row.humidity),
              pH: Number(row.ph_level),
              windSpeed: Number(row.wind_speed),
              solarRadiation: Number(row.solar_radiation),
              leafWetness: Number(row.leaf_wetness),
            };
          });
          if (isSubscribed) {
            localDataBuffer = parsedDBData;
            setData(parsedDBData);
          }
        }
      } catch (err) {
        console.log("Supabase DB not configured or table missing. Using local simulation fallback.");
        if (isSubscribed) setDbConnected(false);
      }
    };

    initializeDB();

    // Supabase Realtime Subscription
    const subscription = supabase.channel('telemetry_inserts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'farm_telemetry' }, payload => {
        const row = payload.new;
        const date = new Date(row.created_at);
        const newPoint: SensorData = {
          time: `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`,
          soilMoisture: Number(row.soil_moisture),
          soilTemp: Number(row.soil_temp),
          airTemp: Number(row.air_temp),
          humidity: Number(row.humidity),
          pH: Number(row.ph_level),
          windSpeed: Number(row.wind_speed),
          solarRadiation: Number(row.solar_radiation),
          leafWetness: Number(row.leaf_wetness),
        };
        setData(prev => {
          const arr = [...prev, newPoint];
          return arr.length > 100 ? arr.slice(arr.length - 100) : arr;
        });
      })
      .subscribe();

    // IoT Node Simulation (Inserts to Supabase if connected, else updates local state)
    const interval = setInterval(async () => {
      const last = localDataBuffer[localDataBuffer.length - 1];
      const now = new Date();
      const { valveOpen: currentValve, irrigationMode: currentMode, moistureThreshold: currentThresh } = stateRef.current;
      
      let newMoisture = last.soilMoisture + (Math.random() - 0.5) * 5;
      
      if (currentMode === 'auto') {
        if (newMoisture < currentThresh && !currentValve) {
          setValveOpen(true);
        } else if (newMoisture > currentThresh + 20 && currentValve) {
          setValveOpen(false);
        }
      }
      if (currentValve) newMoisture += 5;
      newMoisture = Math.max(0, Math.min(100, newMoisture));

      const newPoint: SensorData = {
        time: `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`,
        soilMoisture: newMoisture,
        soilTemp: last.soilTemp + (Math.random() - 0.5),
        airTemp: last.airTemp + (Math.random() - 0.5),
        humidity: Math.max(0, Math.min(100, last.humidity + (Math.random() - 0.5) * 5)),
        pH: Math.max(0, Math.min(14, last.pH + (Math.random() - 0.5) * 0.1)),
        windSpeed: Math.max(0, last.windSpeed + (Math.random() - 0.5) * 2),
        solarRadiation: Math.max(0, last.solarRadiation + (Math.random() - 0.5) * 50),
        leafWetness: Math.max(0, Math.min(100, last.leafWetness + (Math.random() - 0.5) * 10)),
      };

      try {
        const { error } = await supabase.from('farm_telemetry').insert([{
          node_id: 'NODE_ALPHA_01',
          soil_moisture: newPoint.soilMoisture,
          soil_temp: newPoint.soilTemp,
          air_temp: newPoint.airTemp,
          humidity: newPoint.humidity,
          ph_level: newPoint.pH,
          wind_speed: newPoint.windSpeed,
          solar_radiation: newPoint.solarRadiation,
          leaf_wetness: newPoint.leafWetness
        }]);
        
        if (error) throw error; // If insert fails, fall back to local
      } catch (err) {
        // Fallback local update if DB not ready
        localDataBuffer.push(newPoint);
        if (localDataBuffer.length > 100) localDataBuffer.shift();
        setData([...localDataBuffer]);
      }
    }, 5000);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
      supabase.removeChannel(subscription);
    };
  }, []);

  const currentData = data.length > 0 ? data[data.length - 1] : null;

  return (
    <DataContext.Provider value={{ data, currentData, valveOpen, setValveOpen, moistureThreshold, setMoistureThreshold, irrigationMode, setIrrigationMode, selectedCrop, setSelectedCrop, dbConnected }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};
