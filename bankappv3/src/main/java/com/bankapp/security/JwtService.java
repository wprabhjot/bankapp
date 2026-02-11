package com.bankapp.security;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtService {
    public static final String
            SECRET = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437";		
    
	//Extract username, JWT subject = username Convention, not rule , we need to follow the standard
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

	//eads exp claim Used for expiry check
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

	//Parses token once, Lets caller decide what to extract
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

	/*
	This line does three big things:
	1️. Verifies signature (token not tampered)
	2️. Verifies structure (valid JWT)
	3️. Extracts claims (payload)
	*/
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
	//true → token dead and false → token alive
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

	/*
	Checks only two things:
	1️. Username in token == username from DB
	2️. Token is not expired
	If both true → accept request
	*/

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

//    public String generateToken(String userName) {
//        Map<String, Object> claims = new HashMap<>();
//        return createToken(claims, userName);
//    }

    private String createToken(Map<String, Object> claims, String userName) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userName)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 30))
                .signWith(getSignKey(), SignatureAlgorithm.HS256).compact();
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles",
            userDetails.getAuthorities()
                       .stream()
                       .map(a -> a.getAuthority())
                       .toList()
        );
        return createToken(claims, userDetails.getUsername());
    }
    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
