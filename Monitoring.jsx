
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Heart, Thermometer, Wind, Droplets, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const generateVitalData = () => {
  const data = [];
  const now = new Date();
  for (let i = 59; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 1000);
    data.push({
      time: time.toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
      heartRate: Math.floor(Math.random() * (90 - 60 + 1)) + 60, // 60-90 bpm
      oxygenSaturation: Math.floor(Math.random() * (100 - 95 + 1)) + 95, // 95-100%
    });
  }
  return data;
};

const VitalCard = ({ icon: Icon, title, value, unit, trend, trendValue, color, alert }) => (
  <Card className={`glass-card card-hover overflow-hidden ${alert ? 'border-red-500 animate-pulse-border' : ''}`}>
    <CardHeader className={`p-3 bg-${color}-500/10 flex flex-row items-center justify-between space-y-0 pb-2`}>
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={`h-4 w-4 text-${color}-500`} />
    </CardHeader>
    <CardContent className="p-3">
      <div className="text-2xl font-bold text-foreground">{value} <span className="text-xs text-muted-foreground">{unit}</span></div>
      <p className={`text-xs ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'} flex items-center`}>
        {trend === 'up' && <TrendingUp className="mr-1 h-3 w-3" />}
        {trend === 'down' && <TrendingDown className="mr-1 h-3 w-3" />}
        {trendValue}
      </p>
      {alert && <p className="text-xs text-red-500 flex items-center mt-1"><AlertTriangle className="mr-1 h-3 w-3"/>{alert}</p>}
    </CardContent>
  </Card>
);


