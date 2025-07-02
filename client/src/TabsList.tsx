import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
type Tab = { title: string; url: string };

const TabsList: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [filteredTabs, setFilteredTabs] = useState<Tab[]>(tabs);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

   useEffect(() => {
    const cached = localStorage.getItem("cachedTabs");
    if (cached) {
      try {
        setTabs(JSON.parse(cached));
        setFilteredTabs(JSON.parse(cached));
      } catch {
        console.error("Invalid cached tabs");
      }
    }
  }, []);
  const token = import.meta.env.VITE_AUTH_TOKEN;

  const fetchTabs = async () => {
    setLoading(true);
    setError(null); // reset previous errors
    try {
      const res = await fetch('/api/tabs', {
        headers:{
          'Authorization' : `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch tabs");
      const data = await res.json();
      setTabs(data.tabs);
      setFilteredTabs(data.tabs);
      localStorage.setItem("cachedTabs", JSON.stringify(data.tabs)); //caching
    } catch{
      setTabs([]);
      setError("Failed to fetch tabs!");
    }
    setLoading(false);
  };

  return (
   <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-200">
    <div className="flex items-center justify-center mb-4">
      <img 
        src="icons8-safari.svg" 
        alt="Safari logo" 
        className="w-12 h-12 mt-1" // adjust size to match text naturally
      />
      <h2 className="ml-1.5 text-2xl font-semibold text-sky-600">
        TabSync - Safari Tabs Viewer
      </h2>
    </div>

    <button
      className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
      onClick={fetchTabs}
      disabled={loading}
    >
      {loading ? 'Fetching...' : 'Fetch Tabs'}
    </button>
    <div className="relative flex items-center w-full py-2 mb-4 border-2 border-blue-500 rounded-lg">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sky-500" />
      <input 
        className="pl-10 h-full w-full focus:outline-none focus:border-blue-600 rounded-lg"
        value={searchTerm}
        placeholder="Search..."
        onChange={(e) => {
          const searchTerm = e.target.value;
          setSearchTerm(searchTerm)
          setFilteredTabs(tabs.filter((tab: Tab)=>tab.title.toLowerCase().includes(searchTerm.toLowerCase())));
          }
        }
      />
    </div>

    {error && (
      <p className="text-red-500 text-center mb-4">{error}</p>
    )}

    <ul className="space-y-3">
      {filteredTabs.map((tab, idx) => (
        <li key={idx} className="border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition p-3">
          <a
            href={tab.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-700 hover:underline break-all"
          >
            {tab.title}
          </a>
        </li>
      ))}
    </ul>

    {filteredTabs.length === 0 && !loading && !error && (
      <p className="text-gray-400 text-center">No tabs to display</p>
    )}
  </div>

  );
};

export default TabsList;
