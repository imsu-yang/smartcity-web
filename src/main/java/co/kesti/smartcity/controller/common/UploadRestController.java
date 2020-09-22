package co.kesti.smartcity.controller.common;

import co.kesti.smartcity.service.UploadManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/upload")
public class UploadRestController {


    @Value("${upload.dir}")
    private String uploadDir;

    private final UploadManager uploadManager;

    @ResponseBody
    @GetMapping(value = "/**", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_GIF_VALUE})
    public ResponseEntity<Resource> handleResource(HttpServletRequest request, HttpServletResponse response) throws Exception {
        String pathAndName = uploadManager.getCurrentPath() + request.getRequestURI();

        if (uploadManager.existFile(pathAndName)) {

            String ext = StringUtils.substringAfterLast(pathAndName, ".");

            if (pathAndName.contains("/image/")) {
                File file = uploadManager.loadFile(pathAndName);
                try {

                    byte[] outByte = IOUtils.toByteArray(new FileInputStream(file));
                    // 이미지 유형
                    if ("png".equalsIgnoreCase(ext)) {
                        response.setContentType(MediaType.IMAGE_PNG_VALUE);
                    } else if ("gif".equalsIgnoreCase(ext)) {
                        response.setContentType(MediaType.IMAGE_GIF_VALUE);
                    } else {
                        response.setContentType(MediaType.IMAGE_JPEG_VALUE);
                    }

                    // 이미지 출력
                    OutputStream out = response.getOutputStream();
                    out.write(outByte);
                    out.close();

                } catch (Exception e) {
                    log.info("fail to load fil: {}", pathAndName);
                }

            } else { // 첨부파일 타입 구현중
                Path path = Paths.get(pathAndName);
                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment");

                Resource resource = new InputStreamResource(Files.newInputStream(path));
                return new ResponseEntity<>(resource, headers, HttpStatus.OK);
            }


        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
