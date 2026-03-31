package com.laioffer.deliverymanagement.service;

import com.laioffer.deliverymanagement.dto.DeliveryCenterDto;
import com.laioffer.deliverymanagement.service.support.DtoRowMappers;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DeliveryCenterService {

    private static final String SELECT_SQL = """
            SELECT id, name, latitude, longitude, address_line,
                   service_area_geo, metadata
            FROM delivery_center
            """;

    private final JdbcClient jdbcClient;

    public DeliveryCenterService(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public List<DeliveryCenterDto> findAll() {
        return jdbcClient.sql(SELECT_SQL + " ORDER BY name, id")
                .query(DtoRowMappers::mapDeliveryCenter)
                .list();
    }

    public Optional<DeliveryCenterDto> findById(UUID id) {
        return jdbcClient.sql(SELECT_SQL + " WHERE id = :id")
                .param("id", id)
                .query(DtoRowMappers::mapDeliveryCenter)
                .optional();
    }

    public long count() {
        return requiredCount("SELECT COUNT(*) FROM delivery_center");
    }

    private long requiredCount(String sql) {
        Long count = jdbcClient.sql(sql).query(Long.class).single();
        return count == null ? 0L : count;
    }
}
