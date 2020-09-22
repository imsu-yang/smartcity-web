package co.kesti.smartcity.model.request;


import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.collect.Lists;
import lombok.*;

import javax.validation.constraints.NotBlank;
import java.util.List;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestDevInfo {


	@NotBlank
	private String devId;

	private String devName;

	private String devPassword;

	private String manufacturerId;

	private String manufacturerName;

	private String protocolType;

	private String protocolRule;

	private String devImgPath;

	private String userDefName;

	private Float latitVal;

	private Float lngitVal;

	private String prdtType;

	private String connStatus;

	private String liveStatus;

	private String gatewayConnId;

	private Integer mbrSeq;

	private String cretrId;

	private String amdrId;

	private String addedCompareDevices;

}
	