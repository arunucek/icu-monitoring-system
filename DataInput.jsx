
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const DataInput = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientId: "",
    age: "",
    temperature: "",
    heartRate: "",
    bloodPressure: "",
    oxygenSaturation: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Store data in localStorage
    const existingData = JSON.parse(localStorage.getItem('patientData') || '[]');
    const newData = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('patientData', JSON.stringify([...existingData, newData]));

    // Show success message
    toast({
      title: "Data saved successfully",
      description: `Patient data for ID: ${formData.patientId} has been recorded`,
      variant: "default",
    });

    // Clear form
    setFormData({
      patientId: "",
      age: "",
      temperature: "",
      heartRate: "",
      bloodPressure: "",
      oxygenSaturation: "",
    });
  };

  const handleClear = () => {
    setFormData({
      patientId: "",
      age: "",
      temperature: "",
      heartRate: "",
      bloodPressure: "",
      oxygenSaturation: "",
    });
    toast({
      title: "Form cleared",
      description: "All input fields have been cleared",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            <CardTitle className="text-lg font-medium">Patient Data Input</CardTitle>
          </div>
          <CardDescription className="text-white/80">
            Enter new patient vital signs and measurements
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  name="patientId"
                  placeholder="Enter patient ID"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="Enter age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  name="temperature"
                  type="number"
                  step="0.1"
                  placeholder="Enter temperature"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                <Input
                  id="heartRate"
                  name="heartRate"
                  type="number"
                  placeholder="Enter heart rate"
                  value={formData.heartRate}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="bloodPressure">Blood Pressure</Label>
                <Input
                  id="bloodPressure"
                  name="bloodPressure"
                  placeholder="e.g., 120/80"
                  value={formData.bloodPressure}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                <Input
                  id="oxygenSaturation"
                  name="oxygenSaturation"
                  type="number"
                  max="100"
                  placeholder="Enter SpO2"
                  value={formData.oxygenSaturation}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Data
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DataInput;
