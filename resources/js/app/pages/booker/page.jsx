import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { GlobalStyle } from "../../_styles/global-style";
import { SigninModal } from "./_sections/sign-in";
import { ToastStack } from "../../_components/toast-stack";
import { CategoryGrid } from "./_sections/category-grid";
import { VenueScreen } from "./venue/page";
import { ReservationPage } from "./reservation/page";
import {  CartPage } from "./cart/page";
import { CheckoutPage } from "./checkout/page";
import { SuccessScreen } from "./_sections/success-screen";
import { MyBookingsScreen } from "./_sections/my-book-screen";
import { SUBSCRIPTION_PLANS } from "./../../_constants/mockData";
import store from "../../_store/store";
import { get_app_data_thunk } from "../../_redux/app-thunk";
import { Navbar } from "./_sections/navbar";

export default function Home() {
    const rawCategories = useSelector((store) => store.app?.categories);

    // Safeguard: Flatten categories across users if payload returns nested subscriber arrays
    const categories = Array.isArray(rawCategories)
        ? rawCategories.flatMap(item => (item.categories ? item.categories : item))
        : [];

    // Screen Management - Defaults to "home"
    const [screen, setScreen] = useState("home");
    const [searchText, setSearchText] = useState("");
    const [selectedVenueId, setSelectedVenueId] = useState(null);
    const [dateIndex, setDateIndex] = useState(0);
    const [showAllServices, setShowAllServices] = useState(false);

    // Dynamic State Routing
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Cart & User States
    const [cart, setCart] = useState([]);
    const [selectedPlanId, setSelectedPlanId] = useState("monthly_pass");
    const [user, setUser] = useState(null);
    const [confirmedBookings, setConfirmedBookings] = useState([]);
    const [toasts, setToasts] = useState([]);
    const [form, setForm] = useState({ name: "", email: "", phone: "" });
    const [formErrors, setFormErrors] = useState({ name: false, email: false });

    const signinRef = useRef(null);

    useEffect(() => {
        store.dispatch(get_app_data_thunk());
    }, []);

    function toast(msg) {
        const id = Math.random().toString(36).slice(2);
        setToasts(t => [...t, { id, msg }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
    }

    function go(name) {
        setScreen(name);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Handles returning back and clearing stale selection states
    function handleGoBack(targetScreen = "home") {
        if (targetScreen === "home") {
            setSelectedCategory(null);
        }
        go(targetScreen);
    }

    function handleCategoryClick(category) {
        setSelectedCategory(category);
        go("venue");
    }

    function openVenue(id) {
        setSelectedVenueId(id);
        setDateIndex(0);
        go("reservation");
    }

    // Toggle cart item using functional updates to prevent stale state issues
    function toggleCartItem(venue, dateLabel, hour) {
        if (!venue || !venue.id) {
            toast("Unable to select venue slot.");
            return;
        }

        const plan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[0];
        const itemKey = `${venue.id}-${dateLabel}-${hour}`;

        setCart(prevCart => {
            const exists = prevCart.some(c => c.key === itemKey);

            if (exists) {
                toast(`Removed ${venue.name} (${hour}) from cart.`);
                return prevCart.filter(c => c.key !== itemKey);
            } else {
                const basePrice = parseFloat(venue.base_price || venue.price || 0);
                const discount = plan?.discount || 0;
                const finalPrice = Math.round(basePrice * (1 - discount));

                toast(`Added ${venue.name} (${hour}) to cart!`);
                return [
                    ...prevCart,
                    {
                        key: itemKey,
                        venueId: venue.id,
                        venue: {
                            id: venue.id,
                            name: venue.name || "Selected Venue",
                            area: venue.area || venue.address || venue.addr || "N/A",
                            base_price: basePrice,
                        },
                        dateLabel,
                        hour,
                        originalPrice: basePrice,
                        finalPrice,
                        plan,
                    }
                ];
            }
        });
    }

    function removeCartItem(key) {
        setCart(prev => prev.filter(c => c.key !== key));
    }

    function handleCheckout() {
        if (cart.length === 0) {
            toast("Your reservation cart is empty!");
            return;
        }
        go("confirm");
    }

    function finalizeBookings() {
        const okName = !!form.name.trim();
        const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
        setFormErrors({ name: !okName, email: !okEmail });

        if (!okName || !okEmail) {
            toast("Please enter valid contact details.");
            return;
        }

        const batchCode = "SUB-" + Math.random().toString(36).slice(2, 7).toUpperCase();
        const newBookings = cart.map(item => ({
            ...item,
            code: batchCode,
            createdAt: new Date().toLocaleDateString(),
            userName: form.name,
        }));

        setConfirmedBookings(prev => [...newBookings, ...prev]);
        setCart([]);
        go("success");
        toast("All reservations & subscriptions confirmed!");
    }

    const visibleCategories = showAllServices
        ? categories
        : categories.slice(0, 8);

    // ROBUST VENUE RESOLVER
    const findVenueById = (id) => {
        if (!id) return null;

        if (selectedCategory?.venues) {
            const found = selectedCategory.venues.find(v => String(v.id) === String(id));
            if (found) return found;
        }

        if (Array.isArray(categories)) {
            const found = categories
                .flatMap(c => c.venues || [])
                .find(v => String(v.id) === String(id));
            if (found) return found;
        }

        if (Array.isArray(rawCategories)) {
            for (const item of rawCategories) {
                const catList = item.categories || (Array.isArray(item) ? item : []);
                for (const cat of catList) {
                    const venue = cat.venues?.find(v => String(v.id) === String(id));
                    if (venue) return venue;
                }
            }
        }

        return null;
    };

    const activeVenue = findVenueById(selectedVenueId);

    return (
        <div className="mp-root min-h-screen flex flex-col justify-between">
            <GlobalStyle />

            <Navbar
                cartCount={cart.length}
                bookingsCount={confirmedBookings.length}
                user={user}
                onGo={handleGoBack}
                onSignOut={() => setUser(null)}
                onOpenSignIn={() => signinRef.current?.showModal()}
            />

            <SigninModal ref={signinRef} onSignIn={(name) => { setUser(name); toast(`Welcome back, ${name}!`); }} />
            <ToastStack toasts={toasts} />

            {/* 1st Screen: Home */}
            {screen === "home" && (
                <div className="screen-anim flex-1">
                    <CategoryGrid
                        visibleCategories={visibleCategories}
                        showAllServices={showAllServices}
                        onToggleShowAll={() => setShowAllServices(!showAllServices)}
                        onCategoryClick={handleCategoryClick}
                        onGo={handleGoBack}
                        onOpenVenue={openVenue}
                    />
                </div>
            )}

            {/* 2nd Screen: Venue View */}
            {screen === "venue" && (
                <div className="screen-anim flex-1">
                    <VenueScreen
                        selected={selectedCategory}
                        searchText={searchText}
                        onOpenVenue={openVenue}
                        onGo={handleGoBack}
                    />
                </div>
            )}

            {/* 3rd Screen: Reservation Detail */}
            {screen === "reservation" && (
                <ReservationPage
                    activeVenue={activeVenue}
                    selectedPlanId={selectedPlanId}
                    setSelectedPlanId={setSelectedPlanId}
                    dateIndex={dateIndex}
                    setDateIndex={setDateIndex}
                    cart={cart}
                    onToggleCartItem={toggleCartItem}
                    onGo={handleGoBack}
                />
            )}

            {/* Cart Screen */}
            {screen === "cart" && (
                <CartPage
                    cart={cart}
                    onRemoveCartItem={removeCartItem}
                    onCheckout={handleCheckout}
                    onGo={handleGoBack}
                />
            )}

            {/* Confirmation Screen */}
            {screen === "confirm" && (
                <CheckoutPage
                    cart={cart}
                    form={form}
                    setForm={setForm}
                    formErrors={formErrors}
                    onFinalize={finalizeBookings}
                    onGo={handleGoBack}
                />
            )}

            {/* Success Screen */}
            {screen === "success" && <SuccessScreen onGo={handleGoBack} />}

            {/* My Bookings Screen */}
            {screen === "my-bookings" && <MyBookingsScreen confirmedBookings={confirmedBookings} onGo={handleGoBack} />}
        </div>
    );
}