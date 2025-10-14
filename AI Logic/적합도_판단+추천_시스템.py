# -*- coding: utf-8 -*-
"""
적합도 판단 + 추천 시스템 (FastAPI 버전)
로직은 원본 그대로 유지하고, 요청/응답 구조만 백엔드 연동용으로 변경
"""

import pandas as pd
import math
import mysql.connector
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# ---------------------------------------------------------
# 🔹 FastAPI 초기화
# ---------------------------------------------------------
app = FastAPI(title="적합도 판단 + 추천 시스템 API")

# ---------------------------------------------------------
# 🔹 OpenAI API Key
# ---------------------------------------------------------
client = OpenAI(api_key="YOUR_OPENAI_API_KEY")  # 👈 환경변수로 대체 권장

# ---------------------------------------------------------
# 🔹 RDS 연결 설정
# ---------------------------------------------------------
RDS_HOST = "ewha-baekkot-ending.c5cq20gw2kei.ap-northeast-2.rds.amazonaws.com"
RDS_USER = "popo"
RDS_PW = "EWHA_ending25"

# ---------------------------------------------------------
# 🔹 요청 바디 정의
# ---------------------------------------------------------
class RequestBody(BaseModel):
    user_id: str
    product_name: str

# ---------------------------------------------------------
# 🔹 숫자 변환 유틸
# ---------------------------------------------------------
def num(x):
    try:
        return float(str(x).replace(",", "").replace("mg", "").replace("g", "").replace("kcal", "").strip())
    except:
        return None

def split_list(x):
    if x is None or (isinstance(x, float) and pd.isna(x)):
        return []
    return [t.strip() for t in str(x).replace(";", ",").split(",") if t.strip()]

# ---------------------------------------------------------
# 🔹 헬스컨디션 룰
# ---------------------------------------------------------
health_condition_rules = {
    "고혈압": {"나트륨": "low"},
    "당뇨": {"당류": "low"},
    "감량": {"칼로리": "low"},
    "고지혈증": {"지방": "low", "포화지방": "low", "트랜스지방": "low"},
    "심혈관질환": {"나트륨": "low", "포화지방": "low", "콜레스테롤": "low"},
    "신장질환": {"나트륨": "low", "단백질": "low"},
    "간질환": {"당류": "low", "지방": "low"},
    "골다공증": {"칼슘": "high", "나트륨": "low"},
    "고콜레스테롤혈증": {"콜레스테롤": "low", "포화지방": "low"},
    "통풍": {"단백질": "low"},
}

