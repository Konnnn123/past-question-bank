import collections,json
from pathlib import Path
d=json.loads(Path('data/architecture-normalized-candidates.json').read_text(encoding='utf8'))
l=json.loads(Path('data/building-learning-card-links.json').read_text(encoding='utf8'))
unlinked={x['buildingId'] for x in l['buildings'] if not x['learningCardIds']}
styles=collections.Counter(); people=collections.Counter(); rows=[]
for b in d['buildings']:
 if b['id'] not in unlinked: continue
 s=b.get('normalizedStyleNames',[]); p=[x for x in b.get('normalizedPersonNames',[]) if x!='要確認']
 # Exclude buildings whose source data is explicitly marked as unconfirmed
 if s==['要確認']: continue
 styles.update(s or ['(样式空白)']); people.update(p or ['(人物空白)'])
 reason='source-needs-review' if 'source-needs-review' in b.get('qualityFlags',[]) else 'missing-card-or-alias' if s or p else 'missing-metadata'
 rows.append({'buildingId':b['id'],'nameJa':b['name']['ja'],'rawStyle':b.get('rawAnki',{}).get('style',''),'normalizedStyles':s,'people':p,'reason':reason})
out={'count':len(rows),'styleCounts':dict(styles),'peopleCounts':dict(people),'buildings':rows}
Path('data/unlinked-buildings-audit.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
lines=['# 未连接建筑审计','',f'- 数量：{len(rows)}','','## 原始样式分组','']+[f'- {k}: {v}' for k,v in styles.most_common()]+['','## 人物分组（前40）','']+[f'- {k}: {v}' for k,v in people.most_common(40)]
Path('data/unlinked-buildings-audit.md').write_text('\n'.join(lines)+'\n',encoding='utf8')
