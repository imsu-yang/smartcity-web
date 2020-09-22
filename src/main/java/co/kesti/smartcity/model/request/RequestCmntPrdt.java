package co.kesti.smartcity.model.request;


import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestCmntPrdt {

	private Integer prdtSeq;
	private String prdtType; // 측정기 종류
	private String prdtName; // 제품이름
	private String obsItem; // 측정항목
	private String prdtContents; // 제품내용

	private String prdtImgPath; // 사진경로
	private String attachedFilePath; // 첨부파일
	private String cretrId;
	private String amdrId;

	@Builder.Default
	private String delYn = "N";// 삭제 여부


}
	