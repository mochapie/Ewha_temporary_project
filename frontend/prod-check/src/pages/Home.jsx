import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { MagnifyingGlassIcon, ScaleIcon, UserIcon } from '@heroicons/react/24/outline'
import { HomeIcon } from '@heroicons/react/24/solid'

export default function Home() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim() !== "") {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* 로고 */}
            <div className="flex justify-center items-center py-10 mt-20">
                <img src="/logo.svg" className="w-24 sm:w-32" alt="로고" />
            </div>

            {/* 검색창 */}
            <form onSubmit={handleSearch} className="w-full px-7">
                <div className="relative w-full max-w-xl mx-auto">
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

            {/* 하단 내비게이션 */}
            <div className="fixed bottom-0 left-0 w-full flex items-center h-16 bg-[#003853]">
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