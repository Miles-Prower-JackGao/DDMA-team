package com.laioffer.deliverymanagement.service;

import com.laioffer.deliverymanagement.dto.PaymentDto;
import com.laioffer.deliverymanagement.service.support.DtoRowMappers;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    private static final String SELECT_SQL = """
            SELECT id, order_id, stripe_payment_intent_id, status,
                   amount, currency, idempotency_key, updated_at, provider_payload
            FROM payment
            """;

    private final JdbcClient jdbcClient;

    public PaymentService(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public List<PaymentDto> findAll() {
        return jdbcClient.sql(SELECT_SQL + " ORDER BY updated_at, id")
                .query(DtoRowMappers::mapPayment)
                .list();
    }

    public Optional<PaymentDto> findByOrderId(UUID orderId) {
        return jdbcClient.sql(SELECT_SQL + " WHERE order_id = :orderId")
                .param("orderId", orderId)
                .query(DtoRowMappers::mapPayment)
                .optional();
    }

    public Optional<PaymentDto> findById(UUID id) {
        return jdbcClient.sql(SELECT_SQL + " WHERE id = :id")
                .param("id", id)
                .query(DtoRowMappers::mapPayment)
                .optional();
    }

    public long count() {
        return requiredCount("SELECT COUNT(*) FROM payment");
    }

    private long requiredCount(String sql) {
        Long count = jdbcClient.sql(sql).query(Long.class).single();
        return count == null ? 0L : count;
    }
}
