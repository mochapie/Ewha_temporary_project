package project.final_project.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtTokenProvider jwtTokenProvider;
    private final JwtBlacklistService jwtBlacklistService;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, JwtBlacklistService jwtBlacklistService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.jwtBlacklistService = jwtBlacklistService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String requestURI = request.getRequestURI();

        // ✅ 1️⃣ AI 분석 요청은 JWT 인증 없이 통과시킴
        if (requestURI.startsWith("/api/ai")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ 2️⃣ Authorization 헤더에서 토큰 추출
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            // 🚫 3️⃣ 로그아웃된 토큰은 차단
            if (jwtBlacklistService.isBlacklisted(token)) {
                log.warn("🚫 차단된(로그아웃된) 토큰 접근 시도");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("토큰이 로그아웃되어 접근이 거부되었습니다.");
                return;
            }

            // ✅ 4️⃣ 유효한 토큰이면 인증 처리
            if (jwtTokenProvider.validateToken(token)) {
                String username = jwtTokenProvider.getUsernameFromToken(token);
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(username, null, null);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.info("✅ JWT 인증 성공: {}", username);
            }
        }

        // ✅ 5️⃣ 다음 필터로 전달
        filterChain.doFilter(request, response);
    }
}
