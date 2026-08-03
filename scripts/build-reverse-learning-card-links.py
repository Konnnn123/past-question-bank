import collections,json
from pathlib import Path
d=json.loads(Path('data/building-learning-card-links.json').read_text(encoding='utf8'))
reverse=collections.defaultdict(list)
for b in d['buildings']:
 for cid in b['learningCardIds']: reverse[cid].append({'buildingId':b['buildingId'],'buildingNameJa':b['buildingNameJa']})
out={'version':1,'cards':{k:{'buildingCount':len(v),'buildings':v} for k,v in sorted(reverse.items())}}
Path('data/learning-card-building-index.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
