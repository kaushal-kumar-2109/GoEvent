import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { GET_EVENTS } from '../../../apis/sender';
import EventCard from '../../../components/event_card/event_card';
import './events_page.css';

const CATEGORIES = [
  { value: " Music", label: " Music" },
  { value: " Business", label: " Business" },
  { value: " Workshop", label: " Workshop" },
  { value: " Technology", label: " Technology" },
  { value: " Sports", label: " Sports" },
  { value: " Education", label: " Education" },
  { value: " Gaming", label: " Gaming" },
  { value: " Food", label: " Food & Drink" },
  { value: " Fashion", label: " Fashion" },
  { value: " Health", label: " Health" }
];

const DATE_OPTIONS = [
  { value: "all", label: "All Dates" },
  { value: "today", label: "Today" },
  { value: "this-weekend", label: "This Weekend" },
  { value: "next-7-days", label: "Next 7 Days" },
  { value: "next-30-days", label: "Next 30 Days" }
];

export default function EventsPage({ getTheam }) {
  // Page Events Data State
  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageLoader, setIsPageLoader] = useState(false);

  // Search Banner Inputs State
  const [bannerSearch, setBannerSearch] = useState("");
  const [bannerLocation, setBannerLocation] = useState("");
  const [bannerStatus, setBannerStatus] = useState("");
  const [bannerCategory, setBannerCategory] = useState("");

  // Sidebar Filter Inputs State
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedEventTypes, setSelectedEventTypes] = useState([]);

  // Sorting
  const [sortBy, setSortBy] = useState("featured");

  // Newsletter Email
  const [newsletterEmail, setNewsletterEmail] = useState("");

  // Mobile Filter Drawer Toggle State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Active Applied Filters (Used for fetch queries)
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    location: "",
    status: "",
    date: "",
    category: "",
    minPrice: 0,
    maxPrice: 500,
    eventType: ""
  });

  // Fetch paginated events from backend API
  const fetchEvents = async (pageToLoad = 1) => {
    setIsPageLoader(true);
    try {
      const queryParams = {
        page: pageToLoad,
        limit: 8,
        sortBy: sortBy,
        search: appliedFilters.search,
        location: appliedFilters.location,
        status: appliedFilters.status,
        date: appliedFilters.date,
        category: appliedFilters.category,
        minPrice: appliedFilters.minPrice,
        maxPrice: appliedFilters.maxPrice,
        eventType: appliedFilters.eventType
      };

      const response = await GET_EVENTS(queryParams);
      if (response && response.status === 200 && response.success) {
        const { events, pagination } = response.data;
        setEvents(events || []);
        setTotalEvents(pagination.totalEvents || 0);
        setTotalPages(pagination.totalPages || 0);
        setCurrentPage(pagination.currentPage || 1);
      } else {
        setEvents([]);
        setTotalEvents(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events. Please try again.");
    } finally {
      setIsPageLoader(false);
    }
  };

  // Triggers API query when appliedFilters or sortBy updates
  useEffect(() => {
    fetchEvents(1);
  }, [appliedFilters, sortBy]);

  // Handle pagination navigation click
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchEvents(page);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  // Banner "Search Events" Button Handler
  const handleBannerSearchSubmit = () => {
    // Collect settings from banner and merge with current sidebar settings
    setAppliedFilters(prev => ({
      ...prev,
      search: bannerSearch,
      location: bannerLocation,
      status: bannerStatus,
      category: bannerCategory || prev.category
    }));
  };

  // Sidebar "Apply Filters" Button Handler
  const handleApplySidebarFilters = () => {
    setAppliedFilters(prev => ({
      ...prev,
      category: selectedCategories.join(","),
      date: selectedDateRange === "all" ? "" : selectedDateRange,
      maxPrice: maxPrice,
      eventType: selectedEventTypes.join(",")
    }));
    setIsMobileFilterOpen(false);
  };

  // Reset/Clear All Filters Handler
  const handleClearAllFilters = () => {
    setBannerSearch("");
    setBannerLocation("");
    setBannerStatus("");
    setBannerCategory("");
    setSelectedCategories([]);
    setSelectedDateRange("all");
    setMaxPrice(500);
    setSelectedEventTypes([]);
    setAppliedFilters({
      search: "",
      location: "",
      status: "",
      date: "",
      category: "",
      minPrice: 0,
      maxPrice: 500,
      eventType: ""
    });
    setSortBy("featured");
    setIsMobileFilterOpen(false);
  };

  // Toggle category checkboxes in sidebar
  const handleCategoryToggle = (categoryValue) => {
    setSelectedCategories(prev =>
      prev.includes(categoryValue)
        ? prev.filter(c => c !== categoryValue)
        : [...prev, categoryValue]
    );
  };

  // Toggle event type checkboxes in sidebar
  const handleEventTypeToggle = (typeValue) => {
    setSelectedEventTypes(prev =>
      prev.includes(typeValue)
        ? prev.filter(t => t !== typeValue)
        : [...prev, typeValue]
    );
  };

  // Handle Newsletter Submission
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      toast.success("Thank you for subscribing to GoEvent newsletter!");
      setNewsletterEmail("");
    }
  };

  // Renders standard numeric page items with support for ellipsis
  const renderPaginationNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button key={1} className={`pagination-btn ${currentPage === 1 ? 'active' : ''}`} onClick={() => handlePageChange(1)}>
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ell-1" className="pagination-ellipsis">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ell-2" className="pagination-ellipsis">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          className={`pagination-btn ${currentPage === totalPages ? 'active' : ''}`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="events-explore-page">
      {/* EXPLORE EVENTS BANNER */}
      <section className="explore-banner">
        <div className="container">
          <div className="breadcrumb-nav">
            <a href="/GoEvent">Home</a> &gt; <span>Events</span>
          </div>
          <h1 className="banner-title">Explore Events</h1>
          <p className="banner-subtitle">Discover and book amazing events around you</p>

          {/* Main search bar widget */}
          <div className="search-bar-card">
            <div className="search-input-group search-term-group">
              {/* <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg> */}
              <input
                type="text"
                placeholder="Search events..."
                value={bannerSearch}
                onChange={(e) => setBannerSearch(e.target.value)}
              />
            </div>

            <div className="search-input-group search-location-group">
              {/* <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
                <circle cx="12" cy="9" r="2.5"></circle>
              </svg> */}
              <input
                type="text"
                placeholder="Location"
                value={bannerLocation}
                onChange={(e) => setBannerLocation(e.target.value)}
              />
            </div>

            <div className="search-input-group search-date-group">
              {/* <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg> */}
              <select value={bannerStatus} onChange={(e) => setBannerStatus(e.target.value)}>
                <option value="">Select Status</option>
                <option value="PUBLISHED">New Event</option>
                <option value="PENDING">Registration Closed</option>
                <option value="STARTED">Live Event</option>
                <option value="COMPLETED">Ended Event</option>
              </select>
            </div>

            <div className="search-input-group search-category-group">
              {/* <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg> */}
              <select value={bannerCategory} onChange={(e) => setBannerCategory(e.target.value)}>
                <option value="">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary search-btn" onClick={handleBannerSearchSubmit}>
              Search Events
            </button>
          </div>
        </div>
      </section>

      {/* EXPLORE PAGE MAIN AREA */}
      <div className="explore-main-section container">

        {/* Toggle Button for Mobile Filter Drawer */}
        <div className="mobile-action-bar">
          <button className="mobile-filter-toggle" onClick={() => setIsMobileFilterOpen(true)}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Filters
          </button>
          <div className="sort-dropdown-group">
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Popularity</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Backdrop for Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="filter-backdrop" onClick={() => setIsMobileFilterOpen(false)}></div>
        )}

        {/* SIDEBAR FILTER PANEL */}
        <aside className={`filter-sidebar ${isMobileFilterOpen ? 'open' : ''}`}>
          <div className="sidebar-filter-header">
            <h3>Filters</h3>
            <div className="sidebar-header-actions">
              <button className="clear-all-btn" onClick={handleClearAllFilters}>Clear All</button>
              <button className="close-filter-drawer" onClick={() => setIsMobileFilterOpen(false)}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Categories Option Checkbox list */}
          <div className="filter-group">
            <h4 className="filter-title">Categories</h4>
            <div className="filter-options-list">
              {CATEGORIES.map(cat => (
                <label key={cat.value} className="checkbox-filter-label">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.value)}
                    onChange={() => handleCategoryToggle(cat.value)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="option-text">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Option Radio list */}
          <div className="filter-group">
            <h4 className="filter-title">Date</h4>
            <div className="filter-options-list">
              {DATE_OPTIONS.map(opt => (
                <label key={opt.value} className="radio-filter-label">
                  <input
                    type="radio"
                    name="dateFilter"
                    checked={selectedDateRange === opt.value}
                    onChange={() => setSelectedDateRange(opt.value)}
                  />
                  <span className="radio-custom"></span>
                  <span className="option-text">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="filter-group">
            <h4 className="filter-title">Price Range</h4>
            <div className="price-slider-wrapper">
              <input
                type="range"
                min="0"
                max="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="price-slider"
              />
              <div className="price-range-labels">
                <span>$0</span>
                <span className="active-price">${maxPrice === 500 ? "500+" : maxPrice}</span>
                <span>$500+</span>
              </div>
            </div>
          </div>

          {/* Event Type Checkbox list */}
          <div className="filter-group">
            <h4 className="filter-title">Event Type</h4>
            <div className="filter-options-list">
              <label className="checkbox-filter-label">
                <input
                  type="checkbox"
                  checked={selectedEventTypes.includes("PUBLIC")}
                  onChange={() => handleEventTypeToggle("PUBLIC")}
                />
                <span className="checkbox-custom"></span>
                <span className="option-text">Public</span>
              </label>
              <label className="checkbox-filter-label">
                <input
                  type="checkbox"
                  checked={selectedEventTypes.includes("PRIVATE")}
                  onChange={() => handleEventTypeToggle("PRIVATE")}
                />
                <span className="checkbox-custom"></span>
                <span className="option-text">Private</span>
              </label>
            </div>
          </div>

          <button className="btn btn-primary apply-filters-btn" onClick={handleApplySidebarFilters}>
            Apply Filters
          </button>
        </aside>

        {/* EVENTS LIST VIEW GRID AREA */}
        <main className="events-display-area">

          <div className="results-header-row desktop-only">
            <span className="results-count">
              Showing {events.length > 0 ? (currentPage - 1) * 8 + 1 : 0}-
              {Math.min(currentPage * 8, totalEvents)} of {totalEvents} events
            </span>
            <div className="sort-dropdown-group">
              <span className="sort-label">Sort by:</span>
              <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Popularity</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {isPageLoader ? (
            <div className="events-loader-container">
              <div className="spinner"></div>
              <span>Loading events...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="no-events-found">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              <h3>No Events Found</h3>
              <p>Try resetting the filters or modifying your search terms.</p>
            </div>
          ) : (
            <>
              <div className="events-grid">
                {events.map(event => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="pagination-wrapper">
                  <button
                    className="pagination-btn arrow-btn"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    &lt;
                  </button>
                  {renderPaginationNumbers()}
                  <button
                    className="pagination-btn arrow-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* NEWSLETTER SUBSCRIPTION BLOCK */}
      <section className="newsletter-card container">
        <div className="newsletter-card-content">
          <div className="newsletter-left">
            <div className="newsletter-icon-wrapper">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div className="newsletter-text">
              <h3>Stay Updated!</h3>
              <p>Subscribe to get the latest events and offers.</p>
            </div>
          </div>
          <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="newsletter-input"
            />
            <button type="submit" className="btn btn-primary newsletter-btn">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
