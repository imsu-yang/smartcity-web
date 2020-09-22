package co.kesti.smartcity;

import co.kesti.smartcity.model.request.RequestLocation;
import co.kesti.smartcity.model.response.ResponseAddress;
import co.kesti.smartcity.service.HttpClientTemplate;
import co.kesti.smartcity.service.MapService;
import co.kesti.smartcity.util.JsonUtils;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;


@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest
public class SmartcityWebApplicationTests {

    @Autowired
    private HttpClientTemplate httpClientTemplate;

    @Autowired
    private MapService mapService;

    @Test
    public void contextLoads() {

        JsonNode response = httpClientTemplate.get("http://api.vworld.kr/req/address?service=address&version=2.0&request=getaddress&key=483E0418-2F46-3223-80A1-F66D16A24685&format=json&point=126.978275264,37.566642192&crs=epsg:4326&type=road&zipcode=true&simple=false", JsonNode.class);

        JsonNode result = response.get("response").get("result").get(0);

//        log.info("{}", JsonUtils.toPrettyString(result));
        ResponseAddress responseAddress = JsonUtils.fromJsonNode(result, ResponseAddress.class);

//        log.info("{}", JsonUtils.toPrettyString(responseAddress));


        ResponseAddress aa = mapService.getAddress(RequestLocation.builder().longitude(126.978275264F).latitude(37.566642192F).build());

        log.info("{}", JsonUtils.toPrettyString(aa));

    }

}
