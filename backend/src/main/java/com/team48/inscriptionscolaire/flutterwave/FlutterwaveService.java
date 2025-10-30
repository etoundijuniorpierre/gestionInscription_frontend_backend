package com.team48.inscriptionscolaire.flutterwave;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FlutterwaveService {

    @Value("${flutterwave.secret.key}")
    private String secretKey;

    @Value("${flutterwave.api.url}")
    private String apiUrl;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String createPaymentLink(String email, Double amount, String redirectUrl) throws IOException {
        return createPaymentLink(email, amount, redirectUrl, "enr-" + UUID.randomUUID().toString());
    }

    public String createPaymentLink(String email, Double amount, String redirectUrl, String txRef) throws IOException {
        String endpoint = apiUrl + "/payments";
        URL url = new URL(endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "Bearer " + secretKey);
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        // Create payload using ObjectNode
        ObjectNode payloadNode = objectMapper.createObjectNode();
        payloadNode.put("tx_ref", txRef);
        payloadNode.put("amount", String.valueOf(amount));
        payloadNode.put("currency", "XAF");
        payloadNode.put("redirect_url", redirectUrl);
        payloadNode.put("payment_options", "card, mobilemoney");

        // Create customer object
        ObjectNode customerNode = objectMapper.createObjectNode();
        customerNode.put("email", email);
        payloadNode.set("customer", customerNode);

        // Create customizations object
        ObjectNode customizationsNode = objectMapper.createObjectNode();
        customizationsNode.put("title", "Paiement inscription");
        customizationsNode.put("description", "Frais d'inscription");
        payloadNode.set("customizations", customizationsNode);

        String payload = objectMapper.writeValueAsString(payloadNode);

        try (OutputStream os = conn.getOutputStream()) {
            os.write(payload.getBytes(StandardCharsets.UTF_8));
        }

        int status = conn.getResponseCode();
        InputStream is = (status >= 200 && status < 300) ? conn.getInputStream() : conn.getErrorStream();
        String response = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))
                .lines().reduce("", (a, b) -> a + b);
        JsonNode root = objectMapper.readTree(response);

        if (status >= 200 && status < 300) {
            // The data.link field contains the checkout URL
            JsonNode data = root.path("data");
            String link = data.path("link").asText(null);
            return link;
        } else {
            String message = root.path("message").asText(response);
            throw new IOException("Flutterwave create payment failed: HTTP " + status + " - " + message);
        }
    }

    public JsonNode verifyTransactionById(String transactionId) throws IOException {
        String endpoint = apiUrl + "/transactions/" + transactionId + "/verify";
        URL url = new URL(endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Authorization", "Bearer " + secretKey);

        int status = conn.getResponseCode();
        InputStream is = (status >= 200 && status < 300) ? conn.getInputStream() : conn.getErrorStream();
        String response = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))
                .lines().reduce("", (a, b) -> a + b);
        JsonNode root = objectMapper.readTree(response);

        if (status >= 200 && status < 300) {
            return root;
        } else {
            throw new IOException("Flutterwave verify failed: HTTP " + status + " - " + root.toString());
        }
    }
}