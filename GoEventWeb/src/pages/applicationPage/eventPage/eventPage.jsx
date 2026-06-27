import React, { useState, useEffect } from 'react';
import NavBar from '../../../components/navBar/navBar';
import SideBar from '../../../components/sideBar/sideBar';
import Footer from '../../../components/footer/footer';
import Loader from '../../../components/loader/loader';
import EventCard from '../../../components/cards/eventCards';
import { categoriesList } from '../../../utils/mockData';
import { getEvents } from '../../../api/getApiHandler/getData';
import { ToastMessage, ToastSuccess } from '../../../assets/toast.jsx';
import { CheckUserAuth, RemoveUserAuth } from '../../../middleware/chekUserAuth.jsx';
import './eventPage.css';

export default function EventPage() {
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Events and pagination state
    const [eventsList, setEventsList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Filters state
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDate, setSelectedDate] = useState('');

    // Authentication State
    useEffect(() => {
        setIsLoggedIn(CheckUserAuth());
    }, []);

    const handleLogout = () => {
        RemoveUserAuth();
        setIsLoggedIn(false);
        ToastSuccess("Logout successfully");
    };

    // Debounce search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1); // Reset page on query search
        }, 450);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    // Load events when page or filters change
    const fetchPageEvents = async () => {
        setIsFetching(true);
        const params = {
            page: currentPage,
            limit: 20,
            search: debouncedSearch,
            category: selectedCategory === 'all' ? '' : selectedCategory,
            date: selectedDate
        };

        const res = await getEvents(params);
        if (res.flag) {
            setEventsList(res.data.data || []);
            setTotalPages(res.data.totalPages || 1);
            setTotalCount(res.data.totalCount || 0);
        } else {
            console.error("Error loading events: " + res.error);
            ToastMessage(res.message || "Failed to load events");
        }

        setIsFetching(false);
        setIsFirstLoad(false);
    };

    useEffect(() => {
        fetchPageEvents();
    }, [currentPage, debouncedSearch, selectedCategory, selectedDate]);

    // Reset all filters
    const handleResetFilters = () => {
        setSearch('');
        setSelectedCategory('all');
        setSelectedDate('');
        setCurrentPage(1);
        ToastSuccess("Filters reset");
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Smooth scroll to events view
        document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    if (isFirstLoad) {
        return <Loader text="Loading GoEvents directory" />;
    }

    // Generate numbered pages for navigation
    const renderPageNumbers = () => {
        const pageButtons = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
                <button
                    key={i}
                    className={`page-num-btn ${currentPage === i ? 'active' : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }
        return pageButtons;
    };

    return (
        <div className="eventpage-wrapper">
            {/* Navigation bar */}
            <NavBar
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                onToggleSidebar={() => setSidebarOpen(true)}
                tag={"events"}
            />

            {/* Side drawer navigation */}
            <SideBar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                tag={"events"}
            />

            {/* Hero Banner header */}
            <header className="eventpage-hero">
                <div className="eventpage-hero-content">
                    <span className="hero-tagline">Explore the Directory</span>
                    <h1 className="hero-title">
                        Find Your Next <span className="hero-title-gradient">Experience</span>
                    </h1>
                    <p className="hero-subtitle">
                        Browse through hundreds of events, workshops, webinars, and more. Filter by category, date, and name to discover exactly what you are looking for.
                    </p>
                </div>
                <div className="eventpage-hero-overlay"></div>
            </header>

            {/* Main Events Section */}
            <main className="eventpage-main-container" id="events-section">
                {/* Interactive Search and Filter Box */}
                <section className="search-filter-panel">
                    <div className="filter-row">
                        {/* Search Input */}
                        <div className="filter-group search-box">
                            <label htmlFor="search-input" className="filter-label">Search Event Name</label>
                            <div className="input-with-icon">
                                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.3-4.3" />
                                </svg>
                                <input
                                    id="search-input"
                                    type="text"
                                    placeholder="Type event title..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="filter-input"
                                />
                                {search && (
                                    <button className="clear-search-btn" onClick={() => setSearch('')} aria-label="Clear search">
                                        &times;
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Date Input */}
                        <div className="filter-group date-box">
                            <label htmlFor="date-input" className="filter-label">Filter by Date</label>
                            <div className="input-with-icon">
                                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                    <line x1="16" x2="16" y1="2" y2="6" />
                                    <line x1="8" x2="8" y1="2" y2="6" />
                                    <line x1="3" x2="21" y1="10" y2="10" />
                                </svg>
                                <input
                                    id="date-input"
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="filter-input date-input"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="filter-actions">
                            {(search || selectedCategory !== 'all' || selectedDate) && (
                                <button className="btn-reset-filters" onClick={handleResetFilters}>
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category Chips Container */}
                    <div className="category-chips-wrapper">
                        <span className="category-label-inline">Categories:</span>
                        <div className="category-chips-list">
                            <button
                                className={`category-chip ${selectedCategory === 'all' ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedCategory('all');
                                    setCurrentPage(1);
                                }}
                            >
                                All Events
                            </button>
                            {categoriesList.map((cat) => (
                                <button
                                    key={cat.id}
                                    className={`category-chip ${selectedCategory.toLowerCase() === cat.name.toLowerCase() ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedCategory(cat.name);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <span className="chip-icon">{cat.icon}</span>
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Directory Results Heading */}
                <div className="results-header">
                    <div className="results-count">
                        {isFetching ? (
                            <span>Updating results...</span>
                        ) : (
                            <span>Showing <strong>{eventsList.length}</strong> of <strong>{totalCount}</strong> upcoming events</span>
                        )}
                    </div>
                </div>

                {/* Events Grid / State renderer */}
                <section className={`events-grid-container ${isFetching ? 'grid-loading' : ''}`}>
                    {isFetching && eventsList.length === 0 ? (
                        <div className="grid-placeholder">
                            <div className="spinner-loader"></div>
                            <p>Fetching matching events...</p>
                        </div>
                    ) : eventsList.length > 0 ? (
                        <div className="events-grid">
                            {eventsList.map((event) => (
                                <EventCard key={event._id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-events-found">
                            <svg className="no-results-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 15h8" />
                                <line x1="9" x2="9.01" y1="9" y2="9" />
                                <line x1="15" x2="15.01" y1="9" y2="9" />
                            </svg>
                            <h3>No Events Found</h3>
                            <p>We couldn't find any events matching your selected filters. Try resetting the criteria or searching something else.</p>
                            <button className="btn-explore" onClick={handleResetFilters}>
                                Browse All Events
                            </button>
                        </div>
                    )}
                </section>

                {/* Pagination Controls */}
                {totalPages > 1 && !isFetching && (
                    <nav className="pagination-wrapper" aria-label="Events Directory Pagination">
                        <button
                            className="page-nav-btn"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            aria-label="Go to previous page"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" x2="5" y1="12" y2="12" />
                                <polyline points="12 19 5 12 12 5" />
                            </svg>
                            <span>Prev</span>
                        </button>

                        <div className="page-numbers-container">
                            {renderPageNumbers()}
                        </div>

                        <button
                            className="page-nav-btn"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            aria-label="Go to next page"
                        >
                            <span>Next</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" x2="19" y1="12" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>
                    </nav>
                )}
            </main>

            {/* Footer component */}
            <Footer />
        </div>
    );
}
