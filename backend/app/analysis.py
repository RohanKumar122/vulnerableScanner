import re
from .database import links_collection

# Function to analyze links
# Function to analyze links (including vulnerable links)
def analyze_links():
    data = list(links_collection.find({}, {"_id": 0}))

    domain_count = {}
    vulnerable_domain_count = {}

    for entry in data:
        for link in entry['links']:
            domain = re.findall(r'https?://([A-Za-z_0-9.-]+).*', link)
            if domain:
                domain = domain[0]
                domain_count[domain] = domain_count.get(domain, 0) + 1
        
        for link in entry['vulnerable_links']:  # Analyze vulnerable links
            domain = re.findall(r'https?://([A-Za-z_0-9.-]+).*', link)
            if domain:
                domain = domain[0]
                vulnerable_domain_count[domain] = vulnerable_domain_count.get(domain, 0) + 1

    return domain_count, vulnerable_domain_count

 