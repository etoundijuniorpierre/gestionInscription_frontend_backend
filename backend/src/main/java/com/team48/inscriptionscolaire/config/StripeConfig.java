package com.team48.inscriptionscolaire.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

@Configuration
public class StripeConfig {
    @Value("${stripe.secret.key:}")
    private String stripeSecretKey;

    @PostConstruct
    public void init(){
        if (StringUtils.hasText(stripeSecretKey)) {
            Stripe.apiKey = stripeSecretKey;
        }
    }
}