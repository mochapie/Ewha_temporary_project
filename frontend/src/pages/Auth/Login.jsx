import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [formData, setFormData] = useState({
        id: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 로그인 인증 로직
        const isAuthenticated = true; // 프론트 테스트용
        // 로그인 성공 시 홈 화면으로
        if (isAuthenticated) {
            navigate("/");
        } else {
            alert("아이디/비밀번호가 맞지 않습니다.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* 로고 */}
            <div className="flex justify-center items-center mt-[73px]">
                <img src="/logo.svg" className="w-20 sm:w-[100px]" alt="로고" />
            </div>
            
            {/* 입력창 + 버튼 */}
            <div className="w-full max-w-xl mx-auto px-5 mt-[50px]">
                <form onSubmit={handleSubmit} className="w-full">
                    <input
                        type="text"
                        name="id"
                        placeholder="아이디"
                        value={formData.id}
                        onChange={handleChange}
                        className="w-full h-[57px] px-[30px] mb-[17px] rounded-[27px] 
                        border border-[#CCCCCC] placeholder:text-[#CCCCCC] focus:outline-none"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="비밀번호"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full h-[57px] px-[30px] mb-[30px] rounded-[27px] 
                        border border-[#CCCCCC] placeholder:text-[#CCCCCC] focus:outline-none"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full h-[50px] rounded-[25px] 
                        font-medium text-[#FFFFFF] bg-[#003853]
                        hover:shadow-lg transition"
                    >
                        로그인
                    </button>
                </form>

                <button
                    onClick={() => navigate("/signup")}
                    className="w-full h-[50px] mt-[15px] rounded-[25px] 
                    font-medium text-[#003853] bg-[#A0B9C9]
                    hover:shadow-lg transition"
                >
                    회원가입
                </button>
            </div>
        </div>
    )
}