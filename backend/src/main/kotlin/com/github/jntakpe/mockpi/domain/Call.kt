package com.github.jntakpe.mockpi.domain

import java.time.Duration
import java.time.Instant

data class Call(val timestamp: Instant, val duration: Duration)