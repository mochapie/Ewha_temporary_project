import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { MagnifyingGlassIcon, HomeIcon, ScaleIcon, UserIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export default function SearchResult() {
  const location = useLocation();
  const query = decodeURIComponent(new URLSearchParams(location.search).get("q") || "");
  const navigate = useNavigate();

  // 🔹 정렬 상태 추가
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("asc");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 정렬 변경 핸들러
  const handleSortChange = (option) => {
    if (option.includes("칼로리")) setSortBy("calories");
    else if (option.includes("나트륨")) setSortBy("sodium");
    else if (option.includes("당류")) setSortBy("sugar");
    else if (option.includes("지방")) setSortBy("fat");
    else if (option.includes("단백질")) setSortBy("protein");
    else setSortBy("id"); // 추천순 기본값

    setOrder("desc"); // 일단 내림차순 기본
  };

  // 🔹 API 호출
  useEffect(() => {
    if (query.trim() === "") return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:8080/api/products/search", {
          params: {
            keyword: query,
            sortBy: sortBy,
            order: order
          },
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
  }, [query, sortBy, order]); // 🔹 정렬 바뀔 때마다 다시 요청

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="flex items-center p-3 shadow">
        <img src="/logo.svg" className="w-12" alt="로고" />
        <SearchBox previousQuery={query} />
      </header>

      <main className="px-3 sm:px-6 py-3 pb-[70px]">
        <div className="flex justify-end pr-7 pb-3">
          <SortDropdown onChange={handleSortChange} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-3">
          {loading && <p className="col-span-full text-center">검색 중...</p>}
          {error && <p className="col-span-full text-center text-red-500">{error}</p>}
          {!loading && !error && results.length > 0 ? (
            results.map((product) => (
              <div
                key={product.id}
                className="p-1 w-full max-w-[250px] mx-auto bg-white shadow hover:scale-105 transition"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="w-full h-[150px] lg:h-[200px] mb-3">
                  <img
                    src={product.imageUrl}
                    alt={`${product.name} 이미지`}
                    className="w-full h-full object-cover border-[#EAEAEA] rounded"
                  />
                </div>
                <div className="h-12 flex items-start">
                  <span className="text-base font-medium line-clamp-2">{product.name}</span>
                </div>
              </div>
            ))
          ) : (
            !loading && <p className="col-span-full text-center text-gray-700">검색 결과가 없습니다.</p>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full flex h-[63px] bg-[#003853]">
        <Link to="/" className="flex-1 flex flex-col items-center justify-center text-xs font-medium text-[#A0B9C9] hover:scale-105 transition">
          <HomeIcon className="w-7 h-7 mb-1 text-[#A0B9C9]" />
          홈
        </Link>
        <div className="flex-1 flex flex-col items-center justify-center text-xs font-medium text-[#A0B9C9] hover:scale-105 transition">
          <ScaleIcon className="w-7 h-7 mb-1 text-[#A0B9C9]" />
          상품 비교
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-xs font-medium text-[#A0B9C9] hover:scale-105 transition">
          <UserIcon className="w-7 h-7 mb-1 text-[#A0B9C9]" />
          마이페이지
        </div>
      </div>
    </div>
  );
}

// ✅ 검색창 컴포넌트 그대로 유지
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
          className="w-full pl-5 pr-10 py-2 border border-[#EAEAEA] rounded-3xl focus:outline-none"
        />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
          <MagnifyingGlassIcon className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}

// ✅ 정렬 드롭다운 그대로 사용 가능
function SortDropdown({ onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubOpen, setIsSubOpen] = useState(false);
  const [selected, setSelected] = useState("추천순");

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    setIsSubOpen(false);
    if (onChange) onChange(option);
  };

  return (
    <div className="relative">
      <button
        className="flex items-center justify-between w-full text-sm font-medium p-1.5"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />} {selected}
      </button>

      {isOpen && (
        <div className="absolute right-0 w-36 bg-white border border-[#EAEAEA] z-50">
          <button className="flex items-center w-full text-left text-sm font-medium p-1.5" onClick={() => handleSelect("추천순")}>
            추천순
          </button>

          <button className="flex items-center justify-between w-full text-left font-medium text-sm p-1.5" onClick={() => setIsSubOpen(!isSubOpen)}>
            영양성분함량순 {isSubOpen ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />}
          </button>

          {isSubOpen && (
            <div className="w-full bg-[#EAEAEA]">
              <button onClick={() => handleSelect("칼로리순")} className="flex items-center w-full text-left text-sm font-medium p-1.5 pl-3">
                칼로리
              </button>
              <button onClick={() => handleSelect("나트륨순")} className="flex items-center w-full text-left text-sm font-medium p-1.5 pl-3">
                나트륨
              </button>
              <button onClick={() => handleSelect("당류순")} className="flex items-center w-full text-left text-sm font-medium p-1.5 pl-3">
                당류
              </button>
              <button onClick={() => handleSelect("지방순")} className="flex items-center w-full text-left text-sm font-medium p-1.5 pl-3">
                지방
              </button>
              <button onClick={() => handleSelect("단백질순")} className="flex items-center w-full text-left text-sm font-medium p-1.5 pl-3">
                단백질
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
