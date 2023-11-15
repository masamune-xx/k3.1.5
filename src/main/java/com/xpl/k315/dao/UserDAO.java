package com.xpl.k315.dao;

import com.xpl.k315.models.User;

import java.util.List;

public interface UserDAO {
    User getUserById(int id);
    User getUserByEmail(String email);
    List<User> getUserList();
    void saveUser(User user);
    void deleteUser(int id);
}
