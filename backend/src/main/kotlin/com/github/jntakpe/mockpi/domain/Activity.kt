package com.github.jntakpe.mockpi.domain

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document
data class Activity(@Id @JsonSerialize(using = ToStringSerializer::class) val id: ObjectId, val mock: Mock, val calls: MutableList<Call>)