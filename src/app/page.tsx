import { supabase } from "@/lib/supabaseClient";
import { Quiz } from "@/types";
import Link from "next/link";

export const revalidate = 0; // Disable static calculation

export default async function Home() {
  const { data: quizzes, error } = await supabase.from("quizzes").select("*");

  if (error) {
    console.error("Error fetching quizzes:", error);
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-red-500">
        Error loading quizzes. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-black">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Available Quizzes
          </h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Select a quiz to test your knowledge and maximize your score!
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes?.map((quiz: Quiz) => (
            <Link
              key={quiz.id}
              href={`/quizzes/${quiz.id}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-lg hover:ring-gray-900/10 dark:bg-zinc-900 dark:ring-white/10 dark:hover:ring-white/20"
            >
              <div>
                <h3 className="text-lg font-semibold leading-6 text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                  {quiz.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400 line-clamp-3">
                  {quiz.description || "No description available."}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-x-2 text-sm font-semibold leading-6 text-indigo-600 dark:text-indigo-400">
                Start Quiz <span aria-hidden="true">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>

        {(!quizzes || quizzes.length === 0) && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No quizzes found. Check back later!
          </div>
        )}
      </div>
    </div>
  );
}
