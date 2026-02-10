import { Question } from "@/types";

export function optimizeQuestions(
  questions: Question[],
  totalTime: number
) {
  const n = questions.length;
  const dp = Array(n + 1)
    .fill(null)
    .map(() => Array(totalTime + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const { time_required, score } = questions[i - 1];

    for (let t = 0; t <= totalTime; t++) {
      if (time_required <= t) {
        dp[i][t] = Math.max(
          dp[i - 1][t],
          dp[i - 1][t - time_required] + score
        );
      } else {
        dp[i][t] = dp[i - 1][t];
      }
    }
  }

  let t = totalTime;
  const selected: Question[] = [];

  for (let i = n; i > 0; i--) {
    if (dp[i][t] !== dp[i - 1][t]) {
      selected.push(questions[i - 1]);
      t -= questions[i - 1].time_required;
    }
  }

  return selected.reverse();
}
