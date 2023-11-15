package com.xpl.k315.services;

import com.xpl.k315.models.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {
    User getUserById(int id);
    User getUserByEmail(String email);
    List<User> getUserList();
    void saveUser(User user);
    void saveUserWithRoles(User user, List<Integer> roleIds);
    void deleteUser(int id);
}
