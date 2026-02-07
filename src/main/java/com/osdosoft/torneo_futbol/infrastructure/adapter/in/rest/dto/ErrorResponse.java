package com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto;

import java.util.List;

public record ErrorResponse(
        String message,
        List<String> details) {
}
