package com.github.jntakpe.mockpi.repository

import com.github.jntakpe.mockpi.domain.User
import org.springframework.data.mongodb.repository.ReactiveMongoRepository

interface UserRepository : ReactiveMongoRepository<User, String>