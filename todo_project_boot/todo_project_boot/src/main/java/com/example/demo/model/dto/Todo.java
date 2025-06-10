package com.example.demo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Todo {
    private int todoNo;
    private String todoTitle;
    private String todoDetail;
    private String  todoComplete;
    private String regDate; 
}
