import { optimizeQuestions } from "@/lib/optimizer";
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { quizId, totalTime } = await req.json();

    if (!quizId || totalTime === undefined) {
      return NextResponse.json(
        { error: "Missing quizId or totalTime" },
        { status: 400 }
      );
    }

    const { data: questions, error } = await supabase
      .from("questions")
      .select("*")
      .eq("quiz_id", quizId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const result = optimizeQuestions(questions, totalTime);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
