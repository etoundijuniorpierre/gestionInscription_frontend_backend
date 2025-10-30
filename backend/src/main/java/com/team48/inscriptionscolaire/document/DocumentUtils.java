package com.team48.inscriptionscolaire.document;

import java.io.ByteArrayOutputStream;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

public class DocumentUtils {


    public static byte[] compressImage(byte[] data) {
        if (data == null || data.length == 0) {
            return new byte[0];
        }

        Deflater deflater = new Deflater();
        deflater.setLevel(Deflater.BEST_COMPRESSION);
        deflater.setInput(data);
        deflater.finish();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] tmp = new byte[4 * 1024];
        try {
            while (!deflater.finished()) {
                int size = deflater.deflate(tmp);
                outputStream.write(tmp, 0, size);
            }
        } finally {
            try {
                outputStream.close();
                deflater.end();
            } catch (Exception ignored) {
            }
        }
        return outputStream.toByteArray();
    }


    public static byte[] decompressImage(byte[] data) {
        if (data == null || data.length == 0) {
            return new byte[0];
        }

        Inflater inflater = new Inflater();
        inflater.setInput(data);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] tmp = new byte[4 * 1024];
        try {
            while (!inflater.finished()) {
                int count = inflater.inflate(tmp);
                outputStream.write(tmp, 0, count);
            }
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to decompress document data: " + e.getMessage(), e);
        } finally {
            try {
                outputStream.close();
                inflater.end();
            } catch (Exception ignored) {
            }
        }
    }

}