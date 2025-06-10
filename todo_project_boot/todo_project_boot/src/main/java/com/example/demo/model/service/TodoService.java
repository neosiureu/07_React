package com.example.demo.model.service;

import java.util.List;

import com.example.demo.model.dto.Todo;

public interface TodoService {

	List<Todo> selectTodoList();

	int insertTodo(Todo todo);

	int deleteTodoList(int todoNo);


	int updateTodoComplete(Todo todo);

	int updateTodoTitle(Todo todo);

	int updateTodoDetail(Todo todo);

}
