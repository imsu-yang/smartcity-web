package co.kesti.smartcity.error;


import lombok.Builder;

public class ApplicationException extends RuntimeException {

    private ResponseCode responseCode;

    public ApplicationException(ResponseCode code) {
        super(code.getMessage());
        this.responseCode = code;
    }

    @Builder
    public ApplicationException(ResponseCode code, Throwable cause) {
        super(code.getMessage(), cause);
        this.responseCode = code;
    }

    public ResponseCode getResponseCode() {
        return responseCode;
    }

}
