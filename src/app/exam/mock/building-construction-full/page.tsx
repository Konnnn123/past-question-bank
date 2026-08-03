import fs from "fs";
import path from "path";
import BuildingConstructionFullMockClient from "./BuildingConstructionFullMockClient";
import type { MockData } from "@/lib/building-construction-mock";
import { BUILDING_CONSTRUCTION_MATERIAL_DENSITY_FACTS } from "@/lib/building-construction-material-density-generator";
import { BUILDING_CONSTRUCTION_MATERIAL_ELASTICITY_FACTS } from "@/lib/building-construction-material-elasticity-generator";
import { BUILDING_CONSTRUCTION_MATERIAL_STRENGTH_FACTS } from "@/lib/building-construction-material-strength-generator";

export default function Page() {
  const shared = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "building-construction-shared-wordbank-generated-v1.json"), "utf-8"));
  const formats = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "building-construction-production-formats-v1.json"), "utf-8"));
  const numerical = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "building-construction-numerical-pilot.json"), "utf-8"));
  const rcFacts = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "building-construction-rc-shared-wordbank-facts.json"), "utf-8")).facts;
  const data: MockData = {
    shared,
    formats: formats.families,
    numeric: numerical.questions,
    rcFacts,
    materialDensityFacts: BUILDING_CONSTRUCTION_MATERIAL_DENSITY_FACTS,
    materialStrengthFacts: BUILDING_CONSTRUCTION_MATERIAL_STRENGTH_FACTS,
    materialElasticityFacts: BUILDING_CONSTRUCTION_MATERIAL_ELASTICITY_FACTS,
  };
  return <BuildingConstructionFullMockClient data={data} />;
}
