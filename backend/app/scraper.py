from bs4 import BeautifulSoup
import requests

# Function to scrape links
def scrape_links(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        links = []
        for a_tag in soup.find_all('a', href=True):
            href = a_tag['href']
            if not href.startswith('http'):
                href = requests.compat.urljoin(url, href)
            links.append(href)

        links = list(set(links))  # Remove duplicates
        return links
    except Exception as e:
        return str(e)
