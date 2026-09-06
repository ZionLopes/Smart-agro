import re
from bs4 import BeautifulSoup
with open(r'C:\Users\admin\.gemini\antigravity\brain\643cc88e-d45f-47ca-9fba-cfe457e2dc53\.system_generated\steps\98\content.md', 'r', encoding='utf-8') as f:
    content = f.read()

soup = BeautifulSoup(content, 'html.parser')
headings = soup.find_all(['h2', 'h3'])
for h in headings:
    print(h.text.strip())
