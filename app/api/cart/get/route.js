import connectDB from "@/config/db";
import User from "@/models/User";

import { NextResponse } from "next/server";

import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    await connectDB();
    const user = await User.findById(userId);
    const { cartItems } = user;
    return NextResponse.json({ success: true, cartItems });
  } catch {
    return NextResponse.json({ success: false, message: error.message });
  }
}
