package co.kesti.smartcity.util;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.fasterxml.jackson.databind.type.TypeFactory;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class JsonUtils {

    private static String EmptyString = "";
    private static ObjectMapper mapper;

    private static XmlMapper xmlMapper;

    static {
        mapper = new ObjectMapper();
        xmlMapper = new XmlMapper();

        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL); // value가 null 일경우 제거
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);


        JavaTimeModule javaTimeModule = new JavaTimeModule();
        javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(DateTimeUtils.DEFAULT_DATE_TIME_FORMAT));
        javaTimeModule.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(DateTimeUtils.DEFAULT_DATE_TIME_FORMAT));

        javaTimeModule.addSerializer(LocalDate.class, new LocalDateSerializer(DateTimeUtils.DEFAULT_DATE_TIME_FORMAT));
        javaTimeModule.addDeserializer(LocalDate.class, new LocalDateDeserializer(DateTimeUtils.DEFAULT_DATE_TIME_FORMAT));
        mapper.registerModule(javaTimeModule);

    }


    public static JsonNode toJsonNode(Object value) {
        return mapper.valueToTree(value);
    }

    public static String toString(Object data) {
        try {
            return mapper.writeValueAsString(data);
        } catch (JsonProcessingException e) {
            throw new JsonEncodeException(e);
        }
    }


    public static String toPrettyString(Object data) {
        try {
            return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(data);
        } catch (JsonProcessingException e) {
            throw new JsonEncodeException(e);
        }
    }

    public static String toXML(Object data) {
        try {
            return xmlMapper.writeValueAsString(data);
        } catch (IOException e) {
            throw new JsonEncodeException(e);
        }
    }


    public static <T> T fromJson(String json, TypeReference<T> type) {
        try {
            return mapper.readValue(json, type);
        } catch (IOException e) {
            throw new JsonDecodeException(e);
        }
    }


    public static <T> T fromJsonNode(JsonNode jsonNode, TypeReference<T> type) {
        String json = toString(jsonNode);
        return fromJson(json, type);
    }


    public static <T> T fromJsonNode(JsonNode jsonNode, Class<T> clazz) {
        try {
            return mapper.treeToValue(jsonNode, clazz);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public static <T> List<T> fromJsonList(String json, Class<T> clazz) {
        CollectionType collectionType = TypeFactory.defaultInstance().constructCollectionType(List.class, clazz);
        try {
            return mapper.readValue(json, collectionType);
        } catch (IOException e) {
            throw new JsonDecodeException(e);
        }
    }

    public static <T> T fromJson(String json, Class<T> clazz) {
        try {
            return mapper.readValue(json, clazz);
        } catch (IOException e) {
            throw new JsonDecodeException(e);
        }
    }

    public static Map<String, String> convertMap(Object obj) {
        try {
            return convert(obj, new TypeReference<Map<String, String>>() {});
        } catch (Exception e) {
            throw new JsonEncodeException(e);
        }
    }

    public static <T> T convert(Object obj, TypeReference<T> type ) {
        return mapper.convertValue(obj, type);
    }


    public static void prettyPrint(Object data) {
        try {
            System.out.println(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(data));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    public static class JsonDecodeException extends RuntimeException {

        public JsonDecodeException(Throwable cause) {
            super(cause);
        }
    }

    public static class JsonEncodeException extends RuntimeException {

        public JsonEncodeException(Throwable cause) {
            super(cause);
        }
    }

}
