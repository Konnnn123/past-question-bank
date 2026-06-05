import {
  getAllQuestions,
  getAllYears,
  getAllSubjects,
  getAllCategories,
  getTagFrequencyBySubject,
} from "@/lib/data";
import HomeClient from "./HomeClient";

export default async function Home() {
  const questions = await getAllQuestions();
  const years = await getAllYears();
  const subjects = await getAllSubjects();
  const categories = await getAllCategories();
  const tagFrequency = await getTagFrequencyBySubject();

  return (
    <HomeClient
      questions={questions}
      years={years}
      subjects={subjects}
      categories={categories}
      tagFrequency={tagFrequency}
    />
  );
}
