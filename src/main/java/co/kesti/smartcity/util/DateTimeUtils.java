package co.kesti.smartcity.util;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.Calendar;
import java.util.Date;

public final class DateTimeUtils {
    public static final ZoneId DEFAULT_ZONE_ID = ZoneId.of("Asia/Seoul");// ZoneId.spec("UTC");
    public static DateTimeFormatter DEFAULT_DATE_TIME_FORMAT = new DateTimeFormatterBuilder().appendPattern("yyyy-MM-dd HH:mm:ss").toFormatter();
    public static DateTimeFormatter DEFAULT_DATE_FORMAT = new DateTimeFormatterBuilder().appendPattern("yyyy-MM-dd").toFormatter();
    private DateTimeUtils() {
        throw new UnsupportedOperationException();
    }


    public static LocalDateTime fromTimestamp(long timestamp) {
        return LocalDateTime.ofInstant(Instant.ofEpochMilli(timestamp), DEFAULT_ZONE_ID);
    }

    public static LocalDateTime toLocalDateTime(Calendar calendar) {
        return LocalDateTime.ofInstant(calendar.toInstant(), DEFAULT_ZONE_ID);
    }

    public static String getToday() {
        return ZonedDateTime.now(DEFAULT_ZONE_ID).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
    }

    public static String localDatetoString(LocalDate localDate, DateTimeFormatter formatter) {
        return localDate.format(formatter);
    }

    public static LocalDateTime now() {
        return LocalDateTime.ofInstant(Instant.ofEpochMilli(System.currentTimeMillis()), DEFAULT_ZONE_ID);
    }

    public static long toTimestamp(LocalDateTime localDateTime) {
        return localDateTime.atZone(DEFAULT_ZONE_ID).toInstant().toEpochMilli();
    }

    public static LocalDateTime fromDate(Date date) {
        return LocalDateTime.ofInstant(date.toInstant(), DEFAULT_ZONE_ID);
    }

    public static Date toDate(LocalDateTime localDateTime) {
        return Date.from(Instant.from(localDateTime.atZone(DEFAULT_ZONE_ID)));
    }

    public static long toTimestamp(LocalDate localDate) {
        return LocalDateTime.from(localDate).atZone(DEFAULT_ZONE_ID).toInstant().toEpochMilli();
    }

    public static Date fromLocalDateTime(LocalDateTime localDateTime) {
        return Date.from(localDateTime.atZone(DEFAULT_ZONE_ID).toInstant());
    }

    public static String formatDateTime(LocalDateTime createdAt, DateTimeFormatter formatter) {
        return createdAt.format(formatter);
    }
    // 2011-12-03T10:15:30Z
    public static LocalDateTime fromISOInstant(String str) {
        return stringToLocalDateTime(str, DateTimeFormatter.ISO_INSTANT);
    }

    public static String toISOInstant(LocalDateTime localDateTime) {
        return localDateTimeToString(localDateTime, DateTimeFormatter.ISO_INSTANT);
    }

    // 2011-12-03T10:15:30
    public static LocalDateTime fromISOLocalDateTime(String str) {
        return stringToLocalDateTime(str, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    public static String toISOLocalDateTime(LocalDateTime localDateTime) {
        return localDateTimeToString(localDateTime, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    // yyyy-MM-dd HH:mm:ss
    public static LocalDateTime fromLocalDateSpaceLocalTime(String str) {
        return stringToLocalDateTime(str, DEFAULT_DATE_TIME_FORMAT);
    }


    public static LocalDateTime fromStr(String str, DateTimeFormatter formatter) {
        return stringToLocalDateTime(str, formatter);
    }

    public static String localDateTimeToString(LocalDateTime localDateTime) {
        return localDateTimeToString(localDateTime, DEFAULT_DATE_TIME_FORMAT);
    }


    private static LocalDateTime stringToLocalDateTime(String str, DateTimeFormatter formatter) {
        return LocalDateTime.parse(str, formatter.withZone(DEFAULT_ZONE_ID));
    }

    private static String localDateTimeToString(LocalDateTime localDateTime, DateTimeFormatter formatter) {
        return localDateTime.format(formatter);
    }

    public static LocalDateTime convertFormat(LocalDateTime datetime, DateTimeFormatter formatter) {
        String str = datetime.format(formatter);
        return LocalDateTime.parse(str, formatter);
    }

}