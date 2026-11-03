

import { useEffect, useState } from "react";

import axios from "axios";

import { QRCodeSVG } from "qrcode.react";

import "./App.css";

const API = "http://localhost:8080";

const getEventTheme = (event) => {

  const text = `${event.title || ""} ${event.description || ""}`.toLowerCase();

  if (/music|concert|dj|fest|band/.test(text)) return "music";

  if (/ai|tech|robot|coding|hackathon|innovation/.test(text)) return "technology";

  if (/dance|art|paint|culture|fashion/.test(text)) return "creative";

  if (/sport|game|gaming|esport|cricket/.test(text)) return "gaming";

  if (/food|cook|cuisine|coffee/.test(text)) return "food";

  return "default";

};

const getEventIcon = (event) => {

  const icons = {

    music: "🎵",

    technology: "🚀",

    creative: "🎨",

    gaming: "🎮",

    food: "🍕",

    default: "✨",

  };

  return icons[getEventTheme(event)];

};

function App() {

  const [page, setPage] = useState("events");

  const [editingEventId, setEditingEventId] = useState(null);

const [eventForm, setEventForm] = useState({

  title: "",

  description: "",

  location: "",

  eventDate: "",

  price: "",

  availableSeats: ""

});

  const [events, setEvents] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [sortBy, setSortBy] = useState("date");

  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [name, setName] = useState("");

  const [message, setMessage] = useState("");

  const [tickets, setTickets] = useState({});

  const [bookings, setBookings] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const [paying, setPaying] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("card");

  const [cardName, setCardName] = useState("");

  const [cardNumber, setCardNumber] = useState("");

  const [expiry, setExpiry] = useState("");

  const [cvv, setCvv] = useState("");

  const [upiId, setUpiId] = useState("");

  const loadEvents = async () => {

    try {

      const res = await axios.get(`${API}/api/events`);

      setEvents(res.data);

    } catch {

      setMessage("Cannot connect to Spring Boot. Is STS running?");

    }

  };

  const resetEventForm = () => {
    setEditingEventId(null);
    setEventForm({
      title: "",
      description: "",
      location: "",
      eventDate: "",
      price: "",
      availableSeats: ""
    });
  };

  const saveEvent = async (e) => {
    e.preventDefault();
    if (user?.role !== "ADMIN") {
      setMessage("Admin access required.");
      return;
    }

    const payload = {
      ...eventForm,
      price: Number(eventForm.price),
      availableSeats: Number(eventForm.availableSeats)
    };

    try {
      if (editingEventId !== null) {
        await axios.put(`${API}/api/events/${editingEventId}`, payload);
        setMessage("Event updated successfully!");
      } else {
        await axios.post(`${API}/api/events`, payload);
        setMessage("Event created successfully!");
      }
      resetEventForm();
      await loadEvents();
    } catch (err) {
      setMessage(err.response?.data?.error || "Could not save the event.");
    }
  };

  const editEvent = (event) => {
    setEditingEventId(event.id);
    setEventForm({
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      eventDate: event.eventDate ? event.eventDate.slice(0, 16) : "",
      price: event.price ?? "",
      availableSeats: event.availableSeats ?? ""
    });
    setPage("admin");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteEvent = async (id) => {
    if (user?.role !== "ADMIN") {
      setMessage("Admin access required.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`${API}/api/events/${id}`);
      setMessage("Event deleted successfully!");
      await loadEvents();
    } catch (err) {
      setMessage(err.response?.data?.error || "Could not delete the event.");
    }
  };

  const filteredEvents = events

    .filter((event) => {

      const query = search.toLowerCase().trim();

      const title = (event.title || "").toLowerCase();

      const description = (event.description || "").toLowerCase();

      const location = (event.location || "").toLowerCase();

      const text = `${title} ${description}`;

      const matchesSearch =

        title.includes(query) ||

        description.includes(query) ||

        location.includes(query);

      const matchesCategory =

        category === "All" ||

        (category === "Music" && /music|concert|dj|fest|band|sing/.test(text)) ||

        (category === "Technology" && /tech|ai|coding|hackathon|robot|innovation/.test(text)) ||

        (category === "Gaming" && /gaming|game|esport|tournament|cricket|sport/.test(text)) ||

        (category === "Food" && /food|cook|cuisine|fiesta|coffee/.test(text)) ||

        (category === "Arts" && /art|dance|paint|culture|fashion/.test(text)) ||

        (category === "Comedy" && /comedy|comic|stand.up|funny/.test(text));

      return matchesSearch && matchesCategory;

    })

    .sort((a, b) => {

      if (sortBy === "price-low") return Number(a.price || 0) - Number(b.price || 0);

      if (sortBy === "price-high") return Number(b.price || 0) - Number(a.price || 0);

      return new Date(a.eventDate || 0) - new Date(b.eventDate || 0);

    });

  const loadBookings = async (userId) => {

    try {

      const res = await axios.get(

        `${API}/api/bookings/user/${userId}`

      );

      setBookings(res.data);

    } catch {

      setMessage("Could not load bookings.");

    }

  };

  useEffect(() => {

    loadEvents();

  }, []);

  const login = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(`${API}/api/auth/login`, {

        email,

        password

      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      setUser(res.data);

      setMessage(`Welcome back, ${res.data.name}!`);

      setPage("events");

      setPassword("");

    } catch (err) {

      setMessage(

        err.response?.data?.error || "Login failed."

      );

    }

  };

  const register = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(`${API}/api/users/register`, {

        name,

        email,

        password

      });

      setMessage(

        res.data.message || "Registration successful. Please log in."

      );

      setPage("login");

      setPassword("");

    } catch (err) {

      setMessage(

        err.response?.data?.error || "Registration failed."

      );

    }

  };

  // Open checkout instead of booking immediately.

  const book = (event) => {

    if (!user) {

      setMessage("Please log in before booking.");

      setPage("login");

      return;

    }

    const count = Number(tickets[event.id] || 1);

    if (

      !Number.isInteger(count) ||

      count < 1 ||

      count > event.availableSeats

    ) {

      setMessage("Please select a valid number of tickets.");

      return;

    }

    setSelectedEvent(event);

    setMessage("");

    setPage("checkout");

  };

  // This is a UI-only payment simulation for the college demo.

  // It does not charge a card or send payment details to the backend.

  const confirmPayment = async (e) => {

    e?.preventDefault();

    if (!user || !selectedEvent || paying) return;

    const count = Number(tickets[selectedEvent.id] || 1);

    if (!Number.isInteger(count) || count < 1 || count > selectedEvent.availableSeats) {

      setMessage("Please select a valid number of tickets.");

      return;

    }

    if (paymentMethod === "card") {

      const digits = cardNumber.replace(/\D/g, "");

      if (!cardName.trim() || digits.length < 12 || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry) || cvv.replace(/\D/g, "").length < 3) {

        setMessage("Enter valid card details to continue.");

        return;

      }

    } else if (!/^[^\s@]+@[^\s@]+$/.test(upiId.trim())) {

      setMessage("Enter a valid UPI ID, such as demo@upi.");

      return;

    }

    setPaying(true);

    setMessage("");

    try {

      // Demo-only: create the actual booking in Spring Boot after local form validation.

      const res = await axios.post(`${API}/api/bookings`, {

        userId: user.id,

        eventId: selectedEvent.id,

        tickets: count

      });

      setConfirmedBooking({

        ...res.data,

        eventTitle: selectedEvent.title,

        eventDate: selectedEvent.eventDate,

        location: selectedEvent.location,

        price: selectedEvent.price,

        tickets: res.data.tickets ?? count,

        totalPrice: res.data.totalPrice ?? Number(selectedEvent.price) * count,

        paymentMethod: paymentMethod === "card" ? "Card (simulated)" : "UPI (simulated)"

      });

      setCardName("");

      setCardNumber("");

      setExpiry("");

      setCvv("");

      setUpiId("");

      await loadEvents();

      await loadBookings(user.id);

      setPage("confirmation");

    } catch (err) {

      setMessage(

        err.response?.data?.error ||

        "Booking failed. Please check your event and try again."

      );

    } finally {

      setPaying(false);

    }

  };

  const cancelBooking = async (id) => {

    try {

      await axios.put(`${API}/api/bookings/${id}/cancel`);

      setMessage("Booking cancelled successfully.");

      await loadEvents();

      await loadBookings(user.id);

    } catch (err) {

      setMessage(

        err.response?.data?.error || "Cancellation failed."

      );

    }

  };

  const money = (amount) =>

    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  return (

    <div className="app">

      <header className="navbar">

        <h2>

          <span>✦</span> EventConnect

        </h2>

        <nav>

          <button onClick={() => { setPage("events"); loadEvents(); }}>

            Explore Events

          </button>

          {user?.role === "ADMIN" && (
            <button
              className="primary"
              onClick={() => {
                resetEventForm();
                setPage("admin");
                setMessage("");
                loadEvents();
              }}
            >
              Admin Dashboard
            </button>
          )}

          {user && (

            <button onClick={() => {

              loadBookings(user.id);

              setPage("bookings");

            }}>

              My Bookings

            </button>

          )}

          {!user ? (

            <>

              <button onClick={() => { setPage("login"); setMessage(""); }}>

                Login

              </button>

              <button className="primary" onClick={() => {

                setPage("register");

                setMessage("");

              }}>

                Sign Up

              </button>

            </>

          ) : (

            <>

              <span className="welcome-user">

                Hi, {user.name}

              </span>

              <button onClick={() => {

                delete axios.defaults.headers.common["Authorization"];

                setUser(null);

                setPage("events");

                setMessage("Logged out.");

                setCardName("");

                setCardNumber("");

                setExpiry("");

                setCvv("");

                setUpiId("");

              }}>

                Logout

              </button>

            </>

          )}

        </nav>

      </header>

      <main>

        {message && (

          <div className="message">

            {message}

            <button onClick={() => setMessage("")}>×</button>

          </div>

        )}

        {page === "admin" && (
          <section className="admin-shell">
            {user?.role !== "ADMIN" ? (
              <div className="auth-card">
                <h2>Access denied</h2>
                <p>This page is available to administrators only.</p>
                <button onClick={() => setPage("events")}>Back to events</button>
              </div>
            ) : (
              <>
                <aside className="admin-sidebar">
                  <div className="admin-sidebar-brand">
                    <span className="admin-brand-mark">✦</span>
                    <div><strong>EventConnect</strong><small>ADMIN WORKSPACE</small></div>
                  </div>
                  <p className="admin-nav-label">WORKSPACE</p>
                  <button className="admin-nav-item active" onClick={() => document.getElementById("admin-overview")?.scrollIntoView({ behavior: "smooth" })}>▦ <span>Overview</span></button>
                  <button className="admin-nav-item" onClick={() => document.getElementById("admin-event-form")?.scrollIntoView({ behavior: "smooth" })}>＋ <span>Create event</span></button>
                  <button className="admin-nav-item" onClick={() => document.getElementById("admin-event-list")?.scrollIntoView({ behavior: "smooth" })}>▤ <span>Manage events</span></button>
                  <div className="admin-sidebar-note">
                    <span className="admin-note-icon">✧</span>
                    <strong>Your events, in one place.</strong>
                    <p>Keep listings fresh and make every experience count.</p>
                  </div>
                  <button className="admin-back-link" onClick={() => setPage("events")}>← Back to Explore Events</button>
                </aside>

                <div className="admin-main-panel">
                  <div className="admin-topline">
                    <div>
                      <p className="eyebrow">EVENTCONNECT CONTROL CENTER</p>
                      <h1>Admin Overview</h1>
                      <p className="admin-subtitle">Here's what's happening with your event listings.</p>
                    </div>
                    <button className="admin-refresh-button" onClick={loadEvents}>↻ <span>Refresh data</span></button>
                  </div>

                  <div className="admin-stats" id="admin-overview">
                    <article className="admin-stat-card stat-total">
                      <div className="stat-card-top"><span className="stat-icon">▦</span><span className="stat-caption">ALL LISTINGS</span></div>
                      <span className="stat-label">Total Events</span>
                      <h2>{events.length}</h2>
                      <p>Events in your catalogue</p>
                    </article>
                    <article className="admin-stat-card stat-free">
                      <div className="stat-card-top"><span className="stat-icon">✧</span><span className="stat-caption">OPEN ACCESS</span></div>
                      <span className="stat-label">Free Events</span>
                      <h2>{events.filter(event => Number(event.price) === 0).length}</h2>
                      <p>No ticket cost</p>
                    </article>
                    <article className="admin-stat-card stat-paid">
                      <div className="stat-card-top"><span className="stat-icon">₹</span><span className="stat-caption">TICKETED</span></div>
                      <span className="stat-label">Paid Events</span>
                      <h2>{events.filter(event => Number(event.price) > 0).length}</h2>
                      <p>Events with ticket pricing</p>
                    </article>
                    <article className="admin-stat-card stat-upcoming">
                      <div className="stat-card-top"><span className="stat-icon">◷</span><span className="stat-caption">ON THE CALENDAR</span></div>
                      <span className="stat-label">Upcoming Events</span>
                      <h2>{events.filter(event => event.eventDate && new Date(event.eventDate) >= new Date()).length}</h2>
                      <p>Scheduled for the future</p>
                    </article>
                  </div>

                  <div className="admin-content-grid">
                    <section className="admin-panel-card admin-form-panel" id="admin-event-form">
                      <div className="admin-panel-heading">
                        <div><p className="eyebrow">EVENT MANAGEMENT</p><h2>{editingEventId !== null ? "Edit event" : "Create an event"}</h2><p>Add the details your attendees need.</p></div>
                        <span className="panel-heading-icon">＋</span>
                      </div>
                      {editingEventId !== null && <button className="admin-cancel-edit" type="button" onClick={resetEventForm}>Cancel editing</button>}
                      <form className="admin-event-form" onSubmit={saveEvent}>
                        <label>Event title<input required value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} placeholder="e.g. Tech Innovation Summit" /></label>
                        <label>Location<input required value={eventForm.location} onChange={e => setEventForm({ ...eventForm, location: e.target.value })} placeholder="Event venue" /></label>
                        <label className="admin-form-wide">Description<textarea required value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} placeholder="What makes this event special?" /></label>
                        <label>Date and time<input type="datetime-local" required value={eventForm.eventDate} onChange={e => setEventForm({ ...eventForm, eventDate: e.target.value })} /></label>
                        <label>Ticket price (₹)<input type="number" min="0" step="0.01" required value={eventForm.price} onChange={e => setEventForm({ ...eventForm, price: e.target.value })} placeholder="0" /></label>
                        <label>Available seats<input type="number" min="0" required value={eventForm.availableSeats} onChange={e => setEventForm({ ...eventForm, availableSeats: e.target.value })} placeholder="100" /></label>
                        <button className="primary full admin-form-wide admin-submit-button" type="submit">{editingEventId !== null ? "✓ Save event changes" : "+ Create event"}</button>
                      </form>
                    </section>

                    <section className="admin-panel-card admin-snapshot-panel">
                      <div className="admin-panel-heading"><div><p className="eyebrow">QUICK SNAPSHOT</p><h2>Event mix</h2><p>Overview of your current listings.</p></div><span className="panel-heading-icon">◔</span></div>
                      <div className="event-mix-row"><span className="event-mix-dot paid-dot"></span><span>Paid events</span><strong>{events.filter(event => Number(event.price) > 0).length}</strong></div>
                      <div className="event-mix-track"><span className="event-mix-fill paid-fill" style={{ width: `${events.length ? (events.filter(event => Number(event.price) > 0).length / events.length) * 100 : 0}%` }}></span></div>
                      <div className="event-mix-row"><span className="event-mix-dot free-dot"></span><span>Free events</span><strong>{events.filter(event => Number(event.price) === 0).length}</strong></div>
                      <div className="event-mix-track"><span className="event-mix-fill free-fill" style={{ width: `${events.length ? (events.filter(event => Number(event.price) === 0).length / events.length) * 100 : 0}%` }}></span></div>
                      <div className="admin-tip"><span>✦</span><div><strong>Admin tip</strong><p>Keep event dates, locations, and seat availability up to date so attendees know what to expect.</p></div></div>
                    </section>
                  </div>

                  <section className="admin-panel-card admin-list-panel" id="admin-event-list">
                    <div className="admin-panel-heading admin-list-heading">
                      <div><p className="eyebrow">YOUR LISTINGS</p><h2>Manage existing events</h2><p>Update details or remove an event from the catalogue.</p></div>
                      <span className="admin-list-count">{events.length} events</span>
                    </div>
                    <div className="admin-event-list">
                      {events.map(event => (
                        <article className="admin-event-row" key={event.id}>
                          <div className="admin-event-avatar">{getEventIcon(event)}</div>
                          <div className="admin-event-info"><h3>{event.title}</h3><p>📍 {event.location}</p><p>{money(event.price)} · {event.availableSeats} seats left</p><small>{event.eventDate?.replace("T", " ")}</small></div>
                          <span className={`admin-event-status ${Number(event.price) > 0 ? "status-paid" : "status-free"}`}>{Number(event.price) > 0 ? "PAID EVENT" : "FREE EVENT"}</span>
                          <div className="admin-event-actions"><button type="button" onClick={() => editEvent(event)}>Edit</button><button type="button" className="admin-delete-button" onClick={() => deleteEvent(event.id)}>Delete</button></div>
                        </article>
                      ))}
                      {events.length === 0 && <p className="empty">No events available yet. Create your first event above.</p>}
                    </div>
                  </section>
                </div>
              </>
            )}
          </section>
        )}

        {page === "events" && (

          <>

            <section className="hero">

              <p className="eyebrow">YOUR NEXT GREAT EXPERIENCE</p>

              <h1>

                Moments worth<br />

                <span>showing up for.</span>

              </h1>

              <p>

                Discover events, book your tickets, and make memories.

              </p>

              <button

                className="primary"

                onClick={() =>

                  document.getElementById("event-list")

                    ?.scrollIntoView({ behavior: "smooth" })

                }

              >

                Explore Events ↓

              </button>

            </section>

            <section id="event-list" className="events-section">

              <div className="event-filters">

                <input

                  type="search"

                  placeholder="Search events, places..."

                  value={search}

                  onChange={(e) => setSearch(e.target.value)}

                  aria-label="Search events"

                />

                <select

                  value={category}

                  onChange={(e) => setCategory(e.target.value)}

                  aria-label="Filter by category"

                >

                  <option value="All">All Events</option>

                  <option value="Music">Music</option>

                  <option value="Technology">Technology</option>

                  <option value="Gaming">Gaming & Sports</option>

                  <option value="Food">Food</option>

                  <option value="Arts">Arts & Culture</option>

                  <option value="Comedy">Comedy</option>

                </select>

                <select

                  value={sortBy}

                  onChange={(e) => setSortBy(e.target.value)}

                  aria-label="Sort events"

                >

                  <option value="date">Sort by date</option>

                  <option value="price-low">Price: Low to High</option>

                  <option value="price-high">Price: High to Low</option>

                </select>

              </div>

              <div className="section-heading">

                <div>

                  <p className="eyebrow">FIND YOUR EXPERIENCE</p>

                  <h2>Upcoming Events</h2>

                </div>

                <button onClick={loadEvents}>↻ Refresh</button>

              </div>

              <div className="event-grid">

                {filteredEvents.map((event) => (

                  <article className="event-card" key={event.id}>

                    <div className={`event-art ${getEventTheme(event)}`}>

                    <span className="event-art-icon">{getEventIcon(event)}</span>

                    <span className="event-art-label">DISCOVER SOMETHING AMAZING</span>

                  </div>

                    <div className="event-content">

                      <span className="tag">LIVE EVENT</span>

                      <h3>{event.title}</h3>

                      <p>{event.description}</p>

                      <p>📍 {event.location}</p>

                      <p>

                        📅 {event.eventDate?.replace("T", " ")}

                      </p>

                      <div className="event-bottom">

                        <strong>{money(event.price)}</strong>

                        <span>{event.availableSeats} seats left</span>

                      </div>

                      <div className="booking-row">

                        <input

                          aria-label="Number of tickets"

                          type="number"

                          min="1"

                          max={event.availableSeats}

                          value={tickets[event.id] || 1}

                          onChange={(e) =>

                            setTickets({

                              ...tickets,

                              [event.id]: e.target.value

                            })

                          }

                        />

                        <button

                          className="primary"

                          disabled={event.availableSeats < 1}

                          onClick={() => book(event)}

                        >

                          Book Tickets

                        </button>

                      </div>

                    </div>

                  </article>

                ))}

              </div>

              {filteredEvents.length === 0 && (

                <p className="empty">

                  No matching events found. Try another search or category!

                </p>

              )}

            </section>

          </>

        )}

        {page === "login" && (

          <section className="auth-card">

            <p className="eyebrow">WELCOME BACK</p>

            <h1>Log in</h1>

            <p>Sign in to continue to EventConnect.</p>

            <form onSubmit={login}>

              <label>

                Email

                <input

                  type="email"

                  required

                  value={email}

                  onChange={(e) => setEmail(e.target.value)}

                />

              </label>

              <label>

                Password

                <input

                  type="password"

                  required

                  value={password}

                  onChange={(e) => setPassword(e.target.value)}

                />

              </label>

              <button className="primary full" type="submit">

                Login

              </button>

            </form>

            <p>

              New here?{" "}

              <button className="text-button" onClick={() => setPage("register")}>

                Create an account

              </button>

            </p>

          </section>

        )}

        {page === "register" && (

          <section className="auth-card">

            <p className="eyebrow">JOIN THE COMMUNITY</p>

            <h1>Create account</h1>

            <form onSubmit={register}>

              <label>

                Full name

                <input

                  required

                  value={name}

                  onChange={(e) => setName(e.target.value)}

                />

              </label>

              <label>

                Email

                <input

                  type="email"

                  required

                  value={email}

                  onChange={(e) => setEmail(e.target.value)}

                />

              </label>

              <label>

                Password

                <input

                  type="password"

                  minLength="8"

                  required

                  value={password}

                  onChange={(e) => setPassword(e.target.value)}

                />

              </label>

              <button className="primary full" type="submit">

                Create Account

              </button>

            </form>

            <p>

              Already registered?{" "}

              <button className="text-button" onClick={() => setPage("login")}>

                Log in

              </button>

            </p>

          </section>

        )}

        {page === "checkout" && selectedEvent && (

          <section className="checkout-layout">

            <button className="back-button" onClick={() => setPage("events")}>

              ← Back to events

            </button>

            <div className="checkout-card">

              <div className="checkout-heading">

                <div>

                  <p className="eyebrow">SECURE CHECKOUT</p>

                  <h1>Complete your booking</h1>

                  <p className="muted">Review your order and choose a payment method.</p>

                </div>

                <div className="checkout-lock">♙</div>

              </div>

              <div className="checkout-event">

                <div className="checkout-art">✦</div>

                <div>

                  <h2>{selectedEvent.title}</h2>

                  <p>📍 {selectedEvent.location}</p>

                  <p>📅 {selectedEvent.eventDate?.replace("T", " ")}</p>

                </div>

              </div>

              <div className="checkout-line">

                <span>Price per ticket</span>

                <strong>{money(selectedEvent.price)}</strong>

              </div>

              <div className="checkout-line">

                <span>Tickets</span>

                <strong>{tickets[selectedEvent.id] || 1}</strong>

              </div>

              <div className="checkout-line">

                <span>Convenience fee</span>

                <strong>{money(0)}</strong>

              </div>

              <div className="checkout-line total-line">

                <span>Total payable</span>

                <strong>{money(Number(selectedEvent.price) * Number(tickets[selectedEvent.id] || 1))}</strong>

              </div>

              <div className="payment-section">

                <h2>Choose payment method</h2>

                <div className="pay-tabs">

                  <button type="button" className={paymentMethod === "card" ? "active" : ""} onClick={() => { setPaymentMethod("card"); setMessage(""); }}>

                    💳 Card

                  </button>

                  <button type="button" className={paymentMethod === "upi" ? "active" : ""} onClick={() => { setPaymentMethod("upi"); setMessage(""); }}>

                    ◉ UPI

                  </button>

                </div>

                {paymentMethod === "card" ? (

                  <>

                    <div className="card-preview">

                      <span className="brand">EVENTCONNECT</span>

                      <div className="chip" />

                      <div className="card-num">

                        {cardNumber ? cardNumber.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19) : "•••• •••• •••• ••••"}

                      </div>

                      <div className="card-row">

                        <span>{cardName.trim() || "CARDHOLDER NAME"}</span>

                        <span>{expiry || "MM/YY"}</span>

                      </div>

                    </div>

                    <form className="pay-form" onSubmit={confirmPayment}>

                      <label>

                        Cardholder name

                        <input autoComplete="cc-name" value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Name on card" required />

                      </label>

                      <label>

                        Card number

                        <input autoComplete="cc-number" inputMode="numeric" value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/[^\d ]/g, "").slice(0, 19))} placeholder="1234 5678 9012 3456" required />

                      </label>

                      <div className="pay-row">

                        <label>

                          Expiry date

                          <input autoComplete="cc-exp" value={expiry} onChange={e => {

                            let v = e.target.value.replace(/\D/g, "").slice(0, 4);

                            if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);

                            setExpiry(v);

                          }} placeholder="MM/YY" required />

                        </label>

                        <label>

                          CVV

                          <input autoComplete="off" inputMode="numeric" type="password" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="•••" required />

                        </label>

                      </div>

                      <button className="primary full confirm-button" disabled={paying} type="submit">

                        {paying ? <><span className="spinner" /> Processing booking...</> : `Pay ${money(Number(selectedEvent.price) * Number(tickets[selectedEvent.id] || 1))}`}

                      </button>

                    </form>

                  </>

                ) : (

                  <form className="pay-form" onSubmit={confirmPayment}>

                    <div className="upi-panel">

                      <div className="upi-symbol">◉</div>

                      <div><strong>Pay using UPI</strong><p>Enter a demo UPI ID to preview the checkout flow.</p></div>

                    </div>

                    <label>

                      UPI ID

                      <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" autoComplete="off" required />

                    </label>

                    <button className="primary full confirm-button" disabled={paying} type="submit">

                      {paying ? <><span className="spinner" /> Processing booking...</> : `Continue to pay ${money(Number(selectedEvent.price) * Number(tickets[selectedEvent.id] || 1))}`}

                    </button>

                  </form>

                )}

              </div>

              <p className="pay-note"><span>🔒</span> Protected checkout </p>

            </div>

          </section>

        )}

        {page === "confirmation" && confirmedBooking && (

          <section className="confirmation-card">

            <div className="success-icon">✓</div>

            <p className="eyebrow">YOU'RE ALL SET</p>

            <h1>Booking confirmed!</h1>

            <p className="muted">

              Your booking was successfully saved by EventConnect.

            </p>

            <div className="ticket-card">

              <div className="ticket-top">

                <span>✦ EVENTCONNECT</span>

                <span className="tag">CONFIRMED</span>

              </div>

              <h2>{confirmedBooking.eventTitle}</h2>

              <p>📍 {confirmedBooking.location}</p>

              <p>

                📅 {confirmedBooking.eventDate?.replace("T", " ")}

              </p>

              <div className="ticket-details">

                <div>

                  <span>BOOKING ID</span>

                  <strong>#{confirmedBooking.id}</strong>

                </div>

                <div>

                  <span>TICKETS</span>

                  <strong>{confirmedBooking.tickets}</strong>

                </div>

                <div>

                  <span>TOTAL</span>

                  <strong>{money(confirmedBooking.totalPrice)}</strong>

                </div>

              </div>

              <div className="digital-ticket-qr">

                <QRCodeSVG

                  value={JSON.stringify({

                    ticketType: "EventConnect digital ticket",

                    bookingId: confirmedBooking.id,

                    event: confirmedBooking.eventTitle,

                    eventDate: confirmedBooking.eventDate,

                    location: confirmedBooking.location,

                    tickets: confirmedBooking.tickets,

                    status: "CONFIRMED",

                  })}

                  size={148}

                  level="M"

                  includeMargin

                  title={`QR code for booking ${confirmedBooking.id}`}

                />

                <div>

                  <strong>Your digital ticket</strong>

                  <p>Show this QR code with your booking ID at the event check-in.</p>

                  <small>Demo QR code — it is not connected to a live ticket-scanning system.</small>

                </div>

              </div>

              <p className="demo-label">

                {confirmedBooking.paymentMethod || "Payment simulation"} · No real payment processed

              </p>

            </div>

            <div className="confirmation-actions">

              <button

                className="primary"

                onClick={() => window.print()}

              >

                Print Ticket

              </button>

              <button onClick={() => {

                loadBookings(user.id);

                setPage("bookings");

              }}>

                View My Bookings

              </button>

              <button onClick={() => setPage("events")}>

                Explore More Events

              </button>

            </div>

          </section>

        )}

        {page === "bookings" && (

          <section className="events-section">

            <div className="section-heading">

              <h2>My Bookings</h2>

              <button onClick={() => loadBookings(user.id)}>

                ↻ Refresh

              </button>

            </div>

            {bookings.map((booking) => (

              <article className="booking-card" key={booking.id}>

                <div className="booking-card-info">

                  <h3>Booking #{booking.id}</h3>

                  <p>

                    Event ID: {booking.eventId} · {booking.tickets} ticket(s)

                  </p>

                  <p>

                    Status: <strong>{booking.status}</strong>

                  </p>

                  <p>Total: {money(booking.totalPrice)}</p>

                  {booking.status !== "CANCELLED" && (

                    <div className="booking-qr">

                      <QRCodeSVG

                        value={JSON.stringify({

                          ticketType: "EventConnect digital ticket",

                          bookingId: booking.id,

                          eventId: booking.eventId,

                          tickets: booking.tickets,

                          status: booking.status,

                        })}

                        size={96}

                        level="M"

                        includeMargin

                        title={`QR code for booking ${booking.id}`}

                      />

                      <span>Digital ticket QR · Demo only</span>

                    </div>

                  )}

                </div>

                {booking.status !== "CANCELLED" && (

                  <button onClick={() => cancelBooking(booking.id)}>

                    Cancel booking

                  </button>

                )}

              </article>

            ))}

            {bookings.length === 0 && (

              <p className="empty">

                No bookings yet. Explore events to book your first ticket.

              </p>

            )}

          </section>

        )}

      </main>

      <footer>

        © 2026 EventConnectASE · Discover. Connect. Experience.

      </footer>

    </div>

  );

}

export default App;
