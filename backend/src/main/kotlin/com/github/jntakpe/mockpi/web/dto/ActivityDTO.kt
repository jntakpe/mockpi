package com.github.jntakpe.mockpi.web.dto

import com.github.jntakpe.mockpi.domain.Call
import org.springframework.http.HttpMethod

data class ActivityDTO(
        val name: String,
        val path: String,
        val method: HttpMethod,
        val params: Map<String, String>,
        val calls: MutableList<Call>
)