import React, { useState } from 'react';

export default function TicketBookingTab() {
  const [activeFilter, setActiveFilter] = useState('All');

  const [bookings, setBookings] = useState([
    {
      id: 'GE-104829',
      title: 'Sunburn Festival 2024',
      date: '28 - 30 Dec 2024',
      time: '04:00 PM onwards',
      location: 'Vagator Beach, Goa',
      status: 'Upcoming',
      ticketCount: 2,
      price: '₹7,998',
      bookedOn: '12 Jul 2024',
      image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'GE-103721',
      title: 'Comedy Night Special',
      date: '15 Aug 2024',
      time: '07:30 PM - 09:30 PM',
      location: 'Canvas Laugh Club, Mumbai',
      status: 'Upcoming',
      ticketCount: 1,
      price: '₹1,200',
      bookedOn: '05 Jun 2024',
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'GE-102940',
      title: 'Tech Innovation Summit 2024',
      date: '10 Sep 2024',
      time: '09:00 AM - 06:00 PM',
      location: 'KTPO Convention Center, Bengaluru',
      status: 'Upcoming',
      ticketCount: 3,
      price: '₹4,500',
      bookedOn: '20 May 2024',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'GE-101855',
      title: 'Arijit Singh Live in Concert',
      date: '05 Oct 2024',
      time: '06:30 PM onwards',
      location: 'Jawaharlal Nehru Stadium, New Delhi',
      status: 'Upcoming',
      ticketCount: 2,
      price: '₹9,000',
      bookedOn: '01 Jun 2024',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'GE-100762',
      title: 'International Food & Wine Expo',
      date: '18 Nov 2024',
      time: '11:00 AM - 09:00 PM',
      location: 'Hitex Exhibition Center, Hyderabad',
      status: 'Upcoming',
      ticketCount: 2,
      price: '₹1,800',
      bookedOn: '15 Jun 2024',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'GE-099482',
      title: 'UI/UX Design Workshop',
      date: '12 Apr 2024',
      time: '10:00 AM - 05:00 PM',
      location: 'WeWork, Bengaluru',
      status: 'Past',
      ticketCount: 1,
      price: '₹2,500',
      bookedOn: '28 Mar 2024',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'GE-098211',
      title: 'Indie Rock Music Fest',
      date: '02 Mar 2024',
      time: '03:00 PM - 11:00 PM',
      location: 'Nicco Park, Kolkata',
      status: 'Past',
      ticketCount: 2,
      price: '₹3,200',
      bookedOn: '10 Feb 2024',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'GE-097103',
      title: 'Startup Pitch Night 2024',
      date: '15 Feb 2024',
      time: '05:00 PM - 09:00 PM',
      location: 'T-Hub 2.0, Hyderabad',
      status: 'Past',
      ticketCount: 1,
      price: '₹999',
      bookedOn: '01 Feb 2024',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'GE-094720',
      title: 'Global Food Truck Carnival',
      date: '22 Jan 2024',
      time: '12:00 PM - 10:00 PM',
      location: 'Bandra Kurla Complex, Mumbai',
      status: 'Cancelled',
      ticketCount: 4,
      price: '₹800',
      bookedOn: '10 Jan 2024',
      image: 'https://images.unsplash.com/photo-1565123409695-7b5ff624d164?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 'GE-093114',
      title: 'EDM Arena Night',
      date: '05 Jan 2024',
      time: '08:00 PM - 02:00 AM',
      location: 'Supermoon Arena, Pune',
      status: 'Cancelled',
      ticketCount: 2,
      price: '₹2,400',
      bookedOn: '20 Dec 2023',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop'
    }
  ]);

  const handleCancelBooking = (orderId) => {
    if (window.confirm(`Are you sure you want to cancel booking ${orderId}? This cannot be undone.`)) {
      setBookings(bookings.map(booking => {
        if (booking.id === orderId) {
          return { ...booking, status: 'Cancelled' };
        }
        return booking;
      }));
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeFilter === 'All') return true;
    return booking.status === activeFilter;
  });

  return (
    <div className="ticket-booking-tab-container">
      <div className="tab-header-row">
        <div>
          <h2 className="tab-title">Tickets & Bookings</h2>
          <p className="tab-subtitle">View your booked tickets, order details, and get invoices</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="events-filter-tabs">
        {['All', 'Upcoming', 'Past', 'Cancelled'].map(tab => (
          <button
            key={tab}
            className={`filter-tab-btn ${activeFilter === tab ? 'active' : ''}`}
            onClick={() => setActiveFilter(tab)}
          >
            {tab} Bookings
            <span className="tab-count">
              {bookings.filter(b => tab === 'All' || b.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="bookings-list-layout">
          {filteredBookings.map(booking => (
            <div className="booking-card-item" key={booking.id}>
              <div className="booking-image-section">
                <img src={booking.image} alt={booking.title} className="booking-img" />
              </div>
              <div className="booking-details-section">
                <div className="booking-header">
                  <h3 className="booking-title">{booking.title}</h3>
                  <span className={`booking-status-badge status-${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-meta-grid">
                  <div className="meta-item">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>{booking.date}</span>
                  </div>
                  <div className="meta-item">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{booking.time}</span>
                  </div>
                  <div className="meta-item full-width">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{booking.location}</span>
                  </div>
                </div>

                <div className="booking-footer">
                  <div className="order-details">
                    <span className="order-id">Order: <strong>{booking.id}</strong></span>
                    <span className="booked-date">Booked on: {booking.bookedOn}</span>
                  </div>
                  <div className="pricing-details">
                    <span className="ticket-count">{booking.ticketCount} {booking.ticketCount > 1 ? 'Tickets' : 'Ticket'}</span>
                    <span className="booking-price">{booking.price}</span>
                  </div>
                </div>
              </div>

              <div className="booking-actions-section">
                {booking.status === 'Upcoming' && (
                  <>
                    <button className="btn btn-primary btn-sm w-full">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Download Ticket
                    </button>
                    <button className="btn btn-secondary btn-sm w-full">
                      View Invoice
                    </button>
                    <button className="btn btn-text btn-sm text-danger w-full mt-2" onClick={() => handleCancelBooking(booking.id)}>
                      Cancel Booking
                    </button>
                  </>
                )}
                {booking.status === 'Past' && (
                  <>
                    <button className="btn btn-secondary btn-sm w-full">
                      Download Receipt
                    </button>
                    <button className="btn btn-secondary btn-sm w-full">
                      Rebook Event
                    </button>
                  </>
                )}
                {booking.status === 'Cancelled' && (
                  <span className="cancelled-text-badge">
                    Refund Processed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state-card">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"></path>
          </svg>
          <h3>No bookings found</h3>
          <p>We couldn't find any ticket bookings under the "{activeFilter}" status.</p>
          <button className="btn btn-primary btn-sm" onClick={() => setActiveFilter('All')}>
            Show All Bookings
          </button>
        </div>
      )}
    </div>
  );
}
