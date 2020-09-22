package co.kesti.smartcity.component;

import java.lang.reflect.Type;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import co.kesti.smartcity.common.vo.ResultVo;
import lombok.extern.slf4j.Slf4j;

/**
 * API REST 템플릿
 * @author atom
 * @since 2020.08.11
 */
@Slf4j
@Component
public class ApiRestTemplate {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${api.url}")
    private String apiUrl;

    /**
     * POST
     */
    public <T> ResultVo<T> post(String reqUrl, MultiValueMap<String, Object> paramMap, Class<T> dataType) {
        // header 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // 엔티티
        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<MultiValueMap<String, Object>>(paramMap, headers);

        // http 호출
        String jsonVal = restTemplate.postForObject(apiUrl + reqUrl, entity, String.class);

        // 결과값
        Gson gson = new Gson();
        Type resType = new TypeToken<ResultVo<T>>() {}.getType();
        ResultVo<T> resVo = gson.fromJson(jsonVal, resType);

        log.debug(">>> resVo : {}", ToStringBuilder.reflectionToString(resVo, ToStringStyle.MULTI_LINE_STYLE).toString());

        return resVo;
    }

}
