package co.kesti.smartcity.common.vo;

/**
 * 결과 VO
 */
public class ResultVo<T> {

    // 상태
    private boolean status;

    // 코드
    private int code;

    // 메세지
    private String message;

    // 데이터
    private T data;

    public ResultVo() {
        this.status = true;
    }

    public ResultVo(boolean status) {
        this.status = status;
    }

    public ResultVo(boolean status, String message) {
        this.status = status;
        this.message = message;
    }

    public ResultVo(boolean status, int code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
    }

    public boolean isStatus() {
        return this.status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public int getCode() {
        return this.code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return this.data;
    }

    public void setData(T data) {
        this.data = data;
    }

}
