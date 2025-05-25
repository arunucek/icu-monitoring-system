
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import PatientVitals from "@/components/dashboard/PatientVitals";
import MLModelCard from "@/components/dashboard/MLModelCard";
import DataSourceCard from "@/components/dashboard/DataSourceCard";
import DataUploader from "@/components/dashboard/DataUploader";
import DataInput from "@/components/dashboard/DataInput";
import PredictionChart from "@/components/dashboard/PredictionChart";
import ModelPerformance from "@/components/dashboard/ModelPerformance";
import { Separator } from "@/components/ui/separator";
import { Outlet, useLocation } from "react-router-dom";

const Dashboard = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedPatientVitals, setSelectedPatientVitals] = useState(null);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const storedPatientVitals = localStorage.getItem("selectedPatientData");
    if (storedPatientVitals) {
      setSelectedPatientVitals(JSON.parse(storedPatientVitals));
    }
    
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const data = {
          models: [
            {
              id: "sepsis-pred-v2",
              name: "Sepsis Prediction",
              description: "Early detection of sepsis using vital signs and lab values",
              accuracy: 92,
              status: "active",
              lastRun: "2 hours ago",
              predictions: 128,
              alerts: 3
            },
            {
              id: "resp-failure",
              name: "Respiratory Failure",
              description: "Predicts respiratory failure within 24 hours",
              accuracy: 89,
              status: "active",
              lastRun: "1 hour ago",
              predictions: 95,
              alerts: 1
            }
          ],
          dataSources: [
            {
              id: "ehr-data",
              name: "EHR System",
              description: "Electronic Health Records data source",
              status: "connected",
              lastSync: "10 minutes ago",
              recordCount: 1458,
              hasErrors: false
            },
            {
              id: "lab-results",
              name: "Laboratory System",
              description: "Lab test results data source",
              status: "connected",
              lastSync: "25 minutes ago",
              recordCount: 892,
              hasErrors: false
            }
          ]
        };
        
        setDashboardData(data);
        setIsLoading(false);
        
        if (location.pathname === "/dashboard" || location.pathname === "/") {
           toast({
            title: "Dashboard loaded",
            description: "All data sources connected successfully",
          });
        }
      } catch (error) {
        setIsLoading(false);
        toast({
          title: "Error loading dashboard",
          description: "There was a problem loading the dashboard data",
          variant: "destructive",
        });
      }
    };
    
    loadData();
  }, [toast, location.pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isDashboardHome = location.pathname === "/dashboard" || location.pathname === "/";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex-1 overflow-auto">
        <Header 
          toggleSidebar={toggleSidebar} 
          sidebarOpen={sidebarOpen} 
          user={user}
          onLogout={onLogout}
        />
        
        <main className="p-4 md:p-6 pb-16">
          {isDashboardHome ? (
            isLoading ? (
              <div className="flex flex-col items-center justify-center h-[80vh]">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-lg font-medium">Loading dashboard data...</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight gradient-text">
                      Welcome back, {user?.name}
                    </h1>
                    <p className="text-muted-foreground">
                      {selectedPatientVitals ? "Displaying selected patient's data." : "Machine Learning insights and patient monitoring"}
                    </p>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <PatientVitals patientData={selectedPatientVitals || dashboardData?.patientVitals} />
                  {dashboardData?.models.slice(0, 2).map((model) => (
                    <MLModelCard key={model.id} model={model} />
                  ))}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <PredictionChart />
                  <ModelPerformance />
                </div>
                
                <h2 className="text-xl font-semibold mt-8 mb-4 gradient-text">Data Management</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <DataInput />
                  <DataUploader />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboardData?.dataSources.map((source) => (
                    <DataSourceCard key={source.id} source={source} />
                  ))}
                </div>
              </motion.div>
            )
          ) : (
            <Outlet /> 
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
