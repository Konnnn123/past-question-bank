import {
  getAllCategories,
  getAllQuestions,
  getAllSubjects,
  getAllYears,
  getTagFrequencyBySubject,
} from "@/lib/data";
import HomeClient from "../../HomeClient";

export default async function PastExamPage() {
  const [questions, years, subjects, categories, tagFrequency] = await Promise.all([
    getAllQuestions(),
    getAllYears(),
    getAllSubjects(),
    getAllCategories(),
    getTagFrequencyBySubject(),
  ]);

  return <HomeClient questions={questions} years={years} subjects={subjects} categories={categories} tagFrequency={tagFrequency} />;
}
