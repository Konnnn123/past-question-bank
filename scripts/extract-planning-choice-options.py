"""Extract every option/word-pool entry from planning past exams."""
from __future__ import annotations
import json, re
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
QDIR=ROOT/'data'/'processed_questions'
OUT=ROOT/'data'/'planning-all-choice-options.json'

def main():
 rows=[]
 for p in sorted(QDIR.glob('*_専門1_建筑计划_*.md')):
  text=p.read_text(encoding='utf-8')
  year=int(p.name[:4])
  current=None
  for line in text.splitlines():
   m=re.match(r'^\s*[（(](\d{1,2})[）)]',line)
   if m: current=int(m.group(1))
   o=re.match(r'^\s*([A-D])\s*[：:]\s*(.+?)\s*$',line)
   if o and current:
    value=re.sub(r'\s+',' ',o.group(2)).strip()
    rows.append({'year':year,'question':current,'kind':'option','label':o.group(1),'value':value,'fileName':p.name})
  for group,matches in [('word-pool-1',re.findall(r'(?s)# \[語群1\]\s*(.*?)(?=# \[語群2\])',text)),('word-pool-2',re.findall(r'(?s)# \[語群2\]\s*(.*?)(?=\n!\[|\Z)',text))]:
   for block in matches:
    for label,value in re.findall(r'(?:^|\s)([a-t])\.\s*([^\n]+?)(?=\s+[a-t]\.\s|\s*$)',block):
     rows.append({'year':year,'question':4,'kind':group,'label':label,'value':value.strip(),'fileName':p.name})
 OUT.write_text(json.dumps({'count':len(rows),'rows':rows},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 print(len(rows))

if __name__=='__main__': main()
