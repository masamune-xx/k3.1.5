package com.xpl.k315.services;

import com.xpl.k315.dao.RoleDAO;
import com.xpl.k315.models.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
@Transactional
public class RoleServiceImpl implements RoleService {

    private final RoleDAO roleDAO;

    @Override
    public Role getRoleById(int id) {
        return roleDAO.getRoleById(id);
    }

    @Override
    public Role getRoleByName(String name) {
        return roleDAO.getRoleByName(name);
    }

    @Override
    public List<Role> getRoleList() {
        return roleDAO.getRoleList();
    }

    @Override
    public void saveRole(Role role) {
        roleDAO.saveRole(role);
    }
}
