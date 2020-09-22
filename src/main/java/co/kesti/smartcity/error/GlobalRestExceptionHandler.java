package co.kesti.smartcity.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import co.kesti.smartcity.common.define.Define;
import co.kesti.smartcity.common.util.ResultUtil;
import co.kesti.smartcity.common.vo.ResultVo;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalRestExceptionHandler {

    @ResponseBody
    @ResponseStatus(value= HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(value = Exception.class)
    public ResultVo<?> errorHandler(Exception e) {
        log.error("{}", e.getMessage(), e);
        return ResultUtil.fail(ResponseCode.INTERNAL_SERVER_ERROR.getHttpStatus().value(), e.getMessage());
    }

    @ResponseBody
    @ResponseStatus(value= HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(value = ApplicationException.class)
    public ResultVo<?> applicationExceptionHandler(ApplicationException e) {
        log.error("{}", e.getMessage(), e);
        return ResultUtil.fail(e.getResponseCode().getHttpStatus().value(), e.getResponseCode().getMessage());
    }

    @ResponseBody
    @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(value = UserException.class)
    public ResultVo<?> userExceptionHandler(UserException e) {
        log.error("{}", e.getMessage(), e);
        return ResultUtil.fail(Define.INT_999, e.getMessage());
    }

}
