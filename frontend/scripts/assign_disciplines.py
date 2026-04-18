import json
import os

DATA_DIR = 'c:/Users/Nikhi/Projects/Development/Web Dev Projects/Projects/Lumex/frontend/public/mock-data'

DISCIPLINES = [
    'Biological Sciences',
    'Business and Management',
    'Chemistry',
    'Computer Science',
    'Earth and Environmental Sciences',
    'Health Sciences',
    'Humanities and Social Sciences',
    'Materials Science',
    'Mathematics',
    'Physics and Astronomy',
    'Statistics',
    'Technology and Engineering'
]

def update_articles():
    filepath = os.path.join(DATA_DIR, 'articles.json')
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    articles = data['articles']
    for i, article in enumerate(articles):
        # Cycle through disciplines to ensure even distribution
        article['subjectArea'] = DISCIPLINES[i % len(DISCIPLINES)]
        
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)
    print(f"Updated {len(articles)} articles with disciplines.")

def update_journals():
    filepath = os.path.join(DATA_DIR, 'journals.json')
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    journals = data['journals']
    for i, journal in enumerate(journals):
        # Reset discipline to standardized labels
        # A journal can have multiple, but let's at least ensure one matches the grid
        primary_discipline = DISCIPLINES[i % len(DISCIPLINES)]
        journal['discipline'] = [primary_discipline]
        
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)
    print(f"Updated {len(journals)} journals with disciplines.")

if __name__ == "__main__":
    update_articles()
    update_journals()
