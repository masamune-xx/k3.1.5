package com.xpl.k315.dao;

import com.xpl.k315.models.User;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class UserDAOImpl implements UserDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public User getUserById(int id) {
        return entityManager.find(User.class, id);
    }

    @Override
    public User getUserByEmail(String email) {
        return entityManager
                .createQuery("from User u left join fetch u.roles where u.email = :email", User.class)
                .setParameter("email", email)
                .getSingleResult();
    }

    @Override
    public List<User> getUserList() {
        return entityManager
                .createQuery("from User", User.class)
                .getResultList();
    }

    @Override
    public void saveUser(User user) {
        entityManager.merge(user);
    }

    @Override
    public void deleteUser(int id) {
        entityManager.createQuery("delete from User u where u.id = :id")
                .setParameter("id", id)
                .executeUpdate();
    }
}
