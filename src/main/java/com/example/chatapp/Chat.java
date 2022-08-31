package com.example.chatapp;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "chat")
public class Chat {

    @Id
    private String id;
    private String message;
    private String sender; // 보내는 사람 (귓속말)
    private String receiver; // 받는 사람 (귓속말)
    private Integer roomNum; //방 번호 (채팅)


    private LocalDateTime createdAt;
}
