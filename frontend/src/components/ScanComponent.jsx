import React, { useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ScanComponent = () => {
  const [url, setUrl] = useState("");
  const [pieChartData, setPieChartData] = useState(null);
  const [vulnerablePieChartData, setVulnerablePieChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scrapedLinks, setScrapedLinks] = useState([]);
  const [vulnerableLinks, setVulnerableLinks] = useState([]);
  const [vulnerablePercentage, setVulnerablePercentage] = useState(0);

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    setScrapedLinks([]);
    setVulnerableLinks([]);

    try {
      const response = await axios.post("http://127.0.0.1:5000/scan", { url });
      const data = response.data;

      if (data.error) {
        setError(data.error);
      } else {
        setScrapedLinks(data.links);
        setVulnerableLinks(data.vulnerable_links);
        calculateVulnerablePercentage(data.vulnerable_links, data.links);
        await fetchAnalysis();
      }
    } catch (error) {
      setError("Error during scan. Please try again.");
      console.error("Error during scan:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateVulnerablePercentage = (vulnerableLinks, scrapedLinks) => {
    const percentage = ((vulnerableLinks.length / scrapedLinks.length) * 100).toFixed(2);
    setVulnerablePercentage(percentage);
  };

  const fetchAnalysis = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/analysis");
      const domainCount = response.data.analysis;
      const vulnerableDomainCount = response.data.vulnerable_analysis;

      if (!domainCount || !vulnerableDomainCount) {
        throw new Error("Analysis data is incomplete.");
      }

      // Prepare data for pie chart
      const domainLabels = Object.keys(domainCount);
      const domainValues = Object.values(domainCount);
      const vulnerableLabels = Object.keys(vulnerableDomainCount);
      const vulnerableValues = Object.values(vulnerableDomainCount);

      // Pie chart data for domains
      const formattedData = {
        labels: domainLabels,
        datasets: [
          {
            label: "Domain Count",
            data: domainValues,
            backgroundColor: domainLabels.map((_, index) => `rgba(${(index * 30) % 255}, ${(index * 60) % 255}, ${(index * 90) % 255}, 0.6)`),
            borderColor: "rgb(75, 192, 192)",
            borderWidth: 1,
          },
        ],
      };

      // Pie chart data for vulnerable domains
      const formattedVulnerableData = {
        labels: vulnerableLabels,
        datasets: [
          {
            label: "Vulnerable Domain Count",
            data: vulnerableValues,
            backgroundColor: vulnerableLabels.map((_, index) => `rgba(${(index * 100) % 255}, ${(index * 150) % 255}, ${(index * 200) % 255}, 0.6)`),
            borderColor: "rgb(255, 99, 132)",
            borderWidth: 1,
          },
        ],
      };

      setPieChartData(formattedData);
      setVulnerablePieChartData(formattedVulnerableData);
    } catch (error) {
      setError("Error during analysis. Please try again.");
      console.error("Error during analysis:", error);
    }
  };

 return (
  <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center p-8">
    <div className="w-full max-w-4xl mb-8">
      {/* URL input section */}
      <div className="flex flex-col sm:flex-row items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="url"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="p-4 w-full sm:w-2/3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleScan}
          className="ml-2 p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-600 focus:outline-none"
          disabled={loading}
        >
          {loading ? "Scanning..." : "Scan"}
        </button>
      </div>

      {/* Error display */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Scraped Links section */}
      {scrapedLinks.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-xl mb-2 text-gray-300">Sublinks:</h3>
          <div className="h-48 overflow-y-auto p-5 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
            <ul className="list-disc pl-5 space-y-2">
              {scrapedLinks.map((link, index) => (
                <li key={index} className="text-blue-400 hover:text-blue-300 transition-all duration-300">{link}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Vulnerable Links section */}
      {vulnerableLinks.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-xl text-red-400 mb-2">Vulnerable Links:</h3>
          <div className="h-48 overflow-y-auto p-5 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
            <ul className="list-disc pl-5 space-y-2">
              {vulnerableLinks.map((link, index) => (
                <li key={index} className="text-red-600 hover:text-red-500 transition-all duration-300">{link}</li>
              ))}
            </ul>
          </div>
          <p className="mt-2 text-lg font-semibold">
            Vulnerable Link Percentage: <span className="text-red-500">{vulnerablePercentage}%</span>
          </p>
        </div>
      )}

      {/* Pie chart for domain count */}
      {pieChartData && (
        <div className="w-full h-96 mb-6 bg-gray-800 rounded-lg shadow-lg p-4">
          <h3 className="text-xl text-gray-300 text-center mb-4">Domain Analysis</h3>
          <Pie data={pieChartData} />
        </div>
      )}

      {/* Pie chart for vulnerable domains */}
      {vulnerablePieChartData && (
        <div className="w-full h-96 mb-6 bg-gray-800 rounded-lg shadow-lg p-4">
          <h3 className="text-xl text-gray-300 text-center mb-4">Vulnerable Domains</h3>
          <Pie data={vulnerablePieChartData} />
        </div>
      )}
    </div>
  </div>
)}


export default ScanComponent;
