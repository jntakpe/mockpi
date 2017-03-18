package com.github.jntakpe.mockpi.web

import com.github.jntakpe.mockpi.exceptions.ConflictKeyException
import com.github.jntakpe.mockpi.exceptions.IdNotFoundException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class WebAdvising {

    @ExceptionHandler(IdNotFoundException::class)
    fun handleNotFound(exception: IdNotFoundException) = ResponseEntity(exception.message, HttpStatus.NOT_FOUND)

    @ExceptionHandler(ConflictKeyException::class)
    fun handleConflict(exception: ConflictKeyException) = ResponseEntity(exception.message, HttpStatus.CONFLICT)

}