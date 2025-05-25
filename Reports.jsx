
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Filter, FileText, CalendarDays, UserCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const initialReports = [
  { id: "REP001", patientName: "John Doe", patientId: "P101", type: "Discharge Summary", date: "2025-05-10", status: "Completed", physician: "Dr. Smith" },
  { id: "REP002", patientName: "Jane Smith", patientId: "P102", type: "Progress Note", date: "2025-05-12", status: "Pending Review", physician: "Dr. Emily Jones" },
  { id: "REP003", patientName: "Robert Johnson", patientId: "P103", type: "Sepsis Alert Report", date: "2025-05-08", status: "Completed", physician: "Dr. Brown" },
  { id: "REP004", patientName: "Emily White", patientId: "P104", type: "Consultation Note", date: "2025-05-11", status: "Generated", physician: "Dr. Davis" },
  { id: "REP005", patientName: "John Doe", patientId: "P101", type: "Lab Results Summary", date: "2025-05-09", status: "Completed", physician: "Lab System" },
];

const ReportCard = ({ report }) => {
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Download Initiated",
      description: `Downloading report: ${report.type} for ${report.patientName}.`,
    });
    // Simulate download
    const content = `Report ID: ${report.id}\nPatient: ${report.patientName} (${report.patientId})\nType: ${report.type}\nDate: ${report.date}\nPhysician: ${report.physician}\nStatus: ${report.status}\n\nThis is a simulated report content.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${report.type.replace(/\s+/g, '_')}_${report.patientId}_${report.date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-card card-hover">
        <CardHeader className="p-4 bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-primary"/>
                <CardTitle className="text-md">{report.type}</CardTitle>
            </div>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
                report.status === "Completed" ? "bg-green-500/20 text-green-600" :
                report.status === "Pending Review" ? "bg-yellow-500/20 text-yellow-600" :
                "bg-blue-500/20 text-blue-600"
            }`}>
                {report.status}
            </span>
          </div>
          <CardDescription className="text-xs pt-1">For: {report.patientName} (ID: {report.patientId})</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 mr-2"/> Date: {report.date}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
                <UserCircle className="h-4 w-4 mr-2"/> Physician: {report.physician}
            </div>
        </CardContent>
        <div className="p-4 border-t border-border/50 flex justify-end">
            <Button variant="default" size="sm" onClick={handleDownload} className="gradient-bg text-white">
                <Download className="mr-2 h-4 w-4"/> Download
            </Button>
        </div>
      </Card>
    </motion.div>
  );
};

const Reports = () => {
  const [reports, setReports] = useState(initialReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || report.type === filterType;
    const matchesStatus = filterStatus === "all" || report.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const reportTypes = ["all", ...new Set(initialReports.map(r => r.type))];
  const reportStatuses = ["all", ...new Set(initialReports.map(r => r.status))];
  
  const { toast } = useToast();
  
  const handleGenerateReport = () => {
    toast({
      title: "Generate New Report",
      description: "This would open a modal or navigate to a report generation interface.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold gradient-text">Patient Reports</h1>
        <Button className="gradient-bg text-white" onClick={handleGenerateReport}>
          <FileText className="mr-2 h-4 w-4" /> Generate New Report
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Filter & Search Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name, ID, or report type..."
              className="pl-8 input-gradient"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="input-gradient">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map(type => (
                  <SelectItem key={type} value={type}>{type === "all" ? "All Types" : type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="input-gradient">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                {reportStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status === "all" ? "All Statuses" : status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      ) : (
         <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No Reports Found</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Your search or filter criteria did not match any reports. Try different keywords or adjust filters.
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default Reports;
