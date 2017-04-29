package com.github.jntakpe.mockpi.web.dto

import org.hibernate.validator.constraints.NotBlank

data class IdNameFields(@NotBlank val name: String, val id: String? = null)