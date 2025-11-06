package project.final_project.security;

import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class JwtBlacklistService {

    // 로그아웃된 토큰 저장소 (메모리 기반)
    private final Map<String, Date> blacklist = new ConcurrentHashMap<>();

    // 토큰 추가
    public void addToBlacklist(String token, Date expiryDate) {
        blacklist.put(token, expiryDate);
    }

    // 블랙리스트 여부 확인
    public boolean isBlacklisted(String token) {
        if (!blacklist.containsKey(token)) return false;

        // 만료된 토큰이면 자동 제거
        if (blacklist.get(token).before(new Date())) {
            blacklist.remove(token);
            return false;
        }
        return true;
    }
}
