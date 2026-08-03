import fs from "fs";

const index = JSON.parse(fs.readFileSync("data/construction-2024-q3-slot-review.json", "utf8")) as { status: string; slots: Array<{ slot: string; expectedAnswer: string; answerType: string; sourceLocation: string }> };
if (index.status !== "approved_slot_index") throw new Error("2024 Q3 index is not approved");
if (index.slots.length !== 20 || new Set(index.slots.map((slot) => slot.slot)).size !== 20) throw new Error("2024 Q3 must contain exactly 20 unique slots");
if (index.slots.some((slot) => !slot.expectedAnswer || !slot.answerType || !slot.sourceLocation)) throw new Error("incomplete 2024 Q3 slot");
console.log(JSON.stringify({ status: "pass", approvedSlots: 20, review: "BC-002" }, null, 2));
