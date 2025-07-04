import connectDB from "@/config/db";
import Address from "@/models/Address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    // 🔐 Check if user is not authenticated
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: You must be logged in to add an address.",
        },
        { status: 401 }
      );
    }
    const { address } = await request.json();

    // Connect to the database
    await connectDB();
    const newAddress = await Address.create({ ...address, userId });
    return NextResponse.json({
      success: true,
      message: "Address added succcessfully",
      newAddress,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
