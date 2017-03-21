package com.github.jntakpe.mockpi.domain

import org.hibernate.validator.constraints.NotBlank
import org.springframework.web.bind.annotation.RequestMethod

data class Request(@NotBlank val path: String,
                   @NotBlank val method: RequestMethod,
                   val params: Map<String, String> = emptyMap(),
                   val headers: Map<String, String> = emptyMap())