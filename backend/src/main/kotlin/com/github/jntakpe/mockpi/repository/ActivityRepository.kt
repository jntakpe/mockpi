package com.github.jntakpe.mockpi.repository

import com.github.jntakpe.mockpi.domain.Activity
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.ReactiveMongoRepository

interface ActivityRepository : ReactiveMongoRepository<Activity, ObjectId>