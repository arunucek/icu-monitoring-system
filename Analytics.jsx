
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, TrendingUp, Users, AlertTriangle, CheckCircle, BarChart2, PieChart as PieIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialPatientData = [
  { id: "P101", name: "John Doe", age: 45, condition: "Pneumonia", riskScore: 65, readmissionRisk: "Medium", lengthOfStay: 7, sepsisRisk: 0.3 },
  { id: "P102", name: "Jane Smith", age: 62, condition: "Heart Failure", riskScore: 85, readmissionRisk: "High", lengthOfStay: 12, sepsisRisk: 0.7 },
  { id: "P103", name: "Robert Johnson", age: 50, condition: "Sepsis", riskScore: 75, readmissionRisk: "High", lengthOfStay: 10, sepsisRisk: 0.9 },
  { id: "P104", name: "Emily White", age: 33, condition: "Asthma Exacerbation", riskScore: 40, readmissionRisk: "Low", lengthOfStay: 3, sepsisRisk: 0.1 },
  { id: "P105", name: "Michael Brown", age: 78, condition: "COPD", riskScore: 90, readmissionRisk: "Very High", lengthOfStay: 15, sepsisRisk: 0.6 },
  { id: "P106", name: "Sarah Davis", age: 29, condition: "Appendicitis", riskScore: 20, readmissionRisk: "Low", lengthOfStay: 2, sepsisRisk: 0.05 },
];

const riskScoreDistribution = initialPatientData.reduce((acc, p) => {
  if (p.riskScore >= 75) acc.High++;
  else if (p.riskScore >= 50) acc.Medium++;
  else acc.Low++;
  return acc;
}, { High: 0, Medium: 0, Low: 0 });

const riskDistributionData = [
  { name: 'Low Risk', value: riskScoreDistribution.Low, color: '#22c55e' },
  { name: 'Medium Risk', value: riskScoreDistribution.Medium, color: '#f59e0b' },
  { name: 'High Risk', value: riskScoreDistribution.High, color: '#ef4444' },
];

const sepsisRiskOverTime = [
  { date: 'Mon', avgRisk: 0.4 }, { date: 'Tue', avgRisk: 0.45 }, { date: 'Wed', avgRisk: 0.38 },
  { date: 'Thu', avgRisk: 0.5 }, { date: 'Fri', avgRisk: 0.55 }, { date: 'Sat', avgRisk: 0.42 },
  { date: 'Sun', avgRisk: 0.47 },
];