# ---------------------------------------------------------
# 🔹 주요 분석 엔드포인트
# ---------------------------------------------------------
@app.post("/analyze")
def analyze(body: RequestBody):
    user_id = body.user_id
    product_name = body.product_name

    # ✅ 1. 사용자 정보 불러오기
    conn = mysql.connector.connect(host=RDS_HOST, user=RDS_USER, password=RDS_PW, database="user_info_db")
    user_df = pd.read_sql("SELECT user_id, allergies, medical_conditions FROM user_private WHERE user_id = %s",
                          conn, params=[user_id])
    conn.close()

    if user_df.empty:
        raise HTTPException(status_code=404, detail="사용자 정보를 찾을 수 없습니다.")

    user_allergies = split_list(user_df.iloc[0]["allergies"])
    user_goals = split_list(user_df.iloc[0]["medical_conditions"])

    # ✅ 2. 제품 데이터 불러오기
    conn = mysql.connector.connect(host=RDS_HOST, user=RDS_USER, password=RDS_PW, database="product_db")
    df = pd.read_sql("SELECT * FROM ramen_db", conn)
    conn.close()

    df.columns = [c.strip().replace(" ", "") for c in df.columns]
    for col in df.columns:
        if any(unit in col for unit in ["mg", "g", "kcal"]):
            df[col] = df[col].apply(num)
    if "개별내용량" in df.columns:
        df["개별내용량"] = df["개별내용량"].apply(num)

    # ✅ 3. 기준 제품 선택
    row = df[df["품명"] == product_name]
    if row.empty:
        raise HTTPException(status_code=404, detail=f"'{product_name}' 제품을 찾을 수 없습니다.")
    row = row.iloc[0]

    # ✅ 4. 건강목표 매핑
    target_map = {}
    for goal in user_goals:
        if goal in health_condition_rules:
            target_map.update(health_condition_rules[goal])
    if not target_map:
        target_map = {"칼로리": "low"}

    # ✅ 5. 알레르기 직접 체크
    notice = str(row.get("알레르기", "")).lower()
    final = "부적합" if any(a.lower() in notice for a in user_allergies) else "적합"

    # ✅ 6. 성분 평가
    def calc_per_100(df, key):
        df_valid = df.dropna(subset=["개별내용량"])
        vals = []
        for _, r in df_valid.iterrows():
            try:
                vals.append(float(r.get(key, 0)) / float(r.get("개별내용량", 100)) * 100)
            except:
                continue
        return sum(vals) / len(vals) if vals else None

    nutrition_results = []
    for key, direction in target_map.items():
        try:
            value = float(row.get(key, 0))
            total = float(row.get("개별내용량", 100))
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
            "성분": key, "값": per_100, "평균": avg_value,
            "방향": direction, "평가": status
        })

    # ✅ 7. 간접 알레르기
    indirect = row.get("간접알레르기", None)
    warning_text = ""
    if indirect and not (isinstance(indirect, float) and math.isnan(indirect)):
        indirect_str = str(indirect).lower()
        for a in user_allergies:
            if a.lower() in indirect_str or indirect_str in ["o", "yes", "1", "true"]:
                warning_text = f"⚠️ '{a}' 간접 알레르기 주의"
                break

    # ✅ 8. OpenAI 설명 생성
    try:
        nutrition_summary = ", ".join([f"{n['성분']}({n['평가']}, {n['방향']})" for n in nutrition_results])
        prompt = f"""
사용자 조건:
- 알레르기: {', '.join(user_allergies) if user_allergies else '없음'}
- 건강목표: {', '.join(user_goals)}
- 주요 평가 성분 및 방향: {nutrition_summary}

제품명: {product_name}
최종판정: {final}
경고문구: {warning_text}
"""
        res = client.responses.create(model="gpt-4.1-mini", input=prompt, temperature=0.3)
        reason = res.output_text.strip()
    except Exception:
        reason = "(AI 설명 생성 실패)"


    
# ---------------------------------------------------------
# 🔹 여기서부터 추천 시스템 (XGBoost만)
# ---------------------------------------------------------

    
    # ✅ 9. 유사도 기반 추천
    def has_allergy(row, allergy_list):
        text = str(row.get("알레르기", "")).lower()
        return any(a.lower() in text for a in allergy_list)

    pool_df = df[~df.apply(lambda r: has_allergy(r, user_allergies), axis=1)].copy()
    pool_df = pool_df[pool_df["품명"] != product_name].copy()

    raw_cols = ["열량","칼로리","나트륨","당류","탄수화물","지방","단백질",
                "콜레스테롤","포화지방","트랜스지방","칼슘","카페인"]
    nutr_cols = [c for c in raw_cols if c in df.columns]

    def to_per100_frame(x):
        out = {}
        total = float(x.get("개별내용량", 100)) or 100
        for c in nutr_cols:
            try:
                out[c] = float(x.get(c, np.nan)) / total * 100
            except:
                out[c] = np.nan
        return pd.Series(out)

    base_vec = to_per100_frame(row)
    pool_per100 = pool_df.apply(to_per100_frame, axis=1)
    fill_vals = pool_per100.median()
    pool_per100 = pool_per100.fillna(fill_vals)
    base_vec = base_vec.fillna(fill_vals)
    sim = cosine_similarity([base_vec.values], pool_per100.values)[0]
    pool_df = pool_df.assign(similarity=sim).sort_values("similarity", ascending=False)
    top6 = pool_df.head(6)["품명"].tolist()

    # ✅ 응답 반환
    return {
        "제품명": product_name,
        "최종판정": final,
        "AI설명": reason,
        "경고": warning_text,
        "성분분석": nutrition_results,
        "추천제품": top6
    }
