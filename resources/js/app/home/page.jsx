import { useEffect, useRef, useState } from "react";
import { GlobalStyle } from "../_styles/global-style";
import { Navbar } from "../_sections/navbar";
import { SigninModal } from "../_sections/sign-in";
import { ToastStack } from "../_components/toast-stack";
import { CategoryGrid } from "../_sections/category-grid";
import { CategoryScreen } from "../_sections/category-screen";
import { VenueScreen } from "../_sections/venue-screen";
import { CartScreen } from "../_sections/cart-screen";
import { ConfirmScreen } from "../_sections/confirm-screen";
import { SuccessScreen } from "../_sections/success-screen";
import { MyBookingsScreen } from "../_sections/my-book-screen";
// import { Footer } from "../_sections/footer";
import { VENUES, SUBSCRIPTION_PLANS } from "../_constants/mockData";
import store from "../_store/store";
import { get_app_data_thunk } from "../_redux/app-thunk";
import { useSelector } from "react-redux";

export default function App() {
    const { categories } = useSelector((store) => store.app)

    const [screen, setScreen] = useState("home");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [searchText, setSearchText] = useState("");
    const [selectedVenueId, setSelectedVenueId] = useState(null);
    const [dateIndex, setDateIndex] = useState(0);
    const [showAllServices, setShowAllServices] = useState(false);

    const [cart, setCart] = useState([]);
    const [selectedPlanId, setSelectedPlanId] = useState("monthly_pass");

    const [user, setUser] = useState(null);
    const [confirmedBookings, setConfirmedBookings] = useState([]);
    const [toasts, setToasts] = useState([]);
    const [form, setForm] = useState({ name: "", email: "", phone: "" });
    const [formErrors, setFormErrors] = useState({ name: false, email: false });
    const [selected, setSelected] = useState('')

    const signinRef = useRef(null);

    useEffect(() => {
        store.dispatch(get_app_data_thunk())
    }, [])

    function toast(msg) {
        const id = Math.random().toString(36).slice(2);
        setToasts(t => [...t, { id, msg }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
    }

    function go(name) {
        setScreen(name);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleCategoryClick(value) {
        setSelected(value)
        setSearchText("");
        go("category-view");
    }

    function openVenue(id) {
        setSelectedVenueId(id);
        setDateIndex(0);
        go("venue");
    }

    function toggleCartItem(venue, dateLabel, hour) {
        const plan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId);
        const itemKey = `${venue.id}-${dateLabel}-${hour}`;
        const exists = cart.some(c => c.key === itemKey);

        if (exists) {
            setCart(cart.filter(c => c.key !== itemKey));
            toast(`Removed ${venue.name} (${hour}) from cart.`);
        } else {
            const finalPrice = Math.round(venue.price * (1 - plan.discount));
            setCart([...cart, {
                key: itemKey,
                venue,
                dateLabel,
                hour,
                originalPrice: venue.price,
                finalPrice,
                plan,
            }]);
            toast(`Added ${venue.name} (${hour}) to cart!`);
        }
    }

    function removeCartItem(key) {
        setCart(cart.filter(c => c.key !== key));
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

    const activeVenue = selected?.venues?.find(v => v.id === selectedVenueId);
    const visibleCategories = showAllServices ? categories : categories.slice(0, 4);

    console.log('activeVenue', activeVenue)
    return (
        <div className="mp-root min-h-screen flex flex-col justify-between">
            <GlobalStyle />

            <Navbar
                cartCount={cart.length}
                bookingsCount={confirmedBookings.length}
                user={user}
                onGo={go}
                onSignOut={() => setUser(null)}
                onOpenSignIn={() => signinRef.current?.showModal()}
            />

            <SigninModal ref={signinRef} onSignIn={(name) => { setUser(name); toast(`Welcome back, ${name}!`); }} />
            <ToastStack toasts={toasts} />

            {screen === "home" && (
                <div className="screen-anim flex-1">
                    <CategoryGrid
                        visibleCategories={visibleCategories}
                        showAllServices={showAllServices}
                        onToggleShowAll={() => setShowAllServices(!showAllServices)}
                        onCategoryClick={handleCategoryClick}
                    />
                </div>
            )}

            {screen === "category-view" && (
                <CategoryScreen
                    selected={selected}
                    categoryFilter={categoryFilter}
                    searchText={searchText}
                    setSearchText={setSearchText}
                    onGo={go}
                    onOpenVenue={openVenue}
                />
            )}

            {screen === "venue" && (
                <VenueScreen
                    activeVenue={activeVenue}
                    selectedPlanId={selectedPlanId}
                    setSelectedPlanId={setSelectedPlanId}
                    dateIndex={dateIndex}
                    setDateIndex={setDateIndex}
                    cart={cart}
                    onToggleCartItem={toggleCartItem}
                    onGo={go}
                />
            )}

            {screen === "cart" && (
                <CartScreen
                    cart={cart}
                    onRemoveCartItem={removeCartItem}
                    onCheckout={handleCheckout}
                    onGo={go}
                />
            )}

            {screen === "confirm" && (
                <ConfirmScreen
                    cart={cart}
                    form={form}
                    setForm={setForm}
                    formErrors={formErrors}
                    onFinalize={finalizeBookings}
                    onGo={go}
                />
            )}

            {screen === "success" && <SuccessScreen onGo={go} />}

            {screen === "my-bookings" && <MyBookingsScreen confirmedBookings={confirmedBookings} onGo={go} />}

            {/* <Footer onNavigate={handleCategoryClick} /> */}
        </div>
    );
}