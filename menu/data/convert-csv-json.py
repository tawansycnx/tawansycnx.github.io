import csv, json
with open('C:\\Users\\Artee\\OneDrive\\Documents\\Business Setup\\Tawansy\\web\\menu\\data\\menu.csv', newline='', encoding='utf8') as f:
    reader = csv.DictReader(f)
    data = list(reader)
with open('C:\\Users\\Artee\\OneDrive\\Documents\\Business Setup\\Tawansy\\web\\menu\\data\\menu.json', 'w', encoding='utf8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
