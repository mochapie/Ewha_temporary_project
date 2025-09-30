import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';   // 추가
import { MagnifyingGlassIcon, HomeIcon, ScaleIcon, UserIcon } from '@heroicons/react/24/outline';

export default function SearchResult() {
  const location = useLocation();
  const query = decodeURIComponent(
    new URLSearchParams(location.search).get("q") || ""
  );

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim() === "") return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:8080/api/products/search", {
          params: { keyword: query }
        });
        setResults(response.data);
      } catch (err) {
        console.error("검색 API 에러:", err);
        setError("검색 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 검색창 */}
      <header className="flex items-center p-3 shadow">
        <img src="/logo.svg" className="w-12" alt="로고" />
        <SearchBox previousQuery={query} />
      </header>

      {/* 검색 결과 */}
      <main className="p-3 sm:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 sm:gap-3">
        {loading && <p className="col-span-full text-center">검색 중...</p>}
        {error && <p className="col-span-full text-center text-red-500">{error}</p>}
        {!loading && !error && results.length > 0 ? (
          results.map((product) => (
            <div
              key={product.id}
              className="p-1 w-full max-w-[250px] mx-auto bg-white shadow hover:scale-105 transition"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {product.imageUrl ? (
                <div className="w-full h-[150px] lg:h-[200px] mb-3">
                  <img
                    src={product.imageUrl}
                    alt={`${product.name} 이미지`}
                    className="w-full h-full object-cover border-[#EAEAEA] rounded"
                  />
                </div>
              ) : (
                <div className="w-full h-[150px] lg:h-[200px] mb-3 bg-gray-300 flex items-center justify-center"></div>
              )}
              <div className="h-12 flex items-start">
                <span className="text-base font-medium line-clamp-2">{product.name}</span>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="col-span-full text-center text-gray-700">검색 결과가 없습니다.</p>
        )}
      </main>

      {/* 하단 내비게이션 */}
      <div className="fixed bottom-0 left-0 w-full flex h-16 bg-[#003853]">
        <Link to="/" className="flex-1 flex flex-col items-center justify-center text-sm font-medium text-[#A0B9C9] hover:scale-105 transition">
          <HomeIcon className="w-6 h-6 mb-1 text-[#A0B9C9]"/>
          홈
        </Link>
        <div className="flex-1 flex flex-col items-center justify-center text-sm font-medium text-[#A0B9C9] hover:scale-105 transition">
          <ScaleIcon className="w-6 h-6 mb-1 text-[#A0B9C9]"/>
          상품 비교
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-sm font-medium text-[#A0B9C9] hover:scale-105 transition">
          <UserIcon className="w-6 h-6 mb-1 text-[#A0B9C9]"/>
          마이페이지
        </div>
      </div>
    </div>
  );
}

function SearchBox({ previousQuery }) {
  const [query, setQuery] = useState(previousQuery || "");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full px-3">
      <div className="relative w-full max-w-lg">
        <input
          type="text"
          placeholder="검색하기"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-5 pr-10 py-2 border border-gray-300 rounded-3xl focus:outline-none"
        />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
          <MagnifyingGlassIcon className="w-5 h-5"/>
        </button>
      </div>
    </form>
  );
}
