import json
import os
import random
import re

DATA_DIR = 'c:/Users/Nikhi/Projects/Development/Web Dev Projects/Projects/Lumex/frontend/public/mock-data'

TARGETS = {
    'articles.json': 40,
    'journals.json': 35,
    'books.json': 15,
    'chapters.json': 40,
    'news.json': 25,
    'careers.json': 25,
    'collections.json': 25,
}

PREFIXES = ["Advances in", "Modern", "Comprehensive", "Integrated", "Innovative", "Global", "Sustainable", "Emerging", "Strategic", "Computational"]
TOPICS = ["Quantum", "Molecular", "Climatological", "Neural", "Systems", "Organic", "Structural", "Macroeconomic", "Genomic", "Behavioral"]
SUFFIXES = ["Research", "Review", "Analysis", "Perspectives", "Foundations", "Application", "Methodology", "Case Study", "Trends", "Frameworks"]

def mutate_string(s, i):
    # Try to make it look like a new title
    words = s.split()
    if len(words) > 3:
        new_title = f"{random.choice(PREFIXES)} {random.choice(TOPICS)} {words[-2]} {words[-1]}"
    else:
        new_title = f"{s} - Part {i}"
    return new_title

def mutate_doi(doi, i):
    # 10.1038/s41598-024-00001-1 -> 10.1038/s41598-025-XXXXX-X
    parts = doi.split('-')
    if len(parts) > 1:
        return f"{'-'.join(parts[:-1])}-{random.randint(10000, 99999)}-{i}"
    return f"{doi}.{i}"

def mutate_id(old_id, i):
    # art-001 -> art-025
    match = re.search(r'([a-zA-Z-]+)(\d+)', old_id)
    if match:
        prefix, num = match.groups()
        return f"{prefix}{int(num) + 100 + i}"
    return f"{old_id}-{i}"

def expand_file(filename, target_count):
    filepath = os.path.join(DATA_DIR, filename)
    if not os.path.exists(filepath):
        print(f"Skipping {filename} (not found)")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Find the main list
    root_key = None
    items = None
    
    if isinstance(data, list):
        items = data
    elif isinstance(data, dict):
        for k, v in data.items():
            if isinstance(v, list) and k in ["articles", "journals", "books", "chapters", "jobs", "news", "collections"]:
                root_key = k
                items = v
                break

    if items is None:
        print(f"Could not find primary list in {filename}")
        return

    current_count = len(items)
    if current_count >= target_count:
        print(f"Already reached target for {filename}")
        return

    print(f"Expanding {filename}: {current_count} -> {target_count}")
    
    # We clones items
    new_items = []
    for i in range(target_count - current_count):
        base_item = random.choice(items)
        new_item = json.loads(json.dumps(base_item)) # Deep copy
        
        # Mutate common fields
        if "id" in new_item:
            new_item["id"] = mutate_id(new_item["id"], i)
        
        if "doi" in new_item:
            new_item["doi"] = mutate_doi(new_item["doi"], i)
            
        if "title" in new_item:
            new_item["title"] = mutate_string(new_item["title"], i)
        elif "label" in new_item:
            new_item["label"] = mutate_string(new_item["label"], i)
        elif "name" in new_item:
            new_item["name"] = mutate_string(new_item["name"], i)

        if "slug" in new_item:
            new_item["slug"] = f"{new_item['slug']}-{i+10}"

        if "publishedDate" in new_item:
            new_item["publishedDate"] = f"2024-{random.randint(1,12):02}-{random.randint(1,28):02}"

        new_items.append(new_item)

    items.extend(new_items)
    
    # Update totalCount if present
    if isinstance(data, dict) and "totalCount" in data:
        data["totalCount"] = len(items)
        if "totalPages" in data:
            data["totalPages"] = (len(items) + data.get("pageSize", 20) - 1) // data.get("pageSize", 20)

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)

def expand_conferences():
    filepath = os.path.join(DATA_DIR, 'conferences.json')
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    base_keys = list(data.keys())
    for i in range(8):
        base_key = random.choice(base_keys)
        new_key = f"conf-{2024+i}-{i}"
        new_val = json.loads(json.dumps(data[base_key]))
        new_val["title"] = f"{random.choice(PREFIXES)} Conference on {random.choice(TOPICS)} Science {2024+i}"
        data[new_key] = new_val

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)

if __name__ == "__main__":
    for filename, target in TARGETS.items():
        expand_file(filename, target)
    expand_conferences()
    print("Done!")
