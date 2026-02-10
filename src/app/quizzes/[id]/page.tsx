import { supabase } from "@/lib/supabaseClient";
import QuizAttempt from "@/components/QuizAttempt";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch Quiz Details
    const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", id)
        .single();

    if (quizError || !quiz) {
        console.error("Error fetching quiz:", quizError);
        return notFound();
    }

    // Fetch Questions
    const { data: questions, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .eq("quiz_id", id);

    if (questionsError) {
        console.error("Error fetching questions:", questionsError);
        return (
            <div className="p-8 text-center text-red-500">
                Error loading questions.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 py-12 dark:bg-black">
            <QuizAttempt quiz={quiz} questions={questions || []} />
        </div>
    );
}
