import { AppointmentScheduler } from "@/components/sidebar/AppointmentScheduler";

const ScheduleAppointment = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Schedule Appointment</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Book with healthcare providers quickly and easily.
        </p>
        <div className="mt-6">
          <AppointmentScheduler />
        </div>
      </div>
    </div>
  );
};

export default ScheduleAppointment;