package com.xpl.k315.init;

import com.xpl.k315.models.Role;
import com.xpl.k315.models.User;
import com.xpl.k315.services.RoleService;
import com.xpl.k315.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Set;

@RequiredArgsConstructor
@Component
public class DBInit {

    private final UserService userService;

    private final RoleService roleService;

    @PostConstruct
    public void init() {

        Role adminRole = new Role();
        adminRole.setName("ADMIN");
        roleService.saveRole(adminRole);

        Role userRole = new Role();
        userRole.setName("USER");
        roleService.saveRole(userRole);

        User admin = new User();
        admin.setFirstName("admin");
        admin.setLastName("admin");
        admin.setAge(40);
        admin.setEmail("admin@admin.com");
        admin.setPassword("admin");
        admin.setRoles(Set.of(adminRole, userRole));
        userService.saveUser(admin);

        User user = new User();
        user.setFirstName("user");
        user.setLastName("user");
        user.setAge(28);
        user.setEmail("user@user.com");
        user.setPassword("user");
        user.setRoles(Set.of(userRole));
        userService.saveUser(user);
    }
}
