package com.laioffer.deliverymanagement.service;

import com.laioffer.deliverymanagement.dto.OtpChallengeDto;
import com.laioffer.deliverymanagement.service.support.DtoRowMappers;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OtpChallengeService {

    private static final String SELECT_SQL = """
            SELECT id, user_id, channel, code_hash, expires_at, consumed,
                   attempt_count, created_at
            FROM otp_challenge
            """;

    private final JdbcClient jdbcClient;

    public OtpChallengeService(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public List<OtpChallengeDto> findAll() {
        return jdbcClient.sql(SELECT_SQL + " ORDER BY created_at, id")
                .query(DtoRowMappers::mapOtpChallenge)
                .list();
    }

    public List<OtpChallengeDto> findByUserId(UUID userId) {
        return jdbcClient.sql(SELECT_SQL + " WHERE user_id = :userId ORDER BY created_at, id")
                .param("userId", userId)
                .query(DtoRowMappers::mapOtpChallenge)
                .list();
    }

    public Optional<OtpChallengeDto> findById(UUID id) {
        return jdbcClient.sql(SELECT_SQL + " WHERE id = :id")
                .param("id", id)
                .query(DtoRowMappers::mapOtpChallenge)
                .optional();
    }

    public Optional<OtpChallengeDto> findLatestByUserId(UUID userId) {
        return jdbcClient.sql(SELECT_SQL + " WHERE user_id = :userId ORDER BY created_at DESC, id DESC LIMIT 1")
                .param("userId", userId)
                .query(DtoRowMappers::mapOtpChallenge)
                .optional();
    }

    public Optional<OtpChallengeDto> findLatestActiveByUserId(UUID userId) {
        return jdbcClient.sql(SELECT_SQL + """
                         WHERE user_id = :userId
                           AND consumed = FALSE
                           AND expires_at > CURRENT_TIMESTAMP
                         ORDER BY created_at DESC, id DESC
                         LIMIT 1
                        """)
                .param("userId", userId)
                .query(DtoRowMappers::mapOtpChallenge)
                .optional();
    }

    @Transactional
    public OtpChallengeDto createChallenge(UUID userId, String channel, String codeHash, OffsetDateTime expiresAt) {
        return jdbcClient.sql("""
                        INSERT INTO otp_challenge (user_id, channel, code_hash, expires_at)
                        VALUES (:userId, :channel, :codeHash, :expiresAt)
                        RETURNING id, user_id, channel, code_hash, expires_at, consumed,
                                  attempt_count, created_at
                        """)
                .param("userId", userId)
                .param("channel", channel)
                .param("codeHash", codeHash)
                .param("expiresAt", expiresAt)
                .query(DtoRowMappers::mapOtpChallenge)
                .single();
    }

    @Transactional
    public Optional<OtpChallengeDto> incrementAttemptCount(UUID id) {
        return jdbcClient.sql("""
                        UPDATE otp_challenge
                        SET attempt_count = attempt_count + 1
                        WHERE id = :id
                        RETURNING id, user_id, channel, code_hash, expires_at, consumed,
                                  attempt_count, created_at
                        """)
                .param("id", id)
                .query(DtoRowMappers::mapOtpChallenge)
                .optional();
    }

    @Transactional
    public boolean markConsumed(UUID id) {
        return jdbcClient.sql("""
                        UPDATE otp_challenge
                        SET consumed = TRUE
                        WHERE id = :id AND consumed = FALSE
                        """)
                .param("id", id)
                .update() > 0;
    }

    public long count() {
        return requiredCount("SELECT COUNT(*) FROM otp_challenge");
    }

    private long requiredCount(String sql) {
        Long count = jdbcClient.sql(sql).query(Long.class).single();
        return count == null ? 0L : count;
    }
}
