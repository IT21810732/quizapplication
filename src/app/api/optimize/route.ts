import { optimizeQuestions } from "@/lib/optimizer";

export async function POST(req: Request) {
  const { quizId, totalTime } = await req.json();

  const { data } = await supabase
    .from("questions")
    .select("*")
    .eq("quiz_id", quizId);

  const result = optimizeQuestions(data!, totalTime);

  return NextResponse.json(result);
}
