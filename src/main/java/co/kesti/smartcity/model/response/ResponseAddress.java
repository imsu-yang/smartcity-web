package co.kesti.smartcity.model.response;

import lombok.*;
import org.apache.commons.lang3.StringUtils;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ResponseAddress {

    private String zipcode;
    private String type;
    private String text;
    private Structure structure;

    public String getAddress() {
        return StringUtils.join(structure.getLevel1(), structure.getLevel2(), structure.getLevel3(), "");
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    public static class Structure {
        private String level1;
        private String level2;
        private String level3;
    }
}
