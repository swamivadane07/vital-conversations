import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { sessionId } = await req.json();
    
    // Authenticate user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated");

    console.log("Processing appointment confirmation for session:", sessionId);

    // Initialize Stripe and get session details
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    const metadata = session.metadata!;
    
    // Create appointment record in database
    const { data: appointment, error } = await supabaseClient
      .from("appointments")
      .insert({
        user_id: user.id,
        patient_name: metadata.patient_name,
        contact_number: user.phone || "Not provided",
        appointment_type: metadata.appointment_type,
        doctor_type: "General Practitioner",
        appointment_date: metadata.appointment_date,
        appointment_time: metadata.appointment_time,
        reason: "Scheduled via online booking",
        status: "confirmed",
        payment_status: "paid",
        payment_id: session.payment_intent as string,
        total_amount: session.amount_total! / 100, // Convert from cents
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw new Error("Failed to create appointment record");
    }

    console.log("Appointment created:", appointment.id);

    // Send confirmation email
    const emailResponse = await resend.emails.send({
      from: "Healthcare Assistant <onboarding@resend.dev>",
      to: [user.email],
      subject: "Appointment Confirmation - Your Healthcare Visit",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; text-align: center;">Appointment Confirmed!</h1>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #334155; margin-bottom: 15px;">Appointment Details</h2>
            <p><strong>Patient:</strong> ${metadata.patient_name}</p>
            <p><strong>Date:</strong> ${metadata.appointment_date}</p>
            <p><strong>Time:</strong> ${metadata.appointment_time}</p>
            <p><strong>Type:</strong> ${metadata.appointment_type}</p>
            <p><strong>Amount Paid:</strong> $${(session.amount_total! / 100).toFixed(2)}</p>
            <p><strong>Confirmation ID:</strong> ${appointment.id}</p>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-bottom: 10px;">Important Reminders</h3>
            <ul style="color: #92400e; margin: 0; padding-left: 20px;">
              <li>Please arrive 15 minutes early for your appointment</li>
              <li>Bring a valid ID and insurance card if applicable</li>
              <li>Prepare any questions or concerns you'd like to discuss</li>
            </ul>
          </div>

          <p style="text-align: center; color: #64748b;">
            Need to reschedule? Contact us or visit your dashboard to manage your appointments.
          </p>
        </div>
      `,
    });

    console.log("Confirmation email sent:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      appointmentId: appointment.id,
      emailSent: true 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-appointment-confirmation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});