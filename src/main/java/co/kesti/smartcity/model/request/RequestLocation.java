package co.kesti.smartcity.model.request;


import lombok.*;

import javax.validation.constraints.NotBlank;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestLocation {

	private Float latitude;

	private Float longitude;



}
	