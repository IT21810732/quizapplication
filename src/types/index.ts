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
  