const Analytics = () => {
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientData[0].id);
  const selectedPatient = initialPatientData.find(p => p.id === selectedPatientId) || initialPatientData[0];

  const patientConditionData = [
    { name: 'Pneumonia', count: initialPatientData.filter(p=>p.condition === "Pneumonia").length },
    { name: 'Heart Failure', count: initialPatientData.filter(p=>p.condition === "Heart Failure").length },
    { name: 'Sepsis', count: initialPatientData.filter(p=>p.condition === "Sepsis").length },
    { name: 'Asthma', count: initialPatientData.filter(p=>p.condition === "Asthma Exacerbation").length },
    { name: 'COPD', count: initialPatientData.filter(p=>p.condition === "COPD").length },
    { name: 'Appendicitis', count: initialPatientData.filter(p=>p.condition === "Appendicitis").length },
  ].filter(c => c.count > 0);


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold gradient-text">Patient Analytics Dashboard</h1>
         <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
            <SelectTrigger className="w-full md:w-[220px] input-gradient">
              <SelectValue placeholder="Select Patient for Detailed View" />
            </SelectTrigger>
            <SelectContent>
              {initialPatientData.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name} ({p.id})</SelectItem>
              ))}
            </SelectContent>
          </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialPatientData.length}</div>
            <p className="text-xs text-muted-foreground">+2 since last week</p>
          </CardContent>
        </Card>
        <Card className="glass-card card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Risk Score</CardTitle>
            <Activity className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(initialPatientData.reduce((sum, p) => sum + p.riskScore, 0) / initialPatientData.length).toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">Overall ICU population</p>
          </CardContent>
        </Card>
        <Card className="glass-card card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">High Risk Patients</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{riskScoreDistribution.High}</div>
            <p className="text-xs text-muted-foreground">{((riskScoreDistribution.High / initialPatientData.length) * 100).toFixed(0)}% of total</p>
          </CardContent>
        </Card>
         <Card className="glass-card card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Length of Stay</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                {(initialPatientData.reduce((sum, p) => sum + p.lengthOfStay, 0) / initialPatientData.length).toFixed(1)} days
            </div>
            <p className="text-xs text-muted-foreground">Projected vs. Actual</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-card">
          <CardHeader>
            <CardTitle className="flex items-center"><BarChart2 className="mr-2 h-5 w-5 text-primary" />Patient Condition Distribution</CardTitle>
            <CardDescription>Breakdown of primary conditions among current patients.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patientConditionData} layout="vertical" margin={{ left: 30, right: 20}}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip wrapperStyle={{fontSize: "12px"}}/>
                <Legend />
                <Bar dataKey="count" name="Number of Patients" fill="var(--chart-primary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center"><PieIcon className="mr-2 h-5 w-5 text-primary" />Overall Risk Profile</CardTitle>
            <CardDescription>Distribution of patients by risk category.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip wrapperStyle={{fontSize: "12px"}} />
                <Legend wrapperStyle={{fontSize: "12px"}} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary" />Sepsis Risk Trend (ICU Average)</CardTitle>
          <CardDescription>Average sepsis prediction scores over the last 7 days for the entire ICU.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sepsisRiskOverTime}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" tick={{fontSize: 12}} />
              <YAxis domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} tick={{fontSize: 12}}/>
              <Tooltip formatter={(value) => `${(value * 100).toFixed(1)}%`} wrapperStyle={{fontSize: "12px"}}/>
              <Legend wrapperStyle={{fontSize: "12px"}} />
              <Line type="monotone" dataKey="avgRisk" name="Average Sepsis Risk" stroke="var(--chart-accent)" strokeWidth={2} dot={{r:4}} activeDot={{r:6}} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Detailed Analytics for: {selectedPatient.name}</CardTitle>
          <CardDescription>Condition: {selectedPatient.condition} | Age: {selectedPatient.age}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-primary/5">
                    <h4 className="text-sm font-medium text-muted-foreground">Risk Score</h4>
                    <p className="text-2xl font-bold">{selectedPatient.riskScore} / 100</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/5">
                    <h4 className="text-sm font-medium text-muted-foreground">Readmission Risk</h4>
                    <p className={`text-2xl font-bold ${selectedPatient.readmissionRisk.includes("High") ? 'text-red-500' : selectedPatient.readmissionRisk.includes("Medium") ? 'text-yellow-500' : 'text-green-500'}`}>{selectedPatient.readmissionRisk}</p>
                </div>
                 <div className="p-4 rounded-lg bg-primary/5">
                    <h4 className="text-sm font-medium text-muted-foreground">Predicted Length of Stay</h4>
                    <p className="text-2xl font-bold">{selectedPatient.lengthOfStay} days</p>
                </div>
            </div>
             <div className="p-4 rounded-lg bg-primary/5">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Individual Sepsis Risk: {(selectedPatient.sepsisRisk * 100).toFixed(0)}%</h4>
                <div className="w-full bg-muted rounded-full h-2.5">
                    <div className={`bg-${selectedPatient.sepsisRisk > 0.6 ? 'red' : selectedPatient.sepsisRisk > 0.3 ? 'yellow' : 'green'}-500 h-2.5 rounded-full`} style={{ width: `${selectedPatient.sepsisRisk * 100}%` }}></div>
                </div>
            </div>
             <p className="text-sm text-muted-foreground">
                Patient {selectedPatient.name} shows a {selectedPatient.readmissionRisk.toLowerCase()} risk of readmission within 30 days.
                The current sepsis prediction score is {(selectedPatient.sepsisRisk * 100).toFixed(0)}%.
                Monitoring of key indicators is recommended.
            </p>
        </CardContent>
      </Card>

    </motion.div>
  );
};

export default Analytics;
