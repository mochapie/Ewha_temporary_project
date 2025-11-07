import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
//import axios from 'axios'
import { MagnifyingGlassIcon, CheckIcon, HomeIcon, UserIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon, ScaleIcon } from '@heroicons/react/24/solid'

// 프론트 테스트용 상품데이터
const mockProducts = [
    {id: 1, name: "[해태] 맛동산", imageUrl: "https://sitem.ssgcdn.com/42/79/32/item/1000518327942_i1_1200.jpg"},
    {id: 2, name: "[오리온] 닥터유 단백질바", imageUrl: "https://sitem.ssgcdn.com/48/35/30/item/1000039303548_i1_1200.jpg"},
    {id: 3, name: "[포스트] 오레오오즈 컵", imageUrl: "https://sitem.ssgcdn.com/06/83/76/item/1000564768306_i1_1200.jpg"}
];

export default function ProductSelect() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);

    const handleToggle = (product) => {
        setSelectedProducts(prev => {
            if (prev.includes(product.id)) {
                return prev.filter(id => id !== product.id);
            } else {
                // 최대 5개 선택 가능
                if (prev.length >= 5) {
                    alert("최대 5개까지만 선택 가능합니다");
                    return prev;
                }
                
                return [...prev, product.id];
            }
        })
    };

    const navigate = useNavigate();

    // 서버에서 상품 불러오는 함수
    const fetchProducts = async (search = "") => {
        // 🔹 검색어 X : 기본 상품 리스트 불러오기
        // 🔹 검색어 O : 검색된 상품 리스트 불러오기
    };
    
    // 검색 버튼 또는 Enter 키 입력 시
    const handleSearch = (e) => {
        e.preventDefault();

        if (!searchTerm.trim()) return;

        // 서버 검색 요청
        fetchProducts(searchTerm);
    }

    // 첫 화면 로딩 시 (검색어 X)
    useEffect(() => {
        fetchProducts(""); // 기본 상품 리스트 불러오기
    }, []); // 처음 렌더링 1회만

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* 검색 */}
            <header className="fixed top-0 left-0 z-50 bg-white flex items-center w-full h-[67px] px-[30px]">
                <img src="/logo.svg" className="w-[45px] mt-[5px]" alt="로고" />
                <div className="relative flex-1 max-w-full sm:max-w-lg ml-2.5 mt-3">
                    <form onSubmit={handleSearch}>
                        <input 
                            type="text"
                            placeholder="상품 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-[45px] pl-[25px] pr-[35px] text-[15px]
                            placeholder:text-[15px] placeholder:text-[#CCCCCC]
                            border-[0.5px] border-[#CCCCCC] rounded-[25px] focus:outline-none"
                        />
                        <button 
                            type="submit"
                            className="absolute right-[15px] top-1/2 -translate-y-1/2"
                        >
                            <MagnifyingGlassIcon className="w-5 h-5"/>
                        </button>
                    </form>
                </div>
            </header>

            {/* 상품들 */}
            <div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 
                    pt-[90px] px-[30px] pb-[135px] gap-1.5 sm:gap-3"
            >
                {mockProducts.map((product) => {
                    const isSelected = selectedProducts.includes(product.id);

                    return (
                        <button
                            type="button"
                            key={product.id}
                            aria-pressed={isSelected}
                            onClick={() => handleToggle(product)}
                            className="w-full max-w-[250px] mx-auto p-1.5 bg-white"
                        >
                            {/* 이미지 */}
                            <div className="relative w-full overflow-hidden rounded-none">
                                <img
                                    src={product.imageUrl}
                                    alt={`${product.name} 이미지`}
                                    className="block w-full aspect-square object-cover border-[0.5px] border-[#CCCCCC]"
                                />
                                {/* 선택했을 때 이미지 어둡게 */}
                                {isSelected && (
                                    <div 
                                        className="absolute inset-0 bg-black/25 transition-opacity pointer-events-none"
                                        aria-hidden="true"
                                    />
                                )}
                                <CheckCircleIcon 
                                    className={
                                        `absolute z-20 top-2.5 right-2.5 transition-colors
                                        ${isSelected ? "text-[#003853]" : "text-[#A0B9C9]"}
                                        w-[20px] h-[20px] lg:w-[25px] lg:h-[25px] transition-colors`
                                    }
                                />
                            </div>

                            {/* 상품명 */}
                            <div className="h-[35px] mt-1.5 flex items-start">
                                <span className="text-left text-[15px] font-medium line-clamp-2 overflow-hidden">
                                    {product.name}
                                </span>
                            </div>
                        </button>
                )})}
            </div>

            {/* 넘어가는 버튼 */}
            <button
                type="button"
                onClick={() => navigate("/comparison/setting-criteria")}
                className="fixed bottom-[63px] left-0 z-50 
                w-full h-[63px] px-[25px] py-[20px] 
                font-semibold text-[17px]
                text-[#003853] bg-[#EDEDED]
                flex items-center justify-between"
            >
                {selectedProducts.length}개 상품 선택하기
                <CheckIcon width={20} height={20} strokeWidth={3}/>
            </button>

            {/* 하단 내비게이션 */}
            <div className="fixed bottom-0 left-0 z-50 w-full flex items-center h-[63px] bg-[#003853]">
                <Link to="/" 
                    className="flex-1 flex flex-col 
                    items-center justify-center 
                    text-xs font-medium text-[#A0B9C9] 
                    hover:scale-105 transition"
                >
                    <HomeIcon className="w-7 h-7 mb-1"/>
                    홈
                </Link>
                <div
                    className="flex-1 flex flex-col 
                    items-center justify-center 
                    text-xs font-medium text-[#A0B9C9]"
                >
                    <ScaleIcon className="w-7 h-7 mb-1"/>
                    상품 비교
                </div>
                <Link to="/login"
                    className="flex-1 flex flex-col 
                    items-center justify-center 
                    text-xs font-medium text-[#A0B9C9] 
                    hover:scale-105 transition"
                >
                    <UserIcon className="w-7 h-7 mb-1"/>
                    마이페이지
                </Link>
            </div>
        </div>
    )
}