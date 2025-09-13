import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface STKPushRequest {
  phone: string;
  amount: number;
  skillCardData: {
    name: string;
    skill_category: string;
    bio: string;
    location: string;
    phone: string;
    email: string;
    user_id: string;
  };
}

interface MpesaCallback {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: any;
        }>;
      };
    };
  };
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Get Mpesa access token
async function getMpesaAccessToken(): Promise<string> {
  const consumerKey = Deno.env.get('MPESA_CONSUMER_KEY');
  const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET');
  
  if (!consumerKey || !consumerSecret) {
    throw new Error('Mpesa credentials not configured');
  }

  const auth = btoa(`${consumerKey}:${consumerSecret}`);
  
  const response = await fetch('https://sandbox-api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get Mpesa access token');
  }

  const data = await response.json();
  return data.access_token;
}

// Generate password for STK push
function generatePassword(shortcode: string, passkey: string, timestamp: string): string {
  return btoa(shortcode + passkey + timestamp);
}

// Initiate STK Push
async function initiateSTKPush(phone: string, amount: number, skillCardData: any): Promise<any> {
  const accessToken = await getMpesaAccessToken();
  const shortcode = Deno.env.get('MPESA_BUSINESS_SHORTCODE');
  const passkey = Deno.env.get('MPESA_PASSKEY');
  
  if (!shortcode || !passkey) {
    throw new Error('Mpesa configuration incomplete');
  }

  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const password = generatePassword(shortcode, passkey, timestamp);
  
  // Format phone number (remove leading 0 and add 254)
  let formattedPhone = phone.replace(/^0/, '254');
  if (!formattedPhone.startsWith('254')) {
    formattedPhone = '254' + formattedPhone;
  }

  // Store pending payment in database
  const { data: paymentData, error: paymentError } = await supabase
    .from('payments')
    .insert({
      user_id: skillCardData.user_id,
      amount: amount,
      currency: 'KES',
      payment_method: 'mpesa',
      status: 'pending'
    })
    .select()
    .single();

  if (paymentError) {
    console.error('Error creating payment record:', paymentError);
    throw new Error('Failed to create payment record');
  }

  const stkPushPayload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: formattedPhone,
    PartyB: shortcode,
    PhoneNumber: formattedPhone,
    CallBackURL: `https://hjsbrauutylvyyxpvglr.supabase.co/functions/v1/mpesa-payment/callback`,
    AccountReference: `SkillCard-${paymentData.id}`,
    TransactionDesc: 'Skill Card Africa - Verification Fee'
  };

  console.log('Initiating STK Push:', { phone: formattedPhone, amount });

  const response = await fetch('https://sandbox-api.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stkPushPayload),
  });

  if (!response.ok) {
    throw new Error(`STK Push failed: ${response.statusText}`);
  }

  const responseData = await response.json();
  console.log('STK Push response:', responseData);

  // Store skill card data temporarily with payment reference
  if (responseData.CheckoutRequestID) {
    await supabase
      .from('payments')
      .update({
        payment_reference: responseData.CheckoutRequestID,
        // Store skill card data as metadata
        // We'll create the actual skill card only after successful payment
      })
      .eq('id', paymentData.id);

    // Store skill card data in a temporary table or as metadata
    // For now, we'll store it in the payment record as JSON
    const skillCardJson = JSON.stringify(skillCardData);
    await supabase
      .from('payments')
      .update({
        // Add a metadata column or use existing column to store skill card data
      })
      .eq('id', paymentData.id);
  }

  return {
    success: true,
    checkoutRequestId: responseData.CheckoutRequestID,
    paymentId: paymentData.id
  };
}

// Handle Mpesa callback
async function handleMpesaCallback(callbackData: MpesaCallback): Promise<void> {
  console.log('Received Mpesa callback:', JSON.stringify(callbackData, null, 2));
  
  const { stkCallback } = callbackData.Body;
  const { CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

  // Find payment record
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .select('*')
    .eq('payment_reference', CheckoutRequestID)
    .single();

  if (paymentError || !payment) {
    console.error('Payment not found:', CheckoutRequestID);
    return;
  }

  if (ResultCode === 0) {
    // Payment successful
    console.log('Payment successful for:', CheckoutRequestID);
    
    // Update payment status
    await supabase
      .from('payments')
      .update({ status: 'completed' })
      .eq('id', payment.id);

    // TODO: Create skill card from stored data
    // For now, we'll need to retrieve the skill card data that was stored
    // This requires modifying the payments table to store skill card metadata
    
  } else {
    // Payment failed
    console.log('Payment failed:', ResultDesc);
    
    // Update payment status
    await supabase
      .from('payments')
      .update({ status: 'failed' })
      .eq('id', payment.id);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname;

  try {
    if (path.endsWith('/callback') && req.method === 'POST') {
      // Handle Mpesa callback
      const callbackData: MpesaCallback = await req.json();
      await handleMpesaCallback(callbackData);
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } 
    else if (req.method === 'POST') {
      // Initiate STK Push
      const { phone, amount, skillCardData }: STKPushRequest = await req.json();
      
      if (!phone || !amount || !skillCardData) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const result = await initiateSTKPush(phone, amount, skillCardData);
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    else {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error: any) {
    console.error('Error in mpesa-payment function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});