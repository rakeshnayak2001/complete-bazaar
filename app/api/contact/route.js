import sendMail from "@/lib/sendMail";
import toast from "react-hot-toast";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await sendMail(email, `New contact form submission from ${name}`, message, name);
    
    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully!" }),
     
      { status: 200, headers: { "Content-Type": "application/json" } },
     
    );
    
  } catch (error) {
    console.error("Email error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Email failed to send.",
        error: error.message 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Optionally add other HTTP methods if needed
export async function GET() {
  return new Response(
    JSON.stringify({ message: "Method not allowed" }),
    { status: 405, headers: { "Content-Type": "application/json" } }
  );
}