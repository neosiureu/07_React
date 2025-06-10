package com.example.demo.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.model.dto.Todo;

@Mapper
public interface TodoMapper {

	List<Todo> selectTodoList();

	int insertTodoList(Todo todo);

	int deleteTodoList(int todoNo);

	int updateTodoComplete(Todo todo);

	int updateTodoTitle(Todo todo);

	int updateTodoDetail(Todo todo);

}
