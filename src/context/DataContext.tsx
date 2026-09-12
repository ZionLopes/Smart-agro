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

export interface Equipment {
  id: string;
  name: string;
  type: 'Tractor' | 'Harvester' | 'Drone';
  status: 'Active' | 'Idle' | 'Maintenance';
  fuel: number;
  location: { lat: number; lng: number };
}

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
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
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
  equipment: Equipment[];
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
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
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initial Tasks
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Inspect Soil Moisture Sensor (Node Alpha)', status: 'todo', priority: 'high' },
    { id: '2', title: 'Refuel Tractor 01', status: 'in-progress', priority: 'medium' },
    { id: '3', title: 'Apply Fertilizer to Sector 4', status: 'done', priority: 'low' },
  ]);

  // Initial Equipment
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  // Request Geolocation on mount and set equipment relative to it
  useEffect(() => {
    if (navigator.geolocation) {
      const timeoutId = setTimeout(() => {
        const fallback = { lat: 36.7783, lng: -119.4179 };
        setUserLocation(prev => prev ? prev : fallback);
        if (equipment.length === 0) {
           setEquipment([
             { id: 'eq1', name: 'Tractor 01 (Deere)', type: 'Tractor', status: 'Active', fuel: 45, location: { lat: fallback.lat + 0.001, lng: fallback.lng + 0.002 } },
             { id: 'eq2', name: 'Harvester 04', type: 'Harvester', status: 'Idle', fuel: 88, location: { lat: fallback.lat - 0.002, lng: fallback.lng - 0.001 } },
             { id: 'eq3', name: 'AgriDrone Pro', type: 'Drone', status: 'Maintenance', fuel: 12, location: { lat: fallback.lat, lng: fallback.lng } },
           ]);
        }
      }, 3000); // 3 second timeout if user ignores prompt

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          if (equipment.length === 0) {
             setEquipment([
               { id: 'eq1', name: 'Tractor 01 (Deere)', type: 'Tractor', status: 'Active', fuel: 45, location: { lat: loc.lat + 0.001, lng: loc.lng + 0.002 } },
               { id: 'eq2', name: 'Harvester 04', type: 'Harvester', status: 'Idle', fuel: 88, location: { lat: loc.lat - 0.002, lng: loc.lng - 0.001 } },
               { id: 'eq3', name: 'AgriDrone Pro', type: 'Drone', status: 'Maintenance', fuel: 12, location: { lat: loc.lat, lng: loc.lng } },
             ]);
          }
        },
        (error) => {
          clearTimeout(timeoutId);
          console.error("Error getting location:", error);
          const fallback = { lat: 36.7783, lng: -119.4179 };
          setUserLocation(fallback);
          if (equipment.length === 0) {
             setEquipment([
               { id: 'eq1', name: 'Tractor 01 (Deere)', type: 'Tractor', status: 'Active', fuel: 45, location: { lat: fallback.lat + 0.001, lng: fallback.lng + 0.002 } },
               { id: 'eq2', name: 'Harvester 04', type: 'Harvester', status: 'Idle', fuel: 88, location: { lat: fallback.lat - 0.002, lng: fallback.lng - 0.001 } },
               { id: 'eq3', name: 'AgriDrone Pro', type: 'Drone', status: 'Maintenance', fuel: 12, location: { lat: fallback.lat, lng: fallback.lng } },
             ]);
          }
        },
        { timeout: 5000 }
      );
    } else {
      const fallback = { lat: 36.7783, lng: -119.4179 };
      setUserLocation(fallback);
      setEquipment([
        { id: 'eq1', name: 'Tractor 01 (Deere)', type: 'Tractor', status: 'Active', fuel: 45, location: { lat: fallback.lat + 0.001, lng: fallback.lng + 0.002 } },
        { id: 'eq2', name: 'Harvester 04', type: 'Harvester', status: 'Idle', fuel: 88, location: { lat: fallback.lat - 0.002, lng: fallback.lng - 0.001 } },
        { id: 'eq3', name: 'AgriDrone Pro', type: 'Drone', status: 'Maintenance', fuel: 12, location: { lat: fallback.lat, lng: fallback.lng } },
      ]);
    }
  }, []);

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
    <DataContext.Provider value={{ data, currentData, valveOpen, setValveOpen, moistureThreshold, setMoistureThreshold, irrigationMode, setIrrigationMode, selectedCrop, setSelectedCrop, dbConnected, userLocation, setUserLocation, equipment, tasks, setTasks, isDarkMode, setIsDarkMode }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};
