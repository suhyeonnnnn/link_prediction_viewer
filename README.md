# Concept Network Dashboard

개념 네트워크 시각화 대시보드

## 🚀 빠른 시작

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저가 자동으로 http://localhost:3000 에서 열립니다.

## ✨ 주요 기능

### 왼쪽 패널
- Top Predicted Concept Pairs 리스트
- Prediction Score, Frequency, Field, Community 정보
- 클릭 시 자식 개념 표시 (2컬럼)

### 오른쪽 패널
- D3.js 네트워크 그래프 (드래그, 줌 가능)
- Community Pair Ranking
- Reset 버튼

## 🛠️ 기술 스택

- React 18
- Vite
- D3.js
- Papa Parse
