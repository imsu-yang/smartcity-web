package co.kesti.smartcity.service;

import co.kesti.smartcity.error.ApplicationException;
import co.kesti.smartcity.error.ResponseCode;
import com.google.common.collect.Lists;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Component
public class UploadManager {

    @Value("${upload.dir}")
    private String uploadDir;

    public String uploadFile(MultipartFile file, String path) {
        String fileName = makeUniqueFileName(file.getOriginalFilename());
        // 실제 DB에 저장될 경로와 파일명
        String uploadPathAndName = StringUtils.join(uploadDir, path, fileName);
        if (makeDirectoryIfNotExist(getCurrentPath() + uploadPathAndName)) {
            try {

                FileOutputStream fos = new FileOutputStream(getCurrentPath() + uploadPathAndName);
                fos.write(file.getBytes());
                fos.close();

            } catch (Exception e){
                log.error("fail to save file: {}", fileName, e);
                throw ApplicationException.builder().code(ResponseCode.FAIL_TO_UPLOAD_FILE).build();
            }
            log.info("saved file: {}", uploadPathAndName);
            return uploadPathAndName;
        }

        return null;
    }

    private String makeUniqueFileName(String fileName) {
//        return String.format("%s.%s", UUID.randomUUID().toString().replaceAll("-", ""), StringUtils.substringAfterLast(fileName, "."));
        return String.format("%s-%s.%s",
                StringUtils.substringBeforeLast(fileName, "."),
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")),
                StringUtils.substringAfterLast(fileName, "."));
    }

    public File loadFile(String pathAndName) {
        return new File(pathAndName);
    }

    public boolean isImageType(String extension) {
        return Lists.newArrayList("jpeg", "jpg", "png", "gif").stream().anyMatch(ext -> ext.equals(extension.toLowerCase()));
    }

    public String getCurrentPath() {
        return System.getProperty("user.dir");
    }

    public boolean makeDirectoryIfNotExist(String pathAndFileName) {
        String path = StringUtils.substringBeforeLast(pathAndFileName, "/");
        File file = new File(path);
        if (!Files.exists(file.toPath())) {
            return file.mkdirs();
        } else {
            return true;
        }
    }

    public boolean existFile(String fileName) {
        return new File(fileName).isFile();
    }
}
