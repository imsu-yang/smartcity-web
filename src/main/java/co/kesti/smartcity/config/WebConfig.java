package co.kesti.smartcity.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import co.kesti.smartcity.security.MemberPageInterceptor;
import egovframework.rte.fdl.cmmn.trace.LeaveaTrace;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(0);
    }

    @Bean
    public LeaveaTrace leaveaTrace() {
        return new LeaveaTrace();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 회원 페이지 인터셉터
        registry.addInterceptor(new MemberPageInterceptor()).addPathPatterns("/member/**");
    }

}

