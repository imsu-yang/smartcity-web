package co.kesti.smartcity.service;

import co.kesti.smartcity.util.JsonUtils;
import co.kesti.smartcity.error.ApplicationException;
import co.kesti.smartcity.error.ResponseCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@Slf4j
@Component
public class HttpClientTemplate {

    private RestTemplate restTemplate;

    public HttpClientTemplate(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }


    public <T> T get(String url, Class<T> clazz) {
        return exchange(url, HttpMethod.GET,  new HttpEntity<String>(new HttpHeaders()), clazz);
    }

    public <T> T get(String url, HttpHeaders headers, Class<T> clazz) {
        URI uri = UriComponentsBuilder.fromUriString(url).build().encode().toUri();
        return exchange(url, HttpMethod.GET,  new HttpEntity<String>(headers), clazz);
    }

    public <T> T post(String url, Object body, Class<T> clazz) {
        return exchange(url, HttpMethod.POST,  new HttpEntity<Object>(body), clazz);
    }

    public <T> T post(String url, HttpHeaders headers, Object body, Class<T> clazz) {
        return exchange(url, HttpMethod.POST,  new HttpEntity<Object>(body, headers), clazz);
    }


    public <T> T put(String url, Object body, Class<T> clazz) {
        return exchange(url, HttpMethod.PUT,  new HttpEntity<Object>(body), clazz);
    }

    public <T> T put(String url, HttpHeaders headers, Object body, Class<T> clazz) {
        return exchange(url, HttpMethod.PUT,  new HttpEntity<Object>(body, headers), clazz);
    }


    public <T> T delete(String url, Object body, Class<T> clazz) {
        return exchange(url, HttpMethod.DELETE,  new HttpEntity<Object>(body), clazz);
    }

    public <T> T delete(String url, HttpHeaders headers, Object body, Class<T> clazz) {
        return exchange(url, HttpMethod.DELETE,  new HttpEntity<Object>(body, headers), clazz);
    }


    private URI toURI(String url) {
        return UriComponentsBuilder.fromUriString(url).build().encode().toUri();
    }


    public <T> T exchange(String url, HttpMethod method, HttpEntity reqEntity, Class<T> resType) {
        try {

            log.info("[Request] url: {} ({}), {}", url, method.name(), JsonUtils.toPrettyString(reqEntity.getBody()));
            ResponseEntity<T> response = restTemplate.exchange(url, method, reqEntity, resType);
            T body = response.getBody();
            log.info("[Response] {}", JsonUtils.toString(body));
            return body;
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw ApplicationException.builder().code(ResponseCode.INTERNAL_SERVER_ERROR).build();
        }
    }

}