const Monitoring = () => {
  const [liveVitals, setLiveVitals] = useState(generateVitalData());
  const [selectedPatient, setSelectedPatient] = useState("P102"); // Default to Jane Smith (Critical)

  const patientData = {
    P101: { name: "John Doe", heartRate: 75, bloodPressure: "120/80", temperature: 37.0, oxygenSaturation: 97, respiratoryRate: 18, status: "Stable" },
    P102: { name: "Jane Smith", heartRate: 98, bloodPressure: "100/60", temperature: 36.5, oxygenSaturation: 92, respiratoryRate: 24, status: "Critical", heartRateAlert: "High Heart Rate" },
    P103: { name: "Robert Johnson", heartRate: 88, bloodPressure: "110/70", temperature: 38.2, oxygenSaturation: 95, respiratoryRate: 20, status: "Improving", tempAlert: "Slight Fever" },
    P104: { name: "Emily White", heartRate: 80, bloodPressure: "115/75", temperature: 36.8, oxygenSaturation: 99, respiratoryRate: 16, status: "Stable" },
  };

  const currentPatient = patientData[selectedPatient];

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVitals(prevVitals => {
        const newDataPoint = {
          time: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
          heartRate: currentPatient.status === "Critical" ? Math.floor(Math.random() * (110 - 90 + 1)) + 90 : Math.floor(Math.random() * (90 - 60 + 1)) + 60,
          oxygenSaturation: currentPatient.status === "Critical" ? Math.floor(Math.random() * (95 - 90 + 1)) + 90 : Math.floor(Math.random() * (100 - 95 + 1)) + 95,
        };
        return [...prevVitals.slice(1), newDataPoint];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedPatient, currentPatient.status]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold gradient-text">Live Patient Monitoring</h1>
        <div className="flex items-center space-x-4">
           <Select value={selectedPatient} onValueChange={setSelectedPatient}>
            <SelectTrigger className="w-[180px] input-gradient">
              <SelectValue placeholder="Select Patient" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(patientData).map(key => (
                <SelectItem key={key} value={key}>{patientData[key].name} ({patientData[key].status})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <div className={`h-3 w-3 rounded-full animate-pulse ${currentPatient.status === "Critical" ? 'bg-red-500' : currentPatient.status === "Improving" ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
            <span className="text-sm text-muted-foreground">Live Feed</span>
          </div>
        </div>
      </div>
      
      <div className={`p-4 rounded-lg flex items-center gap-3 mb-6 ${
        currentPatient.status === "Critical" ? 'bg-red-500/10 text-red-700' :
        currentPatient.status === "Improving" ? 'bg-yellow-500/10 text-yellow-700' :
        'bg-green-500/10 text-green-700'
      }`}>
        {currentPatient.status === "Critical" && <AlertTriangle className="h-5 w-5" />}
        {currentPatient.status !== "Critical" && <CheckCircle className="h-5 w-5" />}
        <p className="font-medium">
          Patient {currentPatient.name} is currently <span className="font-bold">{currentPatient.status}</span>.
          {currentPatient.status === "Critical" && " Immediate attention may be required."}
        </p>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <VitalCard
          icon={Heart}
          title="Heart Rate"
          value={currentPatient.heartRate}
          unit="bpm"
          trend={currentPatient.heartRate > 85 ? "up" : currentPatient.heartRate < 65 ? "down" : "stable"}
          trendValue={currentPatient.heartRate > 85 ? "+5 bpm last hr" : currentPatient.heartRate < 65 ? "-3 bpm last hr" : "Stable"}
          color="red"
          alert={currentPatient.heartRateAlert}
        />
        <VitalCard
          icon={Activity}
          title="Blood Pressure"
          value={currentPatient.bloodPressure}
          unit="mmHg"
          trend="stable"
          trendValue="Stable"
          color="blue"
        />
        <VitalCard
          icon={Thermometer}
          title="Temperature"
          value={currentPatient.temperature}
          unit="°C"
          trend={currentPatient.temperature > 37.5 ? "up" : currentPatient.temperature < 36.0 ? "down" : "stable"}
          trendValue={currentPatient.temperature > 37.5 ? "+0.2°C last hr" : "Stable"}
          color="yellow"
          alert={currentPatient.tempAlert}
        />
        <VitalCard
          icon={Droplets}
          title="Oxygen Saturation"
          value={currentPatient.oxygenSaturation}
          unit="%"
          trend={currentPatient.oxygenSaturation < 94 ? "down" : "stable"}
          trendValue={currentPatient.oxygenSaturation < 94 ? "-1% last hr" : "Stable"}
          color="green"
          alert={currentPatient.oxygenSaturation < 94 ? "Low SpO2" : null}
        />
         <VitalCard
          icon={Wind}
          title="Respiratory Rate"
          value={currentPatient.respiratoryRate}
          unit="bpm"
          trend={currentPatient.respiratoryRate > 20 ? "up" : currentPatient.respiratoryRate < 12 ? "down" : "stable"}
          trendValue={currentPatient.respiratoryRate > 20 ? "+2 bpm last hr" : "Stable"}
          color="purple"
          alert={currentPatient.respiratoryRate > 22 ? "High RR" : null}
        />
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Real-time ECG & SpO2 Simulation</CardTitle>
          <CardDescription>Live feed of Heart Rate and Oxygen Saturation for {currentPatient.name}.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={liveVitals}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                <XAxis dataKey="time" tick={{fontSize: 12}}/>
                <YAxis yAxisId="left" orientation="left" stroke="#ef4444" domain={[50, 120]} tick={{fontSize: 12}} label={{ value: 'HR (bpm)', angle: -90, position: 'insideLeft', fill: '#ef4444' }}/>
                <YAxis yAxisId="right" orientation="right" stroke="#22c55e" domain={[85, 100]} tick={{fontSize: 12}} label={{ value: 'SpO2 (%)', angle: -90, position: 'insideRight', fill: '#22c55e' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(var(--background-rgb), 0.8)', backdropFilter: 'blur(4px)', border: '1px solid rgba(var(--border-rgb), 0.2)', borderRadius: '0.5rem' }}
                  itemStyle={{ color: 'var(--foreground)'}}
                  labelStyle={{ color: 'var(--muted-foreground)'}}
                />
                <Legend wrapperStyle={{fontSize: "12px"}}/>
                <Line yAxisId="left" type="monotone" dataKey="heartRate" name="Heart Rate" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 6 }}/>
                <Line yAxisId="right" type="monotone" dataKey="oxygenSaturation" name="SpO2" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 6 }}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Monitoring;
