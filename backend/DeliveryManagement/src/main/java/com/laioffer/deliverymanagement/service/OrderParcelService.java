package com.laioffer.deliverymanagement.service;

import com.laioffer.deliverymanagement.dto.OrderParcelDto;
import com.laioffer.deliverymanagement.service.support.DtoRowMappers;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderParcelService {

    private static final String SELECT_SQL = """
            SELECT id, order_id, size_tier, weight_kg, fragile,
                   delivery_notes, dimensions, metadata
            FROM order_parcel
            """;

    private final JdbcClient jdbcClient;

    public OrderParcelService(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public List<OrderParcelDto> findAll() {
        return jdbcClient.sql(SELECT_SQL + " ORDER BY order_id, id")
                .query(DtoRowMappers::mapOrderParcel)
                .list();
    }

    public Optional<OrderParcelDto> findByOrderId(UUID orderId) {
        return jdbcClient.sql(SELECT_SQL + " WHERE order_id = :orderId")
                .param("orderId", orderId)
                .query(DtoRowMappers::mapOrderParcel)
                .optional();
    }

    public Optional<OrderParcelDto> findById(UUID id) {
        return jdbcClient.sql(SELECT_SQL + " WHERE id = :id")
                .param("id", id)
                .query(DtoRowMappers::mapOrderParcel)
                .optional();
    }

    public long count() {
        return requiredCount("SELECT COUNT(*) FROM order_parcel");
    }

    private long requiredCount(String sql) {
        Long count = jdbcClient.sql(sql).query(Long.class).single();
        return count == null ? 0L : count;
    }
}
