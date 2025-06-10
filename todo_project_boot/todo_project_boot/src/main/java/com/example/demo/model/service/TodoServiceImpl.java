package com.example.demo.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.dto.Todo;
import com.example.demo.model.mapper.TodoMapper;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
public class TodoServiceImpl implements TodoService {
	
	@Autowired
	private TodoMapper mapper;

	
	@Override
	public List<Todo> selectTodoList() {
		
		return mapper.selectTodoList();
	}



	@Override
	public int insertTodo(Todo todo) {
		log.info("",todo); 
		return mapper.insertTodoList(todo);
	}



	@Override
	public int deleteTodoList(int todoNo) {

		log.info("삭제할거: {}", todoNo);
		
		return mapper.deleteTodoList(todoNo);
	}



	@Override
	public int updateTodoComplete(Todo todo) {
		
		
		return mapper.updateTodoComplete(todo);
	}



	@Override
	public int updateTodoTitle(Todo todo) {
    	log.info("받은 값: {}", todo);
		return mapper.updateTodoTitle(todo);
	}



	@Override
	public int updateTodoDetail(Todo todo) {
		// TODO Auto-generated method stub
		return mapper.updateTodoDetail(todo);
	}



	

}
