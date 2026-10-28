
package com.eventconnectase.service;

import com.eventconnectase.model.Event;
import com.eventconnectase.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository repository;

    public EventService(EventRepository repository) {
        this.repository = repository;
    }

    public List<Event> getAll() {
        return repository.findAll();
    }

    public Event create(Event event) {
        return repository.save(event);
    }

    public Event update(Long id, Event event) {
        Event old = repository.findById(id)
                .orElseThrow(() ->
                    new IllegalArgumentException("Event not found"));

        old.setTitle(event.getTitle());
        old.setDescription(event.getDescription());
        old.setLocation(event.getLocation());
        old.setEventDate(event.getEventDate());
        old.setPrice(event.getPrice());
        old.setAvailableSeats(event.getAvailableSeats());

        return repository.save(old);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Event not found");
        }
        repository.deleteById(id);
    }
}
