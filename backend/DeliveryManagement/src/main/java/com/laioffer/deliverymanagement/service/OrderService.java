package com.laioffer.deliverymanagement.service;

import com.laioffer.deliverymanagement.dto.OrderDto;
import com.laioffer.deliverymanagement.service.support.DtoRowMappers;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {

    private static final String SELECT_SQL = """
            SELECT id, user_id, center_id, fleet_vehicle_id, status,
                   vehicle_type_chosen, pickup_summary, dropoff_summary,
                   handoff_pin, estimated_minutes, total_amount, currency,
                   sim_latitude, sim_longitude, sim_heading_deg, sim_updated_at,
                   plan_snapshot, tracking_state, created_at, updated_at,
                   version, metadata
            FROM orders
            """;

    private final JdbcClient jdbcClient;

    public OrderService(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public List<OrderDto> findAll() {
        return jdbcClient.sql(SELECT_SQL + " ORDER BY created_at, id")
                .query(DtoRowMappers::mapOrder)
                .list();
    }

    public List<OrderDto> findByUserId(UUID userId) {
        return jdbcClient.sql(SELECT_SQL + " WHERE user_id = :userId ORDER BY created_at, id")
                .param("userId", userId)
                .query(DtoRowMappers::mapOrder)
                .list();
    }

    public Optional<OrderDto> findById(UUID id) {
        return jdbcClient.sql(SELECT_SQL + " WHERE id = :id")
                .param("id", id)
                .query(DtoRowMappers::mapOrder)
                .optional();
    }

    public long count() {
        return requiredCount("SELECT COUNT(*) FROM orders");
    }

    private long requiredCount(String sql) {
        Long count = jdbcClient.sql(sql).query(Long.class).single();
        return count == null ? 0L : count;
    }
}
