package com.bankapp.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bankapp.entities.User;
import com.bankapp.enums.Role;

public interface UserRepository extends JpaRepository<User, String>{
	Optional<User> findByUsername(String username);
    List<User> findByRole(Role role);
    boolean existsByUsername(String username);
}
