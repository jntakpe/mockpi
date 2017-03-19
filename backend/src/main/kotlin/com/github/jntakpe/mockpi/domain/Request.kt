package com.github.jntakpe.mockpi.domain

import org.hibernate.validator.constraints.NotBlank

data class Request(@NotBlank val path: String, val params: Map<String, String> = emptyMap(), val headers: Map<String, String> = emptyMap())