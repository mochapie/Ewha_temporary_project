package project.final_project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import project.final_project.dto.AiRecommendationResponse;

@RestController
@RequestMapping("/api/ai")
public class AiRecommendController {

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/analyze")
    public AiRecommendationResponse analyzeProduct(
            @RequestParam("userId") String userId,
            @RequestParam("productName") String productName) {


        // FastAPI 서버 URL
        String fastApiUrl = "http://localhost:8000/analyze";

        // 요청 바디 구성
        String jsonBody = String.format("{\"user_id\": \"%s\", \"product_name\": \"%s\"}", userId, productName);

        // HTTP 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

        try {
            // FastAPI 호출
            ResponseEntity<AiRecommendationResponse> response =
                    restTemplate.exchange(fastApiUrl, HttpMethod.POST, entity, AiRecommendationResponse.class);

            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return new AiRecommendationResponse("AI 설명 생성1 실패", null);
        }
    }
}
