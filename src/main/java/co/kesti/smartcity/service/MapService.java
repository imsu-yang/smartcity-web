package co.kesti.smartcity.service;


import co.kesti.smartcity.model.request.RequestLocation;
import co.kesti.smartcity.model.response.ResponseAddress;
import co.kesti.smartcity.util.JsonUtils;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class MapService {

    @Value("${vworld.key}")
    private String vworldKey;

    @Autowired
    private HttpClientTemplate httpClientTemplate;

    public ResponseAddress getAddress(RequestLocation request) {

        String url = String.format("http://api.vworld.kr/req/address?service=address&version=2.0&request=getaddress&key=%s&format=json&point=%s,%s&crs=epsg:4326&type=road&zipcode=true&simple=false", vworldKey, request.getLongitude(), request.getLatitude());
        JsonNode response = httpClientTemplate.get(url, JsonNode.class);

        log.info("URL: {}", url);
        JsonNode resultJsonNode = response.get("response").get("result");
        if (resultJsonNode.size() > 0) {
            JsonNode result = resultJsonNode.get(0);
            ResponseAddress responseAddress = JsonUtils.fromJsonNode(result, ResponseAddress.class);
            log.info("{}", JsonUtils.toPrettyString(responseAddress));

            return responseAddress;
        } else {
            return ResponseAddress.builder().build();
        }

    }
}
