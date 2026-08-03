import fs from "fs";

type Slot = { slot: string; prompt: string; answer: string; answerType: string; sourceLocation: string; allowedVariants: string[] };
const index = JSON.parse(fs.readFileSync("data/construction-2014-q3-approved-slots.json", "utf8")) as { reviewId: string; status: string; slots: Slot[] };
const duplicateAnswers = index.slots.filter((slot, indexOfSlot, all) => all.findIndex((candidate) => candidate.answer === slot.answer) !== indexOfSlot).map((slot) => slot.answer);
if (index.reviewId !== "BC-001" || index.status !== "approved_slot_index") throw new Error("approved slot index metadata is invalid");
if (index.slots.length !== 20) throw new Error(`expected 20 slots, found ${index.slots.length}`);
if (new Set(index.slots.map((slot) => slot.slot)).size !== 20) throw new Error("duplicate slot id");
if (duplicateAnswers.length) throw new Error(`duplicate answers: ${duplicateAnswers.join(", ")}`);
if (index.slots.some((slot) => !slot.prompt || !slot.answer || !slot.answerType || !slot.sourceLocation)) throw new Error("incomplete slot evidence");
console.log(JSON.stringify({ status: "pass", approvedSlots: index.slots.length, answerTypes: [...new Set(index.slots.map((slot) => slot.answerType))].sort() }, null, 2));
