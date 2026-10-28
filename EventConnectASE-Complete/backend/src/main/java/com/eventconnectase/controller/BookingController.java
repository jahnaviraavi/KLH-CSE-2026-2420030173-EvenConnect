
package com.eventconnectase.controller;

import com.eventconnectase.model.Booking;
import com.eventconnectase.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> book(
            @RequestBody Map<String, Object> data) {
        try {
            Long userId = Long.valueOf(
                    data.get("userId").toString());

            Long eventId = Long.valueOf(
                    data.get("eventId").toString());

            int tickets = Integer.parseInt(
                    data.get("tickets").toString());

            return ResponseEntity.ok(
                    service.book(userId, eventId, tickets));

        } catch (IllegalArgumentException | NullPointerException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error",
                    "Invalid input: provide valid userId, eventId and tickets"));
        }
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getByUser(
            @PathVariable Long userId) {
        return service.getByUser(userId);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(
            @PathVariable Long id) {
        try {
            return ResponseEntity.ok(
                    service.cancel(id));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage()));
        }
    }
}
