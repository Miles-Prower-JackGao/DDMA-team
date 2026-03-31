package com.laioffer.deliverymanagement.service;

import com.laioffer.deliverymanagement.dto.AppUserDto;
import com.laioffer.deliverymanagement.service.support.DtoRowMappers;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AppUserService {

    private static final String SELECT_SQL = """
            SELECT id, email, phone, password_hash, full_name, guest,
                   created_at, updated_at, version, metadata
            FROM app_user
            """;

    private final JdbcClient jdbcClient;

    public AppUserService(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public List<AppUserDto> findAll() {
        return jdbcClient.sql(SELECT_SQL + " ORDER BY created_at, id")
                .query(DtoRowMappers::mapAppUser)
                .list();
    }

    public Optional<AppUserDto> findById(UUID id) {
        return jdbcClient.sql(SELECT_SQL + " WHERE id = :id")
                .param("id", id)
                .query(DtoRowMappers::mapAppUser)
                .optional();
    }

    public long count() {
        return requiredCount("SELECT COUNT(*) FROM app_user");
    }

    private long requiredCount(String sql) {
        Long count = jdbcClient.sql(sql).query(Long.class).single();
        return count == null ? 0L : count;
    }
}
