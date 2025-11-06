import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeftIcon, HomeIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function NutritionFacts() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [me, setMe] = useState(null); // ✅ 로그인 사용자
  const [isOpen, setIsOpen] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [explanation, setExplanation] = useState('AI 설명을 불러오는 중...');

  // 1) 내 정보 불러오기
  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await api.get('/api/users/me');
        setMe(res.data);
      } catch (e) {
        console.error('내 정보 불러오기 실패:', e);
        navigate('/login');
      }
    };
    loadMe();
  }, [navigate]);

  // 2) 상품 정보 불러오기
  useEffect(() => {
    if (!id) return;
    api
      .get(`/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error('상품 불러오기 오류:', err));

    setRecommendedProducts([
      { id: 101, name: '큰컵 불닭볶음면', image: 'https://sitem.ssgcdn.com/59/99/83/item/0000008839959_i1_1200.jpg' },
      { id: 102, name: '큰컵 탱글 머쉬룸크림파스타', image: 'https://sitem.ssgcdn.com/16/91/48/item/1000697489116_i1_1200.jpg' },
      { id: 103, name: '뽀로로짜장', image: 'https://sitem.ssgcdn.com/73/21/55/item/1000683552173_i1_1200.jpg' },
    ]);
  }, [id]);

  // 3) 스크롤 잠금
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

  // ✅ 4) AI 설명 요청 (FastAPI로 user_id와 상품명 전달)
  const fetchAIExplanation = async () => {
    if (!product) {
      alert("상품 정보가 없습니다.");
      return;
    }

    try {
      // ✅ 로그인 시 저장된 user_id 확인 (백엔드 로그인 성공 시 localStorage에 저장해야 함)
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        alert("로그인 정보가 없습니다. 다시 로그인 해주세요.");
        return;
      }

      console.log("📤 전송할 데이터:", { user_id: userId, product_name: product.name });

      // ✅ Spring → FastAPI로 전달되는 JSON 구조에 맞춤
      const res = await api.post("/api/ai/analyze", {
        user_id: String(userId),
        product_name: product.name,
      });

      console.log("✅ FastAPI 응답:", res.data);

      // ✅ FastAPI 응답 중 ai_description 키 확인
      const aiText =
        res.data?.ai_description ??
        res.data?.aiDescription ??
        "AI 설명을 불러올 수 없습니다.";

      setExplanation(aiText);
    } catch (err) {
      console.error("❌ AI 요청 실패:", err);
      setExplanation("AI 설명을 불러올 수 없습니다.");
    }
  };


  if (!product || !me) {
    return <p className="text-center mt-10">로딩 중...</p>;
  }

  const items = [
    { label: '열량', value: product.calories, unit: 'kcal' },
    { label: '나트륨', value: product.sodium, unit: 'mg' },
    { label: '탄수화물', value: product.carbohydrate, unit: 'g' },
    { label: '당류', value: product.sugar, unit: 'g' },
    { label: '지방', value: product.fat, unit: 'g' },
    { label: '트랜스지방', value: product.transFat, unit: 'g' },
    { label: '포화지방', value: product.saturatedFat, unit: 'g' },
    { label: '콜레스테롤', value: product.cholesterol, unit: 'mg' },
    { label: '단백질', value: product.protein, unit: 'g' },
  ];

  let allergyNote = '';
  let potentialAllergyNote = '';
  try {
    const userAllergiesArray = (me.allergies || '').split(',').map((s) => s.trim()).filter(Boolean);
    const allergensArray = (product.allergy || '').split(',').map((s) => s.trim()).filter(Boolean);
    const potentialAllergensArray = (product.indirectAllergy || '').split(',').map((s) => s.trim()).filter(Boolean);

    const matchedAllergies = userAllergiesArray.filter((a) => allergensArray.includes(a));
    const matchedPotential = userAllergiesArray.filter((a) => potentialAllergensArray.includes(a));

    allergyNote =
      matchedAllergies.length > 0
        ? `❌ ${matchedAllergies.join(', ')} 성분이 함유되어 있어요.`
        : userAllergiesArray.length > 0
        ? `✅ ${userAllergiesArray.join(', ')} 성분이 함유되어 있지 않아요.`
        : '✅ 등록된 알레르기가 없어요.';

    potentialAllergyNote =
      matchedPotential.length > 0 ? `⚠️ ${matchedPotential.join(', ')} 성분이 미량 존재할 수 있어요.` : null;
  } catch (e) {
    console.error('알레르기 비교 오류:', e);
  }

  const suitability = {
    suitable: { text: '적합', color: 'text-green-600' },
    unsuitable: { text: '부적합', color: 'text-red-600' },
    caution: { text: '주의가 필요', color: 'text-yellow-600' },
  };

  const userAll = (me.allergies || '').split(',').map((s) => s.trim()).filter(Boolean);
  const matchedA = userAll.filter((a) => (product.allergy || '').includes(a));
  const matchedP = userAll.filter((a) => (product.indirectAllergy || '').includes(a));
  let resultStatus = 'suitable';
  if (matchedA.length > 0) resultStatus = 'unsuitable';
  else if (matchedP.length > 0) resultStatus = 'caution';

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="fixed top-0 left-0 bg-white w-full flex items-center justify-between p-3 shadow">
        <button onClick={() => navigate(-1)} className="hover:scale-105 transition">
          <ArrowLeftIcon className="w-7 h-7" />
        </button>
        <Link to="/" className="hover:scale-105 transition">
          <HomeIcon className="w-7 h-7" />
        </Link>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 pt-[52px] pb-[70px]">
        <div className="w-full max-w-md mx-auto md:mt-[75px]">
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
                <span>
                  {item.value} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <button
        onClick={() => {
          setIsOpen(true);
          fetchAIExplanation();
        }}
        className="fixed bottom-0 left-0 w-full py-5 h-[63px] font-semibold md:text-lg text-white bg-[#003853]"
      >
        상품 적합성 판단하기
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-end md:items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className="flex flex-col bg-white p-5 relative w-full md:w-1/2 h-[80%] md:h-[80%]
                          rounded-t-2xl rounded-b-none md:rounded-2xl"
          >
            <button onClick={() => setIsOpen(false)} className="absolute top-3 right-3">
              <XCircleIcon className="w-9 h-9 text-[#EAEAEA]" />
            </button>

            <div className="mt-10 overflow-y-auto flex-1">
              <div className="bg-[#EAEAEA] rounded-xl p-3 text-center">
                <p className="text-lg font-medium">
                  이 상품은 {me.nickname ?? me.username} 님께{' '}
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

              <div className="mt-3 py-3 border-t border-[#CCCCCC]">
                <p className="whitespace-pre-line">{explanation}</p>
              </div>

              <div className="mt-3 p-3 border-t border-[#CCCCCC]">
                <p className="font-light">이런 상품도 추천해요 😆</p>
              </div>
              <div className="p-1 grid grid-cols-3 gap-3">
                {recommendedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-1 w-full max-w-[150px] mx-auto shadow hover:scale-105 transition"
                  >
                    <div className="w-full h-[100px] lg:h-[150px] mb-3">
                      <img
                        src={p.image}
                        alt={`${p.name} 이미지`}
                        className="w-full h-full object-cover border-[#EAEAEA] rounded"
                      />
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
