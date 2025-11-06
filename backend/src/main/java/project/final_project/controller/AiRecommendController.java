package project.final_project.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class AiRecommendController {

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeProduct(@RequestBody Map<String, Object> request) {
        try {
            String userId = request.get("user_id").toString();
            String productName = request.get("product_name").toString();

            // ✅ FastAPI 서버 URL (정상 연결 확인됨)
            String url = "http://127.0.0.1:8000/analyze";

            // ✅ 요청 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // ✅ 요청 본문 구성
            Map<String, Object> payload = new HashMap<>();
            payload.put("user_id", userId);
            payload.put("product_name", productName);

            // ✅ Jackson으로 JSON 문자열 변환
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonBody = objectMapper.writeValueAsString(payload);

            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

            // ✅ FastAPI로 POST 요청 보내기
            ResponseEntity<String> response =
                    restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            // ✅ FastAPI에서 받은 결과 반환
            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("⚠️ FastAPI 요청 실패: " + e.getMessage());
        }
    }
}
