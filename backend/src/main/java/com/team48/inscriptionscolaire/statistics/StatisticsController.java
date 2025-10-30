package com.team48.inscriptionscolaire.statistics;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAllStatistics() {
        Map<String, Object> statistics = statisticsService.getAllStatistics();
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/{type}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getStatisticsByType(@PathVariable String type) {
        Map<String, Object> statistics = statisticsService.getStatisticsByType(type);
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/candidatures")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getCandidatureStatistics() {
        Map<String, Object> statistics = statisticsService.getCandidatureStatistics();
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/inscriptions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getInscriptionStatistics() {
        Map<String, Object> statistics = statisticsService.getInscriptionStatistics();
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/temps-reel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getTempsReelStatistics() {
        Map<String, Object> statistics = statisticsService.getTempsReelStatistics();
        return ResponseEntity.ok(statistics);
    }

    // Legacy endpoint pour compatibilité
    @GetMapping("/legacy")
    public ResponseEntity<StatisticsDto> getLegacyStatistics() {
        return ResponseEntity.ok(statisticsService.getStatistics());
    }
}