from flask import Blueprint, request, jsonify
from .scraper import scrape_links
from .database import links_collection
from .analysis import analyze_links
from .vulnerabilities import filter_vulnerable_links

main_routes = Blueprint('main_routes', __name__)

@main_routes.route('/scan', methods=['POST'])
def scan_url():
    data = request.json
    url = data.get("url")

    if not url:
        return jsonify({"error": "URL is required"}), 400

    # Scrape links
    links = scrape_links(url)
    if isinstance(links, str):
        return jsonify({"error": links}), 500

    # Filter vulnerable links
    vulnerable_links = filter_vulnerable_links(links)

    # Save non-vulnerable links to MongoDB
    links_data = {"url": url, "links": links, "vulnerable_links": vulnerable_links}
    links_collection.insert_one(links_data)

    return jsonify({"url": url, "links": links, "vulnerable_links": vulnerable_links})

@main_routes.route('/analysis', methods=['GET'])
def analysis():
    try:
        domain_count, vulnerable_count = analyze_links()  # Unpack the tuple
        return jsonify({
            "analysis": domain_count,
            "vulnerable_analysis": vulnerable_count
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
