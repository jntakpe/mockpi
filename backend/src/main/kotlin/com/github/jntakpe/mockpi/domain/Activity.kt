package com.github.jntakpe.mockpi.domain

import org.bson.types.ObjectId
import org.springframework.data.mongodb.core.mapping.Document

@Document
data class Activity(val id: ObjectId, val mock: Mock, val calls: MutableList<Call>)