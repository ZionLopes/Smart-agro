import re
with open(r'C:\Users\admin\.gemini\antigravity\brain\643cc88e-d45f-47ca-9fba-cfe457e2dc53\.system_generated\steps\98\content.md', 'r', encoding='utf-8') as f:
    content = f.read()

urls = re.findall(r'src="(https://[^"]+\.(?:jpg|jpeg|png|webp|svg))"', content)
print("\n".join(list(set(urls))[:15]))
