package com.hust.baseweb.applications.programmingcontest.cache;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class RedisCacheService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    public RedisCacheService(
        RedisTemplate<String, Object> redisTemplate,
        ObjectMapper objectMapper
    ) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    public <T> T getCachedObject(String hashId, String key, Class<T> clazz) {
        try {
            Object value = getCachedObject(hashId, key);
            if (value != null) {
                log.debug("hit cache for hashId " + hashId);
                return objectMapper.readValue((String) value, clazz);
            }
        } catch (Exception e) {
            log.error("Cannot get query cache #{}{}", hashId, key, e);
        }
        return null;
    }

    public <T> List<T> getListCachedObject(String hashId, List<String> keys) {
        try {
            Object value = getListCachedObjectRedis(hashId, keys);
            if (value != null) {
                log.debug("hit cache for hashId " + hashId);
                return objectMapper.readValue((String) value, new TypeReference<List<T>>() {
                });
            }
        } catch (Exception e) {
            log.error("Cannot get query list cache #{}", hashId, e);
        }
        return null;
    }

    private Object getCachedObject(String hashId, String key) {
        return redisTemplate.opsForHash().get(hashId, key);
    }

    private Object getListCachedObjectRedis(String hashId, List<String> keys) {
        return redisTemplate.opsForHash().multiGet(hashId, Collections.singleton(keys));
    }

    public void pushCachedWithExpire(String hashId, String key, Object result, int expireTime) {
        try {
            String value = objectMapper.writeValueAsString(result);
            redisTemplate.opsForHash().put(hashId, key, value);
            redisTemplate.expire(hashId, expireTime, TimeUnit.MILLISECONDS);
        } catch (Exception e) {
            log.error("Cannot write query cache #{}", hashId, e);
        }
    }

    public void pushListCachedWithExpire(String hashId, Map<String, ?> cacheObjectList, int expireTime) {

        try {
            Map<String, String> cacheObjectListKeyValue = new HashMap<>();

            cacheObjectList.forEach((key, result) -> {
                try {
                    String value = objectMapper.writeValueAsString(result);
                    cacheObjectListKeyValue.put(key, value);
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            });

            redisTemplate.opsForHash().putAll(hashId, cacheObjectListKeyValue);
            redisTemplate.expire(hashId, expireTime, TimeUnit.MILLISECONDS);
        } catch (Exception e) {
            log.error("Cannot write query list cache #{}", hashId, e);
        }
    }

    @Async("asyncRedis")
    public CompletableFuture<Boolean> invalidCached(String hashId) {
        log.debug("invalid cache {}", hashId);
        return CompletableFuture.completedFuture(redisTemplate.delete(hashId));
    }
}
