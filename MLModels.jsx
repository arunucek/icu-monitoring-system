
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Plus, Zap, History, Settings } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ModelCard = ({ name, accuracy, status, lastRun }) => (
  <Card className="glass-card card-hover">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-muted-foreground">Last run: {lastRun}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Accuracy</span>
          <span className="text-sm font-medium">{accuracy}%</span>
        </div>
        <Progress value={accuracy} className="h-2" />
        <div className="flex justify-between items-center">
          <span className={`text-sm ${status === 'Active' ? 'text-green-500' : 'text-yellow-500'}`}>
            {status}
          </span>
          <Button variant="outline" size="sm">
            <Zap className="h-4 w-4 mr-1" />
            Run
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const MLModels = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ML Models Management</h1>
        <Button className="gradient-bg">
          <Plus className="mr-2 h-4 w-4" />
          Deploy New Model
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ModelCard
          name="Sepsis Prediction"
          accuracy={95}
          status="Active"
          lastRun="2h ago"
        />
        <ModelCard
          name="Mortality Risk"
          accuracy={88}
          status="Training"
          lastRun="1d ago"
        />
        <ModelCard
          name="Length of Stay"
          accuracy={92}
          status="Active"
          lastRun="5h ago"
        />
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Model Performance History</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-3 rounded-lg bg-background/50">
                <History className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium">Performance Update #{i}</h4>
                  <p className="text-sm text-muted-foreground">Accuracy improved by 2.5%</p>
                </div>
                <span className="text-sm text-muted-foreground">{i}h ago</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MLModels;
