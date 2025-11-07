import { useState, useRef, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Cell } from 'recharts';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { HomeIcon, DocumentCheckIcon } from '@heroicons/react/24/solid'

const rankColors = {
    1: "#3D82AB",
    2: "#A0B9C9",
    3: "#003853",
    4: "#A0B9C9",
    5: "#3D82AB"
}

// 프론트 테스트용 비교 결과 데이터
// 실제는 BE에서 받아오기 (rank 순서대로)
const resultData = [
    { 
        rank: 1,
        id: "01", // DB 기준 ID
        name: "하와이안호스트 마카다미아 초콜릿 드링크",
        score: 75.05,
        nutriFacts: {
            "열량": {content: 500, unit: "kcal"},
            "나트륨": {content: 90, unit: "mg"},
            "단백질": {content: 7, unit: "g"}
        }, // 초기값 nutriFacts: {}
        imageUrl: "https://sitem.ssgcdn.com/18/57/94/item/1000712945718_i2_1200.jpg"
    },
    { 
        rank: 2,
        id: "02",
        name: "가나 쵸코우유",
        score: 70,
        nutriFacts: {
            "열량": {content: 500, unit: "kcal"},
            "나트륨": {content: 90, unit: "mg"},
            "단백질": {content: 7, unit: "g"}
        },
        imageUrl: "https://sitem.ssgcdn.com/18/79/44/item/1000644447918_i1_1200.jpg"
    },
    { 
        rank: 3,
        id: "03",
        name: "매일우유 초콜릿",
        score: 50.1,
        nutriFacts: {
            "열량": {content: 500, unit: "kcal"},
            "나트륨": {content: 90, unit: "mg"},
            "단백질": {content: 7, unit: "g"}
        },
        imageUrl: "https://sitem.ssgcdn.com/88/40/32/item/1000034324088_i1_1200.jpg"
    }
];

