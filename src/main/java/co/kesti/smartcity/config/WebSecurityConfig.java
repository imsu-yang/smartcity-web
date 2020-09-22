package co.kesti.smartcity.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import co.kesti.smartcity.security.CustomAccessDeniedHandler;
import co.kesti.smartcity.security.CustomAuthenticationEntryPoint;
import co.kesti.smartcity.security.CustomAuthenticationFailureHandler;
import co.kesti.smartcity.security.CustomAuthenticationSuccessHandler;
import co.kesti.smartcity.security.service.UserAccountService;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
//@Slf4j
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserAccountService userAccountService;

    /*
    @Override
    public void configure(WebSecurity web) throws Exception {
        // static 폴더 인증 제외
        web.ignoring().antMatchers("/css/**", "/js/**", "/img/**");
    }
    */

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // 권한
        http.authorizeRequests()
            .antMatchers("/testbed/write").authenticated()
            .antMatchers("/mypage/**").authenticated()                                              // 인증된 사용자 접근 - 마이페이지
            .antMatchers("/community/forum/write", "/community/forum/save").authenticated() // 인증된 사용자 접근 - 커뮤니티
            .antMatchers("/finedust/**").authenticated()                                                // 인증된 사용자 접근 - 미세먼지
            .antMatchers("/management/device/**").authenticated()                           // 인증된 사용자 접근 - 관리 > 디바이스
            .antMatchers("/management/event/**").authenticated()                            // 인증된 사용자 접근 - 관리 > 이벤트
            .antMatchers("/admin/**").hasRole("ADMIN")                                          // 관리자 권한 접근 - 관리자
            .antMatchers("/**").permitAll();                                                                // 모든 사용자 접근

        // 로그인
        http.formLogin()
            .loginPage("/member/login")
            .defaultSuccessUrl("/")
            .successHandler(customAuthenticationSuccessHandler())
            .failureHandler(customAuthenticationFailureHandler())
            .permitAll();

        // 로그아웃
        http.logout()
            .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
            .logoutSuccessUrl("/")
            .invalidateHttpSession(true)
            .deleteCookies();

        // 인증 전 접근 제한
        http.exceptionHandling().authenticationEntryPoint(customAuthenticationEntryPoint());

        // 인증 후 접근 제한 - 403 예외처리
        http.exceptionHandling().accessDeniedHandler(customAccessDeniedHandler());

        // csrf 비활성화
        http.csrf().disable();
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userAccountService).passwordEncoder(passwordEncoder());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationSuccessHandler customAuthenticationSuccessHandler() {
        return new CustomAuthenticationSuccessHandler();
    }

    @Bean
    public AuthenticationFailureHandler customAuthenticationFailureHandler() {
        return new CustomAuthenticationFailureHandler();
    }

    @Bean
    public CustomAuthenticationEntryPoint customAuthenticationEntryPoint() {
        return new CustomAuthenticationEntryPoint();
    }

    @Bean
    public CustomAccessDeniedHandler customAccessDeniedHandler() {
        return new CustomAccessDeniedHandler();
    }

}
