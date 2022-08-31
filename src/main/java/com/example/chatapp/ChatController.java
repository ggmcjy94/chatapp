package com.example.chatapp;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;

@RestController // 데이터 리턴 서버
@RequiredArgsConstructor
public class ChatController {

    private final ChatRepository chatRepository;


    //귓 속 말 같은 거 할 떄 사용
    @CrossOrigin // 자바 스크립트 요청
    @GetMapping(value = "/sender/{sender}/receiver/{receiver}", produces = MediaType.TEXT_EVENT_STREAM_VALUE) // response 선이 안끊기고 계속 유지
    public Flux<Chat> getMsg(@PathVariable("sender") String sender, @PathVariable("receiver") String receiver) {
        return chatRepository.mFindBySender(sender,receiver)
                .subscribeOn(Schedulers.boundedElastic());
    }

    @CrossOrigin // 자바 스크립트 요청
    @GetMapping(value = "/chat/roomNum/{roomNum}", produces = MediaType.TEXT_EVENT_STREAM_VALUE) // response 선이 안끊기고 계속 유지
    public Flux<Chat> findByRoomNum(@PathVariable("roomNum") Integer roomNum) {
        return chatRepository.mFindByRoomNum(roomNum)
                .subscribeOn(Schedulers.boundedElastic());
    }

    @CrossOrigin
    @PostMapping("/chat")
    public Mono<Chat> setMsg(@RequestBody Chat chat) {
        chat.setCreatedAt(LocalDateTime.now());
        return chatRepository.save(chat);
    }

}
