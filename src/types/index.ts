export interface Quiz {
  id: string;
  title: string;
  description?: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  question_text: string;
  score: number;
  time_required: number;
}

export interface Answer {
  id: string;
  user_id: string;
  question_id: string;
  selected_answer: string;
}
