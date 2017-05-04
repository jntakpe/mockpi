package com.github.jntakpe.mockpi.config

import org.springframework.context.annotation.Configuration
import org.springframework.core.env.Environment

@Configuration
class ProfileConfig(val env: Environment) {

    fun isActive(profile: Profiles) = env.acceptsProfiles(profile.name.toLowerCase())

}