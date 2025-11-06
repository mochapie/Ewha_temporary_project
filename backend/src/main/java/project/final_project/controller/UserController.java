package project.final_project.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.final_project.entity.UserPrivate;
import project.final_project.repository.UserPrivateRepository;
import project.final_project.security.JwtTokenProvider;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173") // ✅ React 연결 허용
public class UserController {

    private final UserPrivateRepository userPrivateRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public UserController(UserPrivateRepository userPrivateRepository,
                          JwtTokenProvider jwtTokenProvider) {
        this.userPrivateRepository = userPrivateRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    // ✅ 로그인된 사용자 정보 반환
    @GetMapping("/me")
    public ResponseEntity<UserPrivate> getMyInfo(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        // JWT 토큰에서 username 추출
        String token = authHeader.substring(7);
        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(401).build();
        }

        String username = jwtTokenProvider.getUsernameFromToken(token);

        // username으로 DB에서 사용자 조회
        UserPrivate user = userPrivateRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자 정보를 찾을 수 없습니다."));

        return ResponseEntity.ok(user);
    }
}
