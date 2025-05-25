
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, Filter, Eye, Activity, Heart, Thermometer, Wind, Droplets, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const initialPatients = [
  {
    id: "P101",
    name: "John Doe",
    age: 45,
    condition: "Pneumonia",
    status: "Stable",
    lastUpdate: "1h ago",
    vitals: {
      heartRate: 75,
      bloodPressure: "120/80",
      temperature: 37.0,
      oxygenSaturation: 97,
      respiratoryRate: 18,
    },
  },
  {
    id: "P102",
    name: "Jane Smith",
    age: 62,
    condition: "Heart Failure",
    status: "Critical",
    lastUpdate: "15m ago",
    vitals: {
      heartRate: 95,
      bloodPressure: "100/60",
      temperature: 36.5,
      oxygenSaturation: 92,
      respiratoryRate: 24,
    },
  },
  {
    id: "P103",
    name: "Robert Johnson",
    age: 50,
    condition: "Sepsis",
    status: "Improving",
    lastUpdate: "30m ago",
    vitals: {
      heartRate: 88,
      bloodPressure: "110/70",
      temperature: 38.2,
      oxygenSaturation: 95,
      respiratoryRate: 20,
    },
  },
  {
    id: "P104",
    name: "Emily White",
    age: 33,
    condition: "Asthma Exacerbation",
    status: "Stable",
    lastUpdate: "2h ago",
    vitals: {
      heartRate: 80,
      bloodPressure: "115/75",
      temperature: 36.8,
      oxygenSaturation: 99,
      respiratoryRate: 16,
    },
  },
];

