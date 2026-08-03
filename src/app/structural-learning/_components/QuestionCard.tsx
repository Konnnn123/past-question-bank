import Link from "next/link";
import type { MechanicsQuestion } from "@/lib/structural-learning";

const styles = {
  amber: { line: "bg-amber-400", badge: "bg-amber-50 text-amber-800", number: "text-amber-500" },
  blue: { line: "bg-blue-500", badge: "bg-blue-50 text-blue-800", number: "text-blue-500" },
  teal: { line: "bg-teal-500", badge: "bg-teal-50 text-teal-800", number: "text-teal-500" },
};

export default function QuestionCard({ question }: { question: MechanicsQuestion }) {
  const style = styles[question.accent];
  return (
    <Link href={`/structural-learning/questions/${question.slug}`} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60">
      <span className={`absolute inset-x-0 top-0 h-1 ${style.line}`} />
      <div className="flex items-start justify-between gap-4">
        <span className={`font-mono text-3xl font-light ${style.number}`}>{question.number}</span>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${style.badge}`}>{question.scale}层级</span>
      </div>
      <h3 className="mt-6 text-lg font-bold text-slate-950">{question.title}</h3>
      <p className="mt-1 min-h-10 text-xs leading-5 text-slate-500">{question.subtitle}</p>
      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">真正的问题</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">{question.coreQuestion}</p>
      </div>
      <div className="mt-5 flex items-center justify-between text-xs">
        <span className="font-medium text-emerald-700">✓ {question.status}</span>
        <span className="font-semibold text-slate-500 transition group-hover:translate-x-1 group-hover:text-slate-950">进入题目档案 →</span>
      </div>
    </Link>
  );
}
