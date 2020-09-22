package co.kesti.smartcity.error;

/**
 * 사용자 예외처리
 */
public class UserException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private ResponseCode responseCode;

    public UserException(String msg) {
        super(msg);
        this.responseCode = ResponseCode.INTERNAL_SERVER_ERROR;
    }

    public UserException(String msg, ResponseCode code) {
        super(msg);
        this.responseCode = code;
    }

    public ResponseCode getResponseCode() {
        return responseCode;
    }

}
