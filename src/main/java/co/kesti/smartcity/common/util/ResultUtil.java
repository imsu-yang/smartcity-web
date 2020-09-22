package co.kesti.smartcity.common.util;

import org.springframework.http.HttpStatus;

import co.kesti.smartcity.common.vo.ResultVo;

/**
 * 결과 유틸
 * @author atom
 * @since 2020.07.20
 */
public class ResultUtil {

    /**
     * 성공
     */
    public static ResultVo<String> success() {
        return new ResultVo<String>();
    }

    public static ResultVo<String> success(String data) {
        ResultVo<String> resultVo = new ResultVo<String>();
        resultVo.setData(data);

        return resultVo;
    }

    public static <T> ResultVo<T> success(T data) {
        ResultVo<T> resultVo = new ResultVo<T>();
        resultVo.setData(data);

        return resultVo;
    }

    /**
     * 실패
     */
    public static ResultVo<String> fail(String message) {
        return new ResultVo<String>(false, HttpStatus.INTERNAL_SERVER_ERROR.value(), message);
    }

    public static ResultVo<String> fail(int code, String message) {
        return new ResultVo<String>(false, code, message);
    }

    public static <T> ResultVo<T> fail(int code, String message, T data) {
        ResultVo<T> resultVo = new ResultVo<T>(false, code, message);
        resultVo.setData(data);

        return resultVo;
    }

}
