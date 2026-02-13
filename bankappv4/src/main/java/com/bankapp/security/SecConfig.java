package com.bankapp.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.AllArgsConstructor;
import org.springframework.security.config.Customizer;

@Configuration
@EnableWebSecurity(debug = true) // Spring sec aop
@EnableMethodSecurity(prePostEnabled = true)
@AllArgsConstructor
public class SecConfig {
	private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationEntryPoint authenticationEntryPoint;
    private final AccessDeniedHandler accessDeniedHandler;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults())

            .authorizeHttpRequests(auth -> auth
            	    .requestMatchers("/authenticate").permitAll()

            	    .requestMatchers("/api/v2/accounts/**")
            	        .hasAnyAuthority("ROLE_CLERK", "ROLE_MANAGER")

            	    .requestMatchers("/api/v2/transactions/**")
            	        .hasAnyAuthority("ROLE_CLERK", "ROLE_MANAGER")

            	    .requestMatchers("/api/v2/users/**")
            	        .hasAuthority("ROLE_MANAGER")

            	    .anyRequest().authenticated()
            	)


            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(authenticationEntryPoint)
                .accessDeniedHandler(accessDeniedHandler)
            )

            .sessionManagement(sm ->
                sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .addFilterBefore(jwtAuthFilter,
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}
