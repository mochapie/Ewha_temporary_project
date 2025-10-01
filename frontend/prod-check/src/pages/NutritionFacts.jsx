import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftIcon, HomeIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function NutritionFacts() {
    const navigate = useNavigate();

    const { id } = useParams();

    // 항상 최상단에서 선언
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(err => console.error(err));
    }, [id]);

    // 조건부 렌더링은 여기서 return으로 처리
    if (!product) {
        return <p className="text-center mt-10">로딩 중...</p>;
    }

    const items = [
        { label: "열량", value: product.calories },
        { label: "나트륨", value: product.sodium },
        { label: "탄수화물", value: product.carbohydrate },
        { label: "당류", value: product.sugar },
        { label: "지방", value: product.fat },
        { label: "트랜스지방", value: product.transFat },
        { label: "포화지방", value: product.saturatedFat },
        { label: "콜레스테롤", value: product.cholesterol },
        { label: "단백질", value: product.protein }
    ];

    // 여기서부터가 추가된 부분
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
            if (isOpen) {
                // 현재 스크롤 위치 저장
                const scrollY = window.scrollY;
                document.body.style.position = "fixed";
                document.body.style.top = `-${scrollY}px`;
                document.body.style.width = "100%";
            } else {
                // 스크롤 위치 복구
                const scrollY = document.body.style.top;
                document.body.style.position = "";
                document.body.style.top = "";
                document.body.style.width = "";
                window.scrollTo(0, parseInt(scrollY || "0") * -1);
            }
        }, [isOpen]);
    
        const suitability = {
            suitable: {text: "적합", color: "text-green-600"},
            unsuitable: {text: "부적합", color: "text-red-600"},
            caution: {text: "주의가 필요", color: "text-yellow-600"}
        };
    
        const resultStatus = "suitable"; // 프론트 테스트용
    
        // 문자 -> 배열
        const userAllergiesArray = user.allergies.split(",").map(a => a.trim());
        const allergensArray = product.allergens.split(",").map(a => a.trim());
        const potentialAllergensArray = product.potentialAllergens.split(",").map(a => a.trim());
    
        const matchedAllergies = userAllergiesArray.filter(allergy =>
            allergensArray.includes(allergy)
        )
        const matchedPotentialAllergies = userAllergiesArray.filter(allergy =>
            potentialAllergensArray.includes(allergy)
        )
    
        // 알레르기
        const allergyNote = matchedAllergies.length > 0
            ? `❌ ${matchedAllergies.join(", ")} 함유`
            : `✅ ${userAllergiesArray.join(", ")} 함유되어 있지 않음`;
    
        // 간접 알레르기
        const potentialAllergyNote = matchedPotentialAllergies.length > 0
            ? `⚠️ ${matchedAllergies.join(", ")} 혼입 가능성 있음`
            : null;

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* 상단 내비게이션 */}
            <header className="flex items-center justify-between p-3 shadow">
                <button
                    onClick={() => navigate(-1)}
                    className="hover:scale-105 transition"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <Link to="/" className="hover:scale-105 transition">
                    <HomeIcon className="w-6 h-6" />
                </Link>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-2">
                {/* 상품명 + 이미지 */}
                <div className="relative w-full max-w-md mx-auto md:mt-6">
                    <img
                        src={product.imageUrl}
                        alt={`${product.name} 이미지`}
                        className="w-full h-[360px] md:h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-0 w-full text-lg font-medium p-3">
                        {product.name}
                    </div>
                </div>

                {/* 영양정보 */}
                <div>
                    <div className="font-medium px-6 py-3 mb-2 border-b border-[#EAEAEA]">영양 정보</div>
                    <div className="px-6 py-3 space-y-2">
                        {items.map((item) => (
                            <div key={item.label} className="flex justify-between text-sm md:text-base font-light">
                                <span>{item.label}</span>
                                <span>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* 적합성 버튼 */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-0 left-0 w-full py-5 h-16 font-semibold text-white bg-[#003853]"
            >
                상품 적합성 판단하기
            </button>
            
            {/* 적합성 판단 모달 -> 여기서부터가 추가된 부분 */}
            {isOpen && (
                <div className="fixed inset-0 flex items-end md:items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="
                        flex flex-col bg-white p-5 relative
                        w-full md:w-1/2
                        h-[80%] md:h-[80%]
                        rounded-t-2xl rounded-b-none md:rounded-2xl
                        animate-slide-up md:animate-fade-in
                        "
                    >
                        {/* 닫기 버튼 */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-3 right-3"
                        >
                            <XCircleIcon className="w-9 h-9 text-[#EAEAEA]" />
                        </button>

                        {/* 내용 영역: 스크롤 가능하게 설정 */}
                        <div className="mt-10 overflow-y-auto flex-1">
                            {/* 판단 결과 */}
                            <div className="bg-[#EAEAEA] rounded-xl p-3 text-center">
                                <p className="text-lg font-medium">
                                    이 상품은 {user.name} 님께 <span className={suitability[resultStatus].color}>{suitability[resultStatus].text}</span>해요!
                                </p>
                            </div>
                            <div className="mt-3">
                                <p className="font-medium">
                                    {allergyNote} <br />
                                    {potentialAllergyNote}
                                </p>
                            </div>

                            {/* 추천 상품 */}
                            <div className="mt-10 p-3 border-t border-[#CCCCCC]">
                                <p className="font-light">이런 상품도 추천해요 😆</p>
                            </div>
                            <div className="p-1 grid grid-cols-3 gap-3">
                                {recommendedProducts.map((product) => (
                                    <div 
                                        key={product.id}
                                        className="p-1 w-full max-w-[150px] mx-auto shadow hover:scale-105 transition"
                                    >
                                        <div className="w-full h-[100px] lg:h-[150px] mb-3">
                                            <img 
                                                src={product.image}
                                                alt={`${product.name} 이미지`}
                                                className="w-full h-full object-cover border-[#EAEAEA] rounded"
                                            />
                                        </div>
                                        <div className="h-12 flex items-start">
                                            <span className="text-base font-medium line-clamp-2">{product.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
