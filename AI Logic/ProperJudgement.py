from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import pandas as pd
import os
import math

# 🔹 OpenAI API Key
client = OpenAI(api_key="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")

# 🔹 FastAPI 초기화
app = FastAPI(title="상품 적합성 분석 API", version="1.0")

# ---------------------------------------------------------
# 숫자 변환 유틸 함수
# ---------------------------------------------------------
def num(x):
    try:
        return float(str(x).replace(",", "")
                             .replace("mg", "")
                             .replace("g", "")
                             .replace("kcal", "")
                             .strip())
    except:
        return None

# ---------------------------------------------------------
# 입력 데이터 모델
# ---------------------------------------------------------
class ProductRequest(BaseModel):
    product_name: str
    user_allergies: list[str]
    user_goals: list[str]

# ---------------------------------------------------------
# 건강 상태별 성분 매핑
# ---------------------------------------------------------
health_condition_rules = {
    "고혈압": {"나트륨(mg)": "low"},
    "당뇨": {"당류(g)": "low"},
    "감량": {"칼로리(kcal)": "low"},
    "고지혈증": {"지방(g)": "low", "포화지방(g)": "low", "트랜스지방(g)": "low"},
    "심혈관질환": {"나트륨(mg)": "low", "포화지방(g)": "low", "콜레스테롤(mg)": "low"},
    "신장질환": {"나트륨(mg)": "low", "단백질(g)": "low"},
    "간질환": {"당류(g)": "low", "지방(g)": "low"},
    "골다공증": {"칼슘(mg)": "high", "나트륨(mg)": "low"},
    "고콜레스테롤혈증": {"콜레스테롤(mg)": "low", "포화지방(g)": "low"},
    "통풍": {"단백질(g)": "low"},
}

# ---------------------------------------------------------
# API 엔드포인트
# ---------------------------------------------------------
@app.post("/product")
def analyze_product(request: ProductRequest):
    """
    사용자가 선택한 제품을 기반으로
    알레르기 및 건강조건에 따른 적합도를 분석합니다.
    """

    # 1. DB 혹은 서버에서 데이터 불러오기
    DATA_PATH = "  ## AWS 서버에서 데이터 불러와서 경로 수정하면 될 듯 ##  "
    df = pd.read_csv(DATA_PATH)
    df.columns = [c.strip().replace(" ", "") for c in df.columns]

    for col in df.columns:
        if any(unit in col for unit in ["mg", "g", "kcal"]):
            df[col] = df[col].apply(num)
    if "1개내용량(g)" in df.columns:
        df["1개내용량(g)"] = df["1개내용량(g)"].apply(num)

    # 2. 선택 제품 추출
    row = df[df["품명"] == request.product_name]
    if row.empty:
        return {"error": f"'{request.product_name}' 제품을 찾을 수 없습니다."}
    row = row.iloc[0]

    # 3. 건강목표별 주요 성분 통합
    target_map = {}
    for goal in request.user_goals:
        if goal in health_condition_rules:
            target_map.update(health_condition_rules[goal])
    if not target_map:
        target_map = {"나트륨(mg)": "low"}

    # 4. 알레르기 직접 체크
    notice = str(row.get("알레르기", "")).lower()
    if any(a.lower() in notice for a in request.user_allergies):
        final = "부적합"
    else:
        final = "적합"

    # 5. 성분별 비교 (평균 기준)
    def calc_per_100(df, key):
        df_valid = df.dropna(subset=["1개내용량(g)"])
        vals = []
        for _, r in df_valid.iterrows():
            try:
                vals.append(float(r.get(key, 0)) / float(r.get("1개내용량(g)", 100)) * 100)
            except:
                continue
        return sum(vals) / len(vals) if vals else None

    nutrition_results = []
    for key, direction in target_map.items():
        try:
            value = float(row.get(key, 0))
            total = float(row.get("1개내용량(g)", 100))
            per_100 = value / total * 100
        except:
            per_100 = None

        avg_value = calc_per_100(df, key)
        if value == 0 or per_100 == 0:
          status = "미함유"
        elif avg_value is None or per_100 is None:
          status = "정보부족"
        else:
          diff_ratio = per_100 / avg_value if avg_value != 0 else None
          if diff_ratio is None:
            status = "정보부족"
          elif diff_ratio > 1.1:
            status = "평균보다 높음"
          elif diff_ratio < 0.9:
            status = "평균보다 낮음"
          else:
            status = "평균과 비슷함"

        nutrition_results.append({
            "성분": key,
            "값": per_100,
            "평균": avg_value,
            "방향": direction,
            "평가": status
        })

    # 6. 간접 알레르기 경고
    indirect = row.get("간접알레르기", None)
    warning_text = ""
    if indirect is not None and not (isinstance(indirect, float) and math.isnan(indirect)):
        indirect_str = str(indirect).lower()
        for a in request.user_allergies:
            if a.lower() in indirect_str or indirect_str in ["o", "yes", "1", "true"]:
                warning_text = f"⚠️ '{a}' 간접 알레르기 주의"
                break

    # 7. GPT 요약 생성
    try:
        nutrition_summary = ", ".join(
            [f"{n['성분']}({n['평가']}, {n['방향']})" for n in nutrition_results]
        )

        prompt = f"""
사용자 조건:
- 알레르기: {', '.join(request.user_allergies) if request.user_allergies else '없음'}
- 건강목표: {', '.join(request.user_goals)}
- 주요 평가 성분 및 방향: {nutrition_summary}

제품명: {request.product_name}
알레르기 판정: {final}
경고문구: {warning_text}

이 정보를 바탕으로 다음을 자연스럽게 3문장 이내로 설명해줘: 
1. 알레르기 기준으로 이 제품이 왜 '{final}' 인지, 
(만약 직접 포함된 성분이 있다면 간접 알레르기보다 직접 포함이 우선임을 명확히 인지함. 간접 알레르기만 있을 경우는 '간접 알레르기 주의'라고 구체적으로 표현) 
2. 사용자의 건강상태(예: 고혈압, 감량 등)와 제품의 성분 특성 간의 관계.
(성분 상세 분석값에 기반하여 객관적으로 설명하며, 모호한 표현은 사용하지 않음)
"""
        res = client.responses.create(
            model="gpt-4.1-mini",
            input=prompt,
            temperature=0.3,
        )
        reason = res.output_text.strip()
    except Exception:
        reason = "(AI 설명 생성 실패)"

    # 8. 결과 반환 (JSON 형태)
    return {
        "제품명": request.product_name,
        "최종판정(알레르기기준)": final,
        "이유": reason,
        "경고": warning_text,
        "성분평가": nutrition_results
    }
