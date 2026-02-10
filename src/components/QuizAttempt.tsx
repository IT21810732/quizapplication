"use client";

import { useState } from "react";
import { Question, Quiz } from "@/types";
import { useRouter } from "next/navigation";

interface QuizAttemptProps {
    quiz: Quiz;
    questions: Question[];
}

export default function QuizAttempt({ quiz, questions }: QuizAttemptProps) {
    const router = useRouter();
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
    const [timeLimit, setTimeLimit] = useState<number>(0);
    const [optimalSet, setOptimalSet] = useState<Question[] | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleAnswerChange = (questionId: string, answer: string) => {
        setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
    };

    const handleOptimize = async () => {
        setMessage(null);
        if (timeLimit <= 0) {
            setMessage({ type: "error", text: "Please enter a valid time limit." });
            return;
        }

        try {
            const res = await fetch("/api/optimize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quizId: quiz.id, totalTime: timeLimit }),
            });

            if (!res.ok) throw new Error("Failed to calculate optimal set");

            const recommendedQuestions: Question[] = await res.json();
            setOptimalSet(recommendedQuestions);
            setMessage({ type: "success", text: "Optimization complete! Recommended questions are highlighted." });
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: "Error calculating optimal set." });
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setMessage(null);

        // Simple validation: Ensure at least one answer is selected? Or allow partial submission.
        // Requirement says "Submit user answers".

        try {
            const promises = Object.entries(selectedAnswers).map(([questionId, answer]) =>
                fetch("/api/answers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_id: "00000000-0000-0000-0000-000000000000", // Dummy user ID since auth is optional
                        question_id: questionId,
                        selected_answer: answer,
                    }),
                })
            );

            await Promise.all(promises);

            setMessage({ type: "success", text: "Answers submitted successfully!" });
            setTimeout(() => router.push("/"), 2000);
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: "Failed to submit answers." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isRecommended = (qId: string) => optimalSet?.some((q) => q.id === qId);

    return (
        <div className="mx-auto max-w-3xl px-4 py-8">
            <div className="mb-8 border-b pb-4 dark:border-gray-700">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{quiz.title}</h1>
                {quiz.description && <p className="mt-2 text-gray-600 dark:text-gray-400">{quiz.description}</p>}
            </div>

            <div className="mb-8 rounded-lg bg-indigo-50 p-6 dark:bg-indigo-900/20">
                <h2 className="mb-4 text-xl font-semibold text-indigo-900 dark:text-indigo-200">
                    Maximize Your Score
                </h2>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                        <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Available Time (minutes)
                        </label>
                        <input
                            type="number"
                            id="timeLimit"
                            min="1"
                            value={timeLimit}
                            onChange={(e) => setTimeLimit(parseInt(e.target.value) || 0)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-gray-600 dark:text-white sm:text-sm p-2 bg-white"
                            placeholder="e.g. 30"
                        />
                    </div>
                    <button
                        onClick={handleOptimize}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                    >
                        Calculate Optimal Set
                    </button>
                </div>
                {optimalSet && (
                    <div className="mt-4 text-sm text-indigo-800 dark:text-indigo-300">
                        Recommended: {optimalSet.length} questions for total score:{" "}
                        <span className="font-bold">
                            {optimalSet.reduce((sum, q) => sum + q.score, 0)}
                        </span>
                    </div>
                )}
            </div>
            {message && (
                <div
                    className={`mb-6 rounded-md p-4 ${message.type === "success"
                            ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                >
                    {message.text}
                </div>
            )}

            <div className="space-y-6">
                {questions.map((q, index) => (
                    <div
                        key={q.id}
                        className={`rounded-lg border p-6 transition-all ${isRecommended(q.id)
                                ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-900/10"
                                : "border-gray-200 bg-white dark:border-gray-700 dark:bg-zinc-900"
                            }`}
                    >
                        <div className="mb-4 flex items-start justify-between">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                <span className="mr-2 text-gray-400">#{index + 1}</span>
                                {q.question_text}
                            </h3>
                            <div className="flex gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 dark:bg-gray-800">
                                    ⚡ {q.score} pts
                                </span>
                                <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 dark:bg-gray-800">
                                    ⏱️ {q.time_required} min
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {/* Assuming questions might be multiple choice or text. The schema has 'selected_answer' as text. 
                  Since 'options' aren't in the schema, I'll assume text input or simple Yes/No/Options placeholders.
                  Given requirements didn't specify options table/column, I will use a Text Input for generic answer 
                  or a simple "True/False" if it was boolean.
                  But let's stick to a simple Text Input for flexibility unless I see 'options' in schema (I didn't). 
                  Wait, schema: `questions` table has `question_text`, `score`, `time_required`. No options.
                  So it's either open text or I should invent options. 
                  Let's use a Text Area for the answer.
              */}
                            <textarea
                                rows={2}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-gray-600 dark:text-white sm:text-sm p-2 w-full border"
                                placeholder="Type your answer here..."
                                value={selectedAnswers[q.id] || ""}
                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="rounded-md bg-green-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-green-500 dark:hover:bg-green-400"
                >
                    {isSubmitting ? "Submitting..." : "Submit Answers"}
                </button>
            </div>
        </div>
    );
}
