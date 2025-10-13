import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftIcon, HomeIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function NutritionFacts() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  // ✅ 테스트용 user (로그인 연동 전)
  const user = {
    name: "홍길동",
    allergies: "밀, 땅콩,카페인",
  };

  // ✅ 상품 정보 불러오기
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));

    // ✅ 추천 상품 더미 (AI 연동 전)
    setRecommendedProducts([
      { id: 101, name: "진짬뽕 컵라면 115g", image: "/images/jjambbong.png" },
      { id: 102, name: "열라면 큰사발 110g", image: "/images/yeolramyun.png" },
      { id: 103, name: "비빔면 130g", image: "/images/bibimmyun.png" },
    ]);
  }, [id]);

  // ✅ 스크롤 잠금 처리
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }, [isOpen]);

  if (!product) {
    return <p className="text-center mt-10">로딩 중...</p>;
  }

  // ✅ 영양 정보 리스트
  const items = [
    { label: "열량", value: product.calories, unit: "kcal" },
    { label: "나트륨", value: product.sodium, unit: "mg" },
    { label: "탄수화물", value: product.carbohydrate, unit: "g" },
    { label: "당류", value: product.sugar, unit: "g" },
    { label: "지방", value: product.fat, unit: "g" },
    { label: "트랜스지방", value: product.transFat, unit: "g" },
    { label: "포화지방", value: product.saturatedFat, unit: "g" },
    { label: "콜레스테롤", value: product.cholesterol, unit: "mg" },
    { label: "단백질", value: product.protein, unit: "g" },
  ];

  // ✅ 알레르기 비교 로직
  let allergyNote = "";
  let potentialAllergyNote = "";
  let matchedAllergies = [];
  let matchedPotentialAllergies = [];

  try {
    const userAllergiesArray = user.allergies?.split(",").map((a) => a.trim()) || [];
    const allergensArray = product.allergy?.split(",").map((a) => a.trim()) || [];
    const potentialAllergensArray = product.indirectAllergy?.split(",").map((a) => a.trim()) || [];

    matchedAllergies = userAllergiesArray.filter((a) => allergensArray.includes(a));
    matchedPotentialAllergies = userAllergiesArray.filter((a) =>
      potentialAllergensArray.includes(a)
    );

    allergyNote =
      matchedAllergies.length > 0
        ? `❌ ${matchedAllergies.join(", ")} 성분이 함유되어 있어요.`
        : `✅ ${userAllergiesArray.join(", ")} 성분이 함유되어 있지 않아요.`;

    potentialAllergyNote =
      matchedPotentialAllergies.length > 0
        ? `⚠️ ${matchedPotentialAllergies.join(", ")} 성분이 미량 존재할 수 있어요.`
        : null;
  } catch (error) {
    console.error("알레르기 처리 중 오류:", error);
  }

  // ✅ 적합성 판정 (자동 결정)
  const suitability = {
    suitable: { text: "적합", color: "text-green-600" },
    unsuitable: { text: "부적합", color: "text-red-600" },
    caution: { text: "주의가 필요", color: "text-yellow-600" },
  };

  let resultStatus = "suitable";
  if (matchedAllergies.length > 0) resultStatus = "unsuitable";
  else if (matchedPotentialAllergies.length > 0) resultStatus = "caution";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 상단 내비게이션 */}
      <header className="fixed top-0 left-0 bg-white w-full flex items-center justify-between p-3 shadow">
        <button onClick={() => navigate(-1)} className="hover:scale-105 transition">
          <ArrowLeftIcon className="w-7 h-7" />
        </button>
        <Link to="/" className="hover:scale-105 transition">
          <HomeIcon className="w-7 h-7" />
        </Link>
      </header>

      {/* 본문 */}
      <main className="grid grid-cols-1 md:grid-cols-2 pt-[52px] pb-[70px]">
        <div className="w-full max-w-md mx-auto md:mt-[100px]">
          <img
            src={product.imageUrl}
            alt={`${product.name} 이미지`}
            className="w-full h-[360px] md:h-full object-cover"
          />
        </div>

        <div className="md:mt-[50px]">
          <div className="w-full text-lg font-medium p-3">{product.name}</div>
          <div className="w-full h-2.5 bg-[#EAEAEA]"></div>
          <div className="w-full font-medium px-6 py-3 mb-2 border-b border-[#EAEAEA]">영양 정보</div>
          <div className="w-full font-light px-6 py-3 space-y-2">
            {items.map((item) => (
              <div key={item.label} className="flex justify-between text-sm md:text-base">
                <span>{item.label}</span>
                <span>{item.value}{item.unit}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 적합성 판단 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-0 left-0 w-full py-5 h-[63px] font-semibold md:text-lg text-white bg-[#003853]"
      >
        상품 적합성 판단하기
      </button>

      {/* 모달 */}
      {isOpen && (
        <div className="fixed inset-0 flex items-end md:items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col bg-white p-5 relative w-full md:w-1/2 h-[80%] md:h-[80%]
                          rounded-t-2xl rounded-b-none md:rounded-2xl animate-slide-up md:animate-fade-in">
            <button onClick={() => setIsOpen(false)} className="absolute top-3 right-3">
              <XCircleIcon className="w-9 h-9 text-[#EAEAEA]" />
            </button>

            <div className="mt-10 overflow-y-auto flex-1">
              <div className="bg-[#EAEAEA] rounded-xl p-3 text-center">
                <p className="text-lg font-medium">
                  이 상품은 {user.name} 님께{" "}
                  <span className={suitability[resultStatus].color}>
                    {suitability[resultStatus].text}
                  </span>
                  해요!
                </p>
              </div>
              <div className="mt-3 space-y-1">
                <p className="font-medium">{allergyNote}</p>
                {potentialAllergyNote && <p className="font-medium">{potentialAllergyNote}</p>}
              </div>

              {/* 추천 상품 */}
              <div className="mt-10 p-3 border-t border-[#CCCCCC]">
                <p className="font-light">이런 상품도 추천해요 😆</p>
              </div>
              <div className="p-1 grid grid-cols-3 gap-3">
                {recommendedProducts.map((p) => (
                  <div key={p.id} className="p-1 w-full max-w-[150px] mx-auto shadow hover:scale-105 transition">
                    <div className="w-full h-[100px] lg:h-[150px] mb-3">
                      <img src={p.image} alt={`${p.name} 이미지`} className="w-full h-full object-cover border-[#EAEAEA] rounded" />
                    </div>
                    <div className="h-12 flex items-start">
                      <span className="font-normal line-clamp-2">{p.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
