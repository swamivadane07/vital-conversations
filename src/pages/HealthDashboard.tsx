import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Heart, TrendingUp, Calendar, Download, Clock, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';

const healthMetrics = [
  { date: '2024-01', bloodPressure: 120, heartRate: 72, weight: 70 },
  { date: '2024-02', bloodPressure: 118, heartRate: 74, weight: 69.5 },
  { date: '2024-03', bloodPressure: 115, heartRate: 70, weight: 69 },
  { date: '2024-04', bloodPressure: 122, heartRate: 73, weight: 68.5 },
  { date: '2024-05', bloodPressure: 119, heartRate: 71, weight: 68 },
  { date: '2024-06', bloodPressure: 116, heartRate: 69, weight: 67.5 }
];

const appointmentData = [
  { month: 'Jan', appointments: 2 },
  { month: 'Feb', appointments: 3 },
  { month: 'Mar', appointments: 1 },
  { month: 'Apr', appointments: 4 },
  { month: 'May', appointments: 2 },
  { month: 'Jun', appointments: 3 }
];

const healthGoals = [
  { name: 'Daily Steps', current: 8500, target: 10000, color: 'hsl(var(--primary))' },
  { name: 'Water Intake', current: 6, target: 8, color: 'hsl(var(--accent))' },
  { name: 'Sleep Hours', current: 7.2, target: 8, color: 'hsl(var(--secondary))' },
  { name: 'Exercise Minutes', current: 25, target: 30, color: 'hsl(var(--destructive))' }
];

const labResults = [
  { name: 'Cholesterol', value: 180, status: 'Normal', color: '#10b981' },
  { name: 'Blood Sugar', value: 95, status: 'Normal', color: '#10b981' },
  { name: 'Vitamin D', value: 28, status: 'Low', color: '#f59e0b' },
  { name: 'Iron', value: 140, status: 'Normal', color: '#10b981' }
];

export default function HealthDashboard() {
  const [selectedMetric, setSelectedMetric] = useState('bloodPressure');

  const exportToPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(20);
    pdf.text('Health Dashboard Report', 20, 20);
    
    pdf.setFontSize(14);
    pdf.text('Generated on: ' + new Date().toLocaleDateString(), 20, 40);
    
    pdf.setFontSize(12);
    let yPosition = 60;
    
    pdf.text('Health Metrics Summary:', 20, yPosition);
    yPosition += 20;
    
    healthMetrics.forEach((metric, index) => {
      pdf.text(`${metric.date}: BP ${metric.bloodPressure}, HR ${metric.heartRate}, Weight ${metric.weight}kg`, 25, yPosition);
      yPosition += 15;
    });
    
    pdf.save('health-dashboard-report.pdf');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-background to-accent/10">
      <motion.div 
        className="max-w-7xl mx-auto p-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
          {/* Header */}
          <motion.div 
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
            variants={cardVariants}
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Health Dashboard</h1>
              <p className="text-muted-foreground">Track your health journey and progress</p>
            </div>
            <Button onClick={exportToPDF} className="bg-gradient-primary hover:opacity-90 self-start sm:self-auto">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              { title: 'Total Appointments', value: '15', icon: Calendar, color: 'text-primary' },
              { title: 'Lab Tests Completed', value: '8', icon: Activity, color: 'text-accent' },
              { title: 'Health Score', value: '92/100', icon: Heart, color: 'text-secondary' },
              { title: 'Days Streak', value: '23', icon: TrendingUp, color: 'text-destructive' }
            ].map((stat, index) => (
              <motion.div key={stat.title} variants={cardVariants}>
                <Card className="relative overflow-hidden shadow-card hover:shadow-medical transition-shadow">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-xl lg:text-2xl font-bold">{stat.value}</p>
                      </div>
                      <stat.icon className={`w-6 h-6 lg:w-8 lg:h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Health Metrics Chart */}
          <motion.div variants={cardVariants}>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                  <BarChart3 className="w-5 h-5" />
                  Health Metrics Trends
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  {['bloodPressure', 'heartRate', 'weight'].map((metric) => (
                    <Button
                      key={metric}
                      variant={selectedMetric === metric ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedMetric(metric)}
                      className="text-xs"
                    >
                      {metric.charAt(0).toUpperCase() + metric.slice(1).replace(/([A-Z])/g, ' $1')}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={healthMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey={selectedMetric} 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary) / 0.2)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Health Goals */}
            <motion.div variants={cardVariants}>
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg lg:text-xl">Daily Health Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {healthGoals.map((goal, index) => (
                    <div key={goal.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{goal.name}</span>
                        <span className="text-muted-foreground">{goal.current} / {goal.target}</span>
                      </div>
                      <Progress 
                        value={(goal.current / goal.target) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Lab Results */}
            <motion.div variants={cardVariants}>
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg lg:text-xl">Recent Lab Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {labResults.map((result, index) => (
                      <div key={result.name} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <div>
                          <p className="font-medium text-sm lg:text-base">{result.name}</p>
                          <p className="text-xs lg:text-sm text-muted-foreground">Value: {result.value}</p>
                        </div>
                        <div className="text-right">
                          <span 
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: result.color + '20',
                              color: result.color 
                            }}
                          >
                            {result.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Appointment Analytics */}
          <motion.div variants={cardVariants}>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl">Appointment Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={appointmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="appointments" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
    </div>
  );
}