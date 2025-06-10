package com.example.demo.todo.controller;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.Todo;
import com.example.demo.model.service.TodoService;

import lombok.extern.slf4j.Slf4j;

 
@Slf4j
@RestController  // restful하게 가보자
@RequestMapping("/todo")
public class TodoController {

    @Autowired
    private TodoService todoService; 

    @GetMapping("")
    public List<Todo> getTodoList() {
        return todoService.selectTodoList();
    }
    
    @PostMapping("")
    public int insertTodo(@RequestBody Todo todo) {
    	log.info("받은 값: {}", todo);
        return todoService.insertTodo(todo); 
    }
    
    @DeleteMapping("/{todoNo}")
    public int deleteTodoList(@PathVariable("todoNo") int todoNo) {
    	log.info("받은 값: {}", todoNo);
        return todoService.deleteTodoList(todoNo); 
    }
    
    @PutMapping("/{todoNo}")
    public int updateTodoComplete(@PathVariable("todoNo") int todoNo, @RequestBody Todo todo) {
    	log.info("받은 값: {}", todoNo);
    	 todo.setTodoNo(todoNo);
        return todoService.updateTodoComplete(todo); 
    	
    }
    
    @PutMapping("/title/{todoNo}")
    public int updateTodoTitle(@PathVariable("todoNo") int todoNo, @RequestBody Todo todo) {
    	log.info("받은 값: {}", todoNo);
    	todo.setTodoNo(todoNo);
        int tmp =todoService.updateTodoTitle(todo); 
        log.info("컨트롤러에서 최종적으로 돌려주는 값: {}", tmp);
        return tmp;
    }
    
    @PutMapping("/content/{todoNo}")
    public int updateTodoContent(@PathVariable("todoNo") int todoNo, @RequestBody Todo todo) {
    	log.info("받은 값: {}", todoNo);
    	todo.setTodoNo(todoNo);
        int tmp =todoService.updateTodoDetail(todo); 
        log.info("컨트롤러에서 최종적으로 돌려주는 값: {}", tmp);
        return tmp;
    }
}