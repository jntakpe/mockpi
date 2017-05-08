package com.github.jntakpe.mockpi.web

import com.github.jntakpe.mockpi.config.Urls
import com.github.jntakpe.mockpi.service.ActivityService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(Urls.ACTIVITIES_API)
class ActivityResource(private val activityService: ActivityService) {

    @GetMapping
    fun findAll() = activityService.findAll()

}