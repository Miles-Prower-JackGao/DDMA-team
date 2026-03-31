package com.laioffer.deliverymanagement.service;

import com.laioffer.deliverymanagement.dto.FleetVehicleDto;
import com.laioffer.deliverymanagement.service.support.DtoRowMappers;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FleetVehicleService {

    private static final String SELECT_SQL = """
            SELECT id, center_id, vehicle_type, available,
                   external_device_id, telemetry_hint, metadata
            FROM fleet_vehicle
            """;

    private final JdbcClient jdbcClient;

    public FleetVehicleService(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public List<FleetVehicleDto> findAll() {
        return jdbcClient.sql(SELECT_SQL + " ORDER BY center_id, id")
                .query(DtoRowMappers::mapFleetVehicle)
                .list();
    }

    public List<FleetVehicleDto> findByCenterId(UUID centerId) {
        return jdbcClient.sql(SELECT_SQL + " WHERE center_id = :centerId ORDER BY id")
                .param("centerId", centerId)
                .query(DtoRowMappers::mapFleetVehicle)
                .list();
    }

    public Optional<FleetVehicleDto> findById(UUID id) {
        return jdbcClient.sql(SELECT_SQL + " WHERE id = :id")
                .param("id", id)
                .query(DtoRowMappers::mapFleetVehicle)
                .optional();
    }

    public long count() {
        return requiredCount("SELECT COUNT(*) FROM fleet_vehicle");
    }

    private long requiredCount(String sql) {
        Long count = jdbcClient.sql(sql).query(Long.class).single();
        return count == null ? 0L : count;
    }
}
