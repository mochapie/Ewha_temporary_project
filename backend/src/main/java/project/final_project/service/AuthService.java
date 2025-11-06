package project.final_project.service;

import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import project.final_project.dto.SignupRequest;
import project.final_project.entity.UserIngredient;
import project.final_project.entity.UserPrivate;
import project.final_project.repository.UserIngredientRepository;
import project.final_project.repository.UserPrivateRepository;
import project.final_project.security.JwtTokenProvider;
import project.final_project.security.JwtBlacklistService;

import java.util.Date;
import java.util.List;

@Service
public class AuthService {

    private final UserPrivateRepository userPrivateRepository;
    private final UserIngredientRepository userIngredientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtBlacklistService jwtBlacklistService;

    public AuthService(UserPrivateRepository userPrivateRepository,
                       UserIngredientRepository userIngredientRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider,
                       JwtBlacklistService jwtBlacklistService) {
        this.userPrivateRepository = userPrivateRepository;
        this.userIngredientRepository = userIngredientRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.jwtBlacklistService = jwtBlacklistService;
    }

    // ✅ 회원가입
    @Transactional
    public void signup(SignupRequest request) {
        // 중복 아이디 확인
        if (userPrivateRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }

        // 1️⃣ 사용자 정보 저장
        UserPrivate user = new UserPrivate();
        user.setNickname(request.getNickname());
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword())); // 비밀번호 암호화
        user.setAge(request.getAge());
        user.setGender(request.getGender());
        user.setAllergies(String.join(",", request.getAllergies()));
        user.setMedicalConditions(String.join(",", request.getMedicalConditions()));

        userPrivateRepository.save(user);

        // 2️⃣ 영양성분 저장
        if (request.getIngredients() != null && !request.getIngredients().isEmpty()) {
            List<UserIngredient> ingredients = request.getIngredients().stream().map(pref -> {
                UserIngredient entity = new UserIngredient();
                entity.setUser(user);
                entity.setIngredient(pref.getIngredient());
                entity.setDirection(pref.getDirection());
                return entity;
            }).toList();

            userIngredientRepository.saveAll(ingredients);
        }
    }

    // ✅ 로그인
    public String login(String username, String password) {
        UserPrivate user = userPrivateRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("아이디를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return jwtTokenProvider.generateToken(username);
    }

    // ✅ 로그아웃
    public void logout(String token) {
        if (!jwtTokenProvider.validateToken(token)) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }

        Date expiry = jwtTokenProvider.getExpirationDate(token);
        jwtBlacklistService.addToBlacklist(token, expiry);
        System.out.println("🚫 로그아웃된 토큰: " + token);
    }
}
