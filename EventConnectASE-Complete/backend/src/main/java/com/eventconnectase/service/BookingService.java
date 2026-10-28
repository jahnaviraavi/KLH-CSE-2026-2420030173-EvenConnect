
package com.eventconnectase.service;

import com.eventconnectase.model.Booking;
import com.eventconnectase.model.Event;
import com.eventconnectase.repository.BookingRepository;
import com.eventconnectase.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;

    public BookingService(BookingRepository bookingRepository,
                          EventRepository eventRepository) {
        this.bookingRepository = bookingRepository;
        this.eventRepository = eventRepository;
    }

    @Transactional
    public Booking book(Long userId, Long eventId, int tickets) {
        if (tickets <= 0) {
            throw new IllegalArgumentException(
                    "Tickets must be at least 1");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Event not found"));

        if (event.getAvailableSeats() < tickets) {
            throw new IllegalArgumentException(
                    "Not enough seats available");
        }

        event.setAvailableSeats(
                event.getAvailableSeats() - tickets);
        eventRepository.save(event);

        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setEventId(eventId);
        booking.setTickets(tickets);
        booking.setTotalPrice(event.getPrice() * tickets);
        booking.setStatus("CONFIRMED");

        return bookingRepository.save(booking);
    }

    public List<Booking> getByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Transactional
    public Booking cancel(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Booking not found"));

        if ("CANCELLED".equals(booking.getStatus())) {
            throw new IllegalArgumentException(
                    "Booking is already cancelled");
        }

        Event event = eventRepository.findById(booking.getEventId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Event not found"));

        event.setAvailableSeats(
                event.getAvailableSeats() + booking.getTickets());
        eventRepository.save(event);

        booking.setStatus("CANCELLED");
        return bookingRepository.save(booking);
    }
}
