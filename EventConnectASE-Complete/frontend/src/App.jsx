
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:8080";

function App() {
  const [page, setPage] = useState("events");
  const [events, setEvents] = useState([]);
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
      if (!cardName.trim() || digits.length < 12 || !/^\d{2}\/\d{2}$/.test(expiry) || cvv.replace(/\D/g, "").length < 3) {
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
              <div className="section-heading">
                <div>
                  <p className="eyebrow">FIND YOUR EXPERIENCE</p>
                  <h2>Upcoming Events</h2>
                </div>
                <button onClick={loadEvents}>↻ Refresh</button>
              </div>

              <div className="event-grid">
                {events.map((event) => (
                  <article className="event-card" key={event.id}>
                    <div className="event-art">✦</div>

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

              {events.length === 0 && (
                <p className="empty">
                  No events found. Try refreshing the page.
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
                <div>
                  <h3>Booking #{booking.id}</h3>
                  <p>
                    Event ID: {booking.eventId} · {booking.tickets} ticket(s)
                  </p>
                  <p>
                    Status: <strong>{booking.status}</strong>
                  </p>
                  <p>Total: {money(booking.totalPrice)}</p>
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