const PatientCard = ({ patient, onSelectPatient }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleViewDetails = () => {
    onSelectPatient(patient);
    toast({
      title: `Selected Patient: ${patient.name}`,
      description: `Displaying details for patient ID ${patient.id}.`,
    });
    navigate("/dashboard"); 
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-card card-hover overflow-hidden">
        <CardHeader className="p-4 bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-md font-semibold text-primary">{patient.name.substring(0, 2).toUpperCase()}</span>
              </div>
              <div>
                <CardTitle className="text-md">{patient.name}</CardTitle>
                <CardDescription className="text-xs">ID: {patient.id} | Age: {patient.age}</CardDescription>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              patient.status === "Critical" ? "bg-destructive/20 text-destructive" : 
              patient.status === "Improving" ? "bg-yellow-500/20 text-yellow-500" : "bg-green-500/20 text-green-500"
            }`}>
              {patient.status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <p className="text-sm"><strong className="text-muted-foreground">Condition:</strong> {patient.condition}</p>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center"><Heart className="w-3 h-3 mr-1 text-red-500" /> HR: {patient.vitals.heartRate} bpm</div>
            <div className="flex items-center"><Activity className="w-3 h-3 mr-1 text-blue-500" /> BP: {patient.vitals.bloodPressure}</div>
            <div className="flex items-center"><Thermometer className="w-3 h-3 mr-1 text-yellow-500" /> Temp: {patient.vitals.temperature}°C</div>
            <div className="flex items-center"><Droplets className="w-3 h-3 mr-1 text-green-500" /> SpO2: {patient.vitals.oxygenSaturation}%</div>
            <div className="flex items-center col-span-2"><Wind className="w-3 h-3 mr-1 text-purple-500" /> RR: {patient.vitals.respiratoryRate} bpm</div>
          </div>
          
          <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t border-border/50">
            <span>Last Update: {patient.lastUpdate}</span>
            <Button variant="ghost" size="sm" onClick={handleViewDetails} className="text-primary hover:text-primary/80 h-auto p-1">
              <Eye className="mr-1 h-3 w-3" /> View
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AddPatientDialog = ({ onAddPatient }) => {
  const [formData, setFormData] = useState({
    id: `P${Math.floor(100 + Math.random() * 900)}`, // Auto-generate ID
    name: "",
    age: "",
    condition: "",
    status: "Stable",
    vitals: {
      heartRate: "",
      bloodPressure: "",
      temperature: "",
      oxygenSaturation: "",
      respiratoryRate: "",
    }
  });
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("vitals.")) {
      const vitalName = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        vitals: { ...prev.vitals, [vitalName]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.age || !formData.condition) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    const newPatient = {
      ...formData,
      age: parseInt(formData.age),
      lastUpdate: "Just now",
      vitals: {
        heartRate: parseInt(formData.vitals.heartRate) || 0,
        bloodPressure: formData.vitals.bloodPressure || "N/A",
        temperature: parseFloat(formData.vitals.temperature) || 0,
        oxygenSaturation: parseInt(formData.vitals.oxygenSaturation) || 0,
        respiratoryRate: parseInt(formData.vitals.respiratoryRate) || 0,
      }
    };
    onAddPatient(newPatient);
    toast({
      title: "Patient Added",
      description: `${formData.name} has been added to the list.`,
    });
    setIsOpen(false); // Close dialog
    // Reset form
    setFormData({
      id: `P${Math.floor(100 + Math.random() * 900)}`,
      name: "", age: "", condition: "", status: "Stable",
      vitals: { heartRate: "", bloodPressure: "", temperature: "", oxygenSaturation: "", respiratoryRate: "" }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-bg text-white">
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] glass-card">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Enter the details for the new patient. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" placeholder="Patient's full name" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="age" className="text-right">Age</Label>
              <Input id="age" name="age" type="number" value={formData.age} onChange={handleInputChange} className="col-span-3" placeholder="Patient's age" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="condition" className="text-right">Condition</Label>
              <Input id="condition" name="condition" value={formData.condition} onChange={handleInputChange} className="col-span-3" placeholder="Primary medical condition" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <select id="status" name="status" value={formData.status} onChange={handleInputChange} className="col-span-3 p-2 border rounded-md bg-background">
                <option value="Stable">Stable</option>
                <option value="Improving">Improving</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <h4 className="font-semibold mt-2">Vitals</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vitals.heartRate">Heart Rate (bpm)</Label>
                <Input id="vitals.heartRate" name="vitals.heartRate" type="number" value={formData.vitals.heartRate} onChange={handleInputChange} placeholder="e.g., 70" />
              </div>
              <div>
                <Label htmlFor="vitals.bloodPressure">Blood Pressure (mmHg)</Label>
                <Input id="vitals.bloodPressure" name="vitals.bloodPressure" value={formData.vitals.bloodPressure} onChange={handleInputChange} placeholder="e.g., 120/80" />
              </div>
              <div>
                <Label htmlFor="vitals.temperature">Temperature (°C)</Label>
                <Input id="vitals.temperature" name="vitals.temperature" type="number" step="0.1" value={formData.vitals.temperature} onChange={handleInputChange} placeholder="e.g., 37.0" />
              </div>
              <div>
                <Label htmlFor="vitals.oxygenSaturation">SpO2 (%)</Label>
                <Input id="vitals.oxygenSaturation" name="vitals.oxygenSaturation" type="number" value={formData.vitals.oxygenSaturation} onChange={handleInputChange} placeholder="e.g., 98" />
              </div>
               <div>
                <Label htmlFor="vitals.respiratoryRate">Respiratory Rate (bpm)</Label>
                <Input id="vitals.respiratoryRate" name="vitals.respiratoryRate" type="number" value={formData.vitals.respiratoryRate} onChange={handleInputChange} placeholder="e.g., 16" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button type="submit" className="gradient-bg text-white">
              <UserPlus className="mr-2 h-4 w-4" /> Save Patient
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const storedPatients = JSON.parse(localStorage.getItem("patientDataList"));
    if (storedPatients && storedPatients.length > 0) {
      setPatients(storedPatients);
    } else {
      localStorage.setItem("patientDataList", JSON.stringify(initialPatients));
      setPatients(initialPatients);
    }
  }, []);

  const handleSelectPatient = (patient) => {
    localStorage.setItem("selectedPatientData", JSON.stringify(patient.vitals));
  };

  const handleAddPatient = (newPatient) => {
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    localStorage.setItem("patientDataList", JSON.stringify(updatedPatients));
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold gradient-text">Patients Management</h1>
        <AddPatientDialog onAddPatient={handleAddPatient} />
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Patient Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or condition..."
                className="pl-8 input-gradient"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} onSelectPatient={handleSelectPatient} />
          ))}
        </div>
      ) : (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No Patients Found</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Your search for "{searchTerm}" did not match any patients. Try different keywords or check filters.
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default Patients;
