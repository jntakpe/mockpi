package com.github.jntakpe.mockpi.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties("api")
class ApiProperties {

    var fakeContextRoot: String = "/mockpi"

}