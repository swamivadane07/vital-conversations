import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversation = [] } = await req.json();
    console.log('Received chat request:', { message, conversationLength: conversation.length });

    // Build context from conversation history
    const context = conversation.map((msg: any) => 
      `${msg.role === 'user' ? 'Patient' : 'AI Doctor'}: ${msg.content}`
    ).join('\n');

    const medicalPrompt = `You are a helpful medical AI assistant. You provide general health information and guidance, but always remind users to consult healthcare professionals for serious concerns.

Previous conversation:
${context}

Patient: ${message}

AI Doctor:`;

    // Use Hugging Face Inference API with authentication
    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!hfToken) {
      throw new Error('Hugging Face access token not configured');
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hfToken}`,
        },
        body: JSON.stringify({
          inputs: medicalPrompt,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7,
            do_sample: true,
            pad_token_id: 50256
          }
        }),
      }
    );

    if (!response.ok) {
      console.error('Hugging Face API error:', response.status, response.statusText);
      // Fallback response
      return new Response(JSON.stringify({ 
        response: "I'm here to help with your health questions. Could you please provide more details about your concern? Remember to consult with healthcare professionals for serious medical issues."
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Hugging Face response:', data);

    // Extract response text
    let aiResponse = '';
    if (Array.isArray(data) && data[0]?.generated_text) {
      aiResponse = data[0].generated_text.replace(medicalPrompt, '').trim();
    } else {
      aiResponse = "I understand you have a health concern. Could you provide more specific details so I can better assist you? Please remember that I provide general information only, and you should consult healthcare professionals for proper medical advice.";
    }

    // Ensure medical disclaimer is included
    if (!aiResponse.includes('consult') && !aiResponse.includes('healthcare professional')) {
      aiResponse += "\n\nPlease remember to consult with healthcare professionals for proper medical diagnosis and treatment.";
    }

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process chat request',
      response: "I'm experiencing technical difficulties. Please try again later, and remember to consult healthcare professionals for urgent medical concerns."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});