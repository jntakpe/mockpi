package com.github.jntakpe.mockpi.web.dto

import com.github.jntakpe.mockpi.domain.Request

data class IdRequest(val request: Request, val id: String? = null)