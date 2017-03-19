package com.github.jntakpe.mockpi.repository

import com.github.jntakpe.mockpi.domain.Mock
import org.springframework.data.mongodb.repository.ReactiveMongoRepository

interface MockRepository : ReactiveMongoRepository<Mock, String>