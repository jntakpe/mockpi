package com.github.jntakpe.mockpi.web.dto

import org.hibernate.validator.constraints.NotBlank

data class IdName(@NotBlank val name: String, val id: String? = null)