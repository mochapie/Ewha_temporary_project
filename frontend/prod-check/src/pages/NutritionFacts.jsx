import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/solid';

export default function NutritionFacts() {
    const navigate = useNavigate();
    const { id } = useParams();

    // ✅ 항상 최상단에서 선언
    const [product, setProduct] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(err => console.error(err));
    }, [id]);

    // ✅ 조건부 렌더링은 여기서 return 으로 처리
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
                    <div className="absolute bottom-3 left-0 w-full text-lg font-medium p-3 bg-blue-300">
                        {product.name}
                    </div>
                </div>

                {/* 영양정보 */}
                <div>
                    <div className="font-medium px-6 py-3 mb-2 border-b border-[#EAEAEA]">영양 정보</div>
                    <div className="px-6 py-3 space-y-2 bg-blue-300">
                        {items.map((item) => (
                            <div key={item.label} className="flex justify-between text-sm md:text-base font-light">
                                <span>{item.label}</span>
                                <span>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* 적합 버튼 */}
            <button
                onClick={() => setIsOpen(true)}
                className="mt-auto w-full py-5 h-16 font-semibold text-white bg-[#003853]"
            >
                상품 적합성 판단하기
            </button>
        </div>
    )
}
