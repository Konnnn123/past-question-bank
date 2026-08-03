from __future__ import annotations
import collections,json
from pathlib import Path
EXPLICIT_CARD_LINKS={
 'バベルの塔':['style-mesopotamian'],
 '川原寺':['style-asuka'],
 '池上・曽根遺跡':['type-moated-settlement','type-hottate-bashira'],
}
def main():
 d=json.loads(Path('data/architecture-normalized-candidates.json').read_text(encoding='utf8')); names=json.loads(Path('data/architect-card-name-map.json').read_text(encoding='utf8'))
 supplemental=Path('data/architect-card-name-map-batch-four.json')
 if supplemental.exists(): names.update(json.loads(supplemental.read_text(encoding='utf8')))
 audit_path=Path('data/architect-person-audit-final.json')
 if audit_path.exists():
  audited=json.loads(audit_path.read_text(encoding='utf8'))
  candidates=[row for row in audited.get('rows',[]) if row.get('status')=='architect-card-candidate']
  names.update({row['nameJa']:f"architect-audit-{i}" for i,row in enumerate(candidates,1)})
 known_architect_ids=set(names.values())
 links=[]; unresolved=collections.Counter(); card_counts=collections.Counter()
 for b in d['buildings']:
  # Some curated building records already contain normalized architect IDs. Keep
  # those links; the older implementation only inspected display names and lost
  # these direct relations. Filter against the card map so stale source IDs can
  # never create a link to a card that does not exist.
  architects=[cid for cid in b.get('architectIds',[]) if cid in known_architect_ids]
  for person in b.get('normalizedPersonNames',[]):
   if person in names: architects.append(names[person])
   elif person and person!='要確認': unresolved[person]+=1
  learning_types={'type-machiya','type-minka','type-castle','type-pit-dwelling','type-moated-settlement','type-hottate-bashira','type-southeast-asian-temple'}
  cards=sorted(set(b.get('styleIds',[])+b.get('movementIds',[])+[x for x in b.get('typeIds',[]) if x in learning_types]+architects+EXPLICIT_CARD_LINKS.get(b['name']['ja'],[])))
  for cid in cards: card_counts[cid]+=1
  links.append({'buildingId':b['id'],'buildingNameJa':b['name']['ja'],'learningCardIds':cards,'styleIds':b.get('styleIds',[]),'movementIds':b.get('movementIds',[]),'architectCardIds':sorted(set(architects)),'imageIds':b.get('imageIds',[]),'examEvidence':b.get('examEvidence',[])})
 out={'version':1,'buildings':links,'stats':{'buildingCount':len(links),'linkedBuildings':sum(bool(x['learningCardIds']) for x in links),'unlinkedBuildings':sum(not x['learningCardIds'] for x in links),'cardBuildingCounts':dict(card_counts),'unresolvedPeople':dict(unresolved)}}
 Path('data/building-learning-card-links.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
 lines=['# 建筑—学习卡连接报告','',f"- 建筑：{len(links)}",f"- 已连接：{out['stats']['linkedBuildings']}",f"- 尚未连接：{out['stats']['unlinkedBuildings']}",'','## 连接数量','']
 lines += [f'- {k}: {v}' for k,v in card_counts.most_common()]
 lines += ['','## 未识别人物（前50）','']+[f'- {k}: {v}' for k,v in unresolved.most_common(50)]
 Path('data/building-learning-card-links-report.md').write_text('\n'.join(lines)+'\n',encoding='utf8')
if __name__=='__main__': main()
