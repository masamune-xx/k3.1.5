package com.xpl.k315.controllers;

import com.xpl.k315.models.User;
import com.xpl.k315.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class RestApiController {

    private final UserService userService;

    @GetMapping({"/", ""})
    public ResponseEntity<List<User>> userList() {
        return new ResponseEntity<>(userService.getUserList(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> userGet(@PathVariable("id") int id) {
        return new ResponseEntity<>(userService.getUserById(id), HttpStatus.OK);
    }

    @GetMapping("/current")
    public ResponseEntity<User> userCurrent(Principal principal) {
        return new ResponseEntity<>(userService.getUserByEmail(principal.getName()), HttpStatus.OK);
    }

    @PostMapping({"/", ""})
    public ResponseEntity<User> userAdd(@RequestBody User user) {
        userService.saveUser(user);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping({"/", ""})
    public ResponseEntity<User> userEdit(@RequestBody User user) {
        userService.saveUser(user);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> userDelete(@PathVariable("id") int id) {
        userService.deleteUser(id);
        return new ResponseEntity<>("User with ID: " + id + " deleted." , HttpStatus.OK);
    }
}