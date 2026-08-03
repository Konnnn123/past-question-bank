export interface Question {
  id: string;
  year: number;
  subject: string;
  category: string;
  tags: string[];
  question_number: string;
  content: string;
  images: string[];
  fileName: string;
  answer?: string;
}

export interface FilterState {
  years: number[];
  subjects: string[];
  categories: string[];
  tags: string[];
}
