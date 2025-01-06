import { API_URL, BEARER_TOKEN } from "@/lib/serverConstants";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/whales/transactions`,
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching whale transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch whale transactions" },
      { status: 500 }
    );
  }
}
