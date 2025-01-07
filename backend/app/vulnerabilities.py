import re

# Function to identify vulnerable links
def filter_vulnerable_links(links):
    vulnerable_links = []
    for link in links:
        # Check if link is not HTTPS or contains risky domains
        if not link.startswith('https://'):
            vulnerable_links.append(link)
        elif re.search(r'http://', link):  # Basic check for HTTP links
            vulnerable_links.append(link)
        elif re.search(r'risky-domain.com|another-bad-domain.com', link):  # Example of risky domains
            vulnerable_links.append(link)

    return vulnerable_links
