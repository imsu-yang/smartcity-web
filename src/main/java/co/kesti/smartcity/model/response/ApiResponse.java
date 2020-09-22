package co.kesti.smartcity.model.response;

import co.kesti.smartcity.error.ResponseCode;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponse<T> {

    private boolean status;
    private int code;
    private T data;
    private Object param;
    private String message;

    public static <T> ApiResponse ok(T data) {
        return ApiResponse.builder().status(true).code(ResponseCode.OK.getHttpStatus().value()).data(data).build();
    }

    public static <T> ApiResponse ok(T data, Object param) {
        return ApiResponse.builder().status(true).code(ResponseCode.OK.getHttpStatus().value()).data(data).param(param).build();
    }

    public static ApiResponse ok() {
        return ApiResponse.builder().status(true).code(ResponseCode.OK.getHttpStatus().value()).build();
    }

    public static ApiResponse ok(String message) {
        return ApiResponse.builder().status(true).code(ResponseCode.OK.getHttpStatus().value()).message(message).build();
    }

    public static ApiResponse error(int code, String msg) {
        return ApiResponse.builder().status(false).code(code).message(msg).build();
    }

}
