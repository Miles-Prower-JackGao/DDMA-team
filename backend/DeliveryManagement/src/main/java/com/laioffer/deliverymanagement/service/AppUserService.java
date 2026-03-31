package com.laioffer.deliverymanagement.service;

import com.laioffer.deliverymanagement.dto.AppUserDto;
import com.laioffer.deliverymanagement.service.support.DtoRowMappers;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public Optional<AppUserDto> findByEmail(String email) {
        return jdbcClient.sql(SELECT_SQL + " WHERE email = :email")
                .param("email", email)
                .query(DtoRowMappers::mapAppUser)
                .optional();
    }

    public Optional<AppUserDto> findByPhone(String phone) {
        return jdbcClient.sql(SELECT_SQL + " WHERE phone = :phone")
                .param("phone", phone)
                .query(DtoRowMappers::mapAppUser)
                .optional();
    }

    public Optional<AppUserDto> findByEmailOrPhone(String identifier) {
        return jdbcClient.sql(SELECT_SQL + " WHERE email = :identifier OR phone = :identifier ORDER BY created_at, id LIMIT 1")
                .param("identifier", identifier)
                .query(DtoRowMappers::mapAppUser)
                .optional();
    }

    @Transactional
    public AppUserDto createUser(
            String email,
            String phone,
            String passwordHash,
            String fullName,
            boolean guest,
            String metadata
    ) {
        return jdbcClient.sql("""
                        INSERT INTO app_user (email, phone, password_hash, full_name, guest, metadata)
                        VALUES (:email, :phone, :passwordHash, :fullName, :guest, CAST(:metadata AS jsonb))
                        RETURNING id, email, phone, password_hash, full_name, guest,
                                  created_at, updated_at, version, metadata
                        """)
                .param("email", email)
                .param("phone", phone)
                .param("passwordHash", passwordHash)
                .param("fullName", fullName)
                .param("guest", guest)
                .param("metadata", metadata)
                .query(DtoRowMappers::mapAppUser)
                .single();
    }

    @Transactional
    public Optional<AppUserDto> activateUser(UUID id) {
        return jdbcClient.sql("""
                        UPDATE app_user
                        SET guest = FALSE,
                            updated_at = CURRENT_TIMESTAMP,
                            version = version + 1
                        WHERE id = :id
                        RETURNING id, email, phone, password_hash, full_name, guest,
                                  created_at, updated_at, version, metadata
                        """)
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