export default function ComparisonResult() {
    const [explanation, setExplanation] = useState("AI 설명을 불러오는 중...");
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <header className="fixed top-0 left-0 z-50 bg-white w-full h-[67px] flex items-center justify-between px-[20px]">
                <button 
                    onClick={() => navigate(-1)}
                    className="hover:scale-105 transition"
                >
                    <ArrowLeftIcon width={25} height={25}/>
                </button>
                <button 
                    onClick={() => navigate("/")}
                    className="hover:scale-105 transition"
                >
                    <HomeIcon width={25} height={25}/>
                </button>
            </header>

            <main className="px-[15px] py-[70px]">
                <div className="flex items-center w-full px-[5px] pb-5 border-b-[0.5px] border-[#CCCCCC]">
                    <DocumentCheckIcon width={22} height={22} fill="#10B981"/>
                    <span className="ml-[11px] text-[22px] font-medium">비교 완료!</span>
                </div>

                {/* 그래프 */}
                <div className="w-full px-[5px] py-[25px] border-b-[0.5px] border-[#CCCCCC]">
                    <ResultBarChart resultData={resultData} rankColors={rankColors} />
                </div>

                {/* 상품들 */}
                <div className="w-full px-[5px] py-[25px] flex flex-col space-y-[25px] border-b-[0.5px] border-[#CCCCCC]">
                    {resultData.map((item) => (
                        <div 
                            key={item.id}
                            className="flex items-center w-full h-[100px] md:h-[150px] lg:h-[200px]"
                        >
                            <div
                                style={{ color: rankColors[item.rank]}}
                                className="w-[30px] text-[22px] font-black self-start text-center leading-none"
                            >
                                {item.rank}.
                            </div>

                            <img 
                                src={item.imageUrl}
                                alt={`${item.name} 이미지`}
                                className="
                                    w-[100px] h-[100px] 
                                    md:w-[150px] md:h-[150px] 
                                    lg:w-[200px] lg:h-[200px]
                                    object-cover rounded-none 
                                    mr-[15px] md:mr-[25px] md:ml-[7px]
                                    border-[0.5px] border-[#CCCCCC]
                                "
                            />

                            <div className="h-[100px] md:h-[150px] lg:h-[200px] flex flex-1 flex-col min-w-0 justify-between">
                                <p className="text-[15px] md:text-base font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                                    {item.name}
                                </p>

                                <div className="text-[13px] md:text-[15px] font-light lg:space-y-2.5">
                                    {Object.entries(item.nutriFacts).map(([key, { content, unit }]) => (
                                        <p key={key}>
                                            <span className="mr-[30px]">{key}</span>
                                            <span>{content} {unit}</span>
                                        </p>
                                    ))}
                                </div>

                                <p className="text-[13px] md:text-[15px] font-medium">
                                    Total: {item.score.toFixed(1)} 점
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 상세 설명 */}
                <div className="w-full px-[5px] py-5 space-y-5">
                    <p className="text-[17px] font-medium">상세 설명</p>
                    <p className="whitespace-pre-line text-[15px] md:text-base font-light">{explanation}</p>
                </div>
            </main>
        </div>
    )
}


// =====================================================================================================================
//   그래프 함수
// =====================================================================================================================
function ResultBarChart({ resultData, rankColors }) {
    const chartRef = useRef(null);
    const [chartWidth, setChartWidth] = useState(0);
    const categoryCount = resultData.length;
    const slotWidth = chartWidth / categoryCount;
    const barWidth = Math.min(45, Math.max(30, slotWidth * 0.7));
    
    // 차트 너비 추적
    useLayoutEffect(() => {
        if (!chartRef.current) {
            return;
        }

        const throttle = (callback, delay) => {
            let lastCall = 0;
            return (...args) => {
                const now = Date.now();
                if (now - lastCall >= delay) {
                    lastCall = now;
                    callback(...args);
                }
            };
        };

        const updateChartWidth = throttle((width) => {
            setChartWidth(width);
        }, 120);

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                updateChartWidth(entry.contentRect.width);
            }
        });

        observer.observe(chartRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={chartRef}
            className="w-full min-w-0 max-w-[600px] mx-auto"
        >
            {chartWidth > 0 && (
                <ResponsiveContainer width="100%" height={257}>
                    <BarChart data={resultData} barCategoryGap="25%">
                        <XAxis
                            dataKey="name"
                            interval={0}
                            axisLine={{ stroke: "black"}}
                            tickLine={false}
                            tick={({ x, y, payload }) => {
                                const fontSize = 12;
                                const boxWidth = Math.min(90, slotWidth*0.9)
                                const maxCharsPerLine = Math.max(1, Math.floor(boxWidth / fontSize));
                                
                                const xText = payload.value ?? "";
                                const maxChars = maxCharsPerLine * 2;
                                let lines;
                                if (xText.length <= maxChars) {
                                    const line1 = xText.slice(0, maxCharsPerLine);
                                    const line2 = xText.slice(maxCharsPerLine, maxChars);
                                    lines = [line1, line2].filter(Boolean);
                                } else {
                                    const truncatedText = xText.slice(0, maxChars-3) + "...";
                                    const line1 = truncatedText.slice(0, maxCharsPerLine);
                                    const line2 = truncatedText.slice(maxCharsPerLine, maxChars);
                                    lines = [line1, line2].filter(Boolean);
                                }

                                return (
                                    <g transform={`translate(${x}, ${y + 10})`}>
                                        {lines.map((line, i) => (
                                            <text
                                                key={i}
                                                textAnchor="middle"
                                                fontSize={fontSize}
                                                fontWeight={500}
                                                dy={i * (fontSize + 1.5)}
                                            >
                                                <tspan x="0">
                                                    {line}
                                                </tspan>
                                            </text>
                                        ))}
                                    </g>
                                )
                            }}
                        />
                        <YAxis
                            domain={[0, 100]}
                            width={0}
                            axisLine={false}
                            tickLine={false}
                            tick={false}
                        />
                        <Bar 
                            dataKey="score"
                            barSize={barWidth}
                            label={{ 
                                position: "top", dy: -7,
                                fontSize: 12,
                                fontWeight: 500,
                                fill: "black",
                                formatter: (value) => value.toFixed(1)
                            }}
                        >
                            {resultData.map((item) => (
                                <Cell
                                    key={item.id}
                                    fill={rankColors[item.rank] ?? "#FFFFFF"}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}