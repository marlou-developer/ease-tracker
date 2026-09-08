import React, { useState } from 'react';
import { 
  FiHome, FiShoppingCart, FiCalendar, 
  FiMenu, FiBell, FiSearch, FiPlus, FiMinus, 
  FiMapPin, FiClock, FiCreditCard
} from 'react-icons/fi';
import { MdOutlineCalculate } from 'react-icons/md';

// --- MOCK DATA ---
const FOOD_ITEMS = [
  { id: 1, name: 'Classic Burger', price: 8.99, category: 'Food' },
  { id: 2, name: 'Margherita Pizza', price: 12.50, category: 'Food' },
  { id: 3, name: 'Iced Latte', price: 4.50, category: 'Beverage' },
  { id: 4, name: 'Caesar Salad', price: 7.99, category: 'Food' },
  { id: 5, name: 'Fries', price: 3.99, category: 'Sides' },
  { id: 6, name: 'Craft Beer', price: 6.00, category: 'Beverage' },
];

const SPORTS_FACILITIES = ['Tennis Court 1', 'Basketball Indoor', 'Swimming Pool Lane A', 'Futsal Pitch'];
const HOTEL_ROOMS = ['Deluxe Suite', 'Standard Double', 'Ocean View King', 'Economy Single'];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-800 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col transition-all duration-300 hidden md:flex">
        <div className="p-6 text-2xl font-bold tracking-wider text-blue-400 border-b border-slate-800">
          OMNI<span className="text-white">SUITE</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<FiHome size={20} />} label="Dashboard" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<MdOutlineCalculate size={20} />} label="POS System" isActive={activeTab === 'pos'} onClick={() => setActiveTab('pos')} />
          <NavItem icon={<FiShoppingCart size={20} />} label="Food & Orders" isActive={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
          <NavItem icon={<FiCalendar size={20} />} label="Bookings" isActive={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} />
        </nav>
        <div className="p-4 border-t border-slate-800 text-sm text-slate-400">
          © 2026 OmniSuite Inc.
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-500 hover:text-gray-700">
              <FiMenu size={24} />
            </button>
            <div className="relative hidden sm:block">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <FiBell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                AD
              </div>
              <span className="font-medium text-sm hidden sm:block">Admin User</span>
            </div>
          </div>
        </header>

        {/* DYNAMIC CONTENT AREA */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'dashboard' && <DashboardModule />}
          {activeTab === 'pos' && <POSModule />}
          {activeTab === 'orders' && <OrdersModule />}
          {activeTab === 'bookings' && <BookingsModule />}
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function DashboardModule() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Today's Sales" value="$4,250" trend="+12%" color="bg-blue-500" />
        <StatCard title="Active Bookings" value="142" trend="+5%" color="bg-emerald-500" />
        <StatCard title="Pending Orders" value="28" trend="-2%" color="bg-orange-500" />
        <StatCard title="Available Rooms" value="15" trend="Steady" color="bg-purple-500" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <FiCreditCard size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Order #{1040 + i}</p>
                    <p className="text-xs text-gray-500">2 mins ago</p>
                  </div>
                </div>
                <span className="font-bold">${(Math.random() * 100).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
      <h3 className="text-gray-500 font-medium text-sm">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <span className={`text-xs font-semibold ${trend.includes('+') ? 'text-green-500' : trend.includes('-') ? 'text-red-500' : 'text-gray-400'}`}>
        {trend} from yesterday
      </span>
    </div>
  );
}

function POSModule() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <div className="flex h-full gap-6 animate-fade-in">
      {/* ITEMS GRID */}
      <div className="flex-1 flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex gap-2 mb-4">
          {['All', 'Food', 'Beverage', 'Sides'].map(cat => (
            <button key={cat} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-20">
          {FOOD_ITEMS.map(item => (
            <div 
              key={item.id} 
              onClick={() => addToCart(item)}
              className="border border-gray-200 p-4 rounded-xl cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group flex flex-col justify-between h-32"
            >
              <h3 className="font-semibold text-gray-700 group-hover:text-blue-600">{item.name}</h3>
              <p className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CURRENT TICKET / CART */}
      <div className="w-96 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
          <h2 className="font-bold text-lg">Current Ticket</h2>
          <p className="text-xs text-gray-500">Order #1045</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">Cart is empty</div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                  <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-white rounded"><FiMinus size={14}/></button>
                  <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-white rounded shadow-sm"><FiPlus size={14}/></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-between text-sm mb-2 text-gray-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm mb-4 text-gray-500"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
          <div className="flex justify-between text-xl font-bold mb-4"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <button 
            disabled={cart.length === 0}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Pay ${total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}

function OrdersModule() {
  return (
    <div className="animate-fade-in bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Online & Delivery Orders</h1>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm">Active</button>
           <button className="px-4 py-2 hover:bg-gray-50 text-gray-600 rounded-lg font-medium text-sm">Completed</button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 text-sm">
              <th className="py-3 px-4 font-medium">Order ID</th>
              <th className="py-3 px-4 font-medium">Customer</th>
              <th className="py-3 px-4 font-medium">Type</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Total</th>
              <th className="py-3 px-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 font-semibold text-sm">#ORD-90{i}</td>
                <td className="py-4 px-4 text-sm">
                  <p className="font-medium">John Doe {i}</p>
                  <p className="text-xs text-gray-400">123 Main St, City</p>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-700">
                    <FiMapPin size={12}/> Delivery
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-700">Preparing</span>
                </td>
                <td className="py-4 px-4 font-bold text-sm">$34.50</td>
                <td className="py-4 px-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Update Status</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BookingsModule() {
  const [bookingType, setBookingType] = useState('hotel');

  return (
    <div className="animate-fade-in flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Booking Management</h1>
        <div className="bg-gray-200 p-1 rounded-xl flex gap-1">
          <button 
            onClick={() => setBookingType('hotel')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${bookingType === 'hotel' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Hotel Rooms
          </button>
          <button 
            onClick={() => setBookingType('sports')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${bookingType === 'sports' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Sports Facilities
          </button>
        </div>
      </div>

      <div className="flex gap-6 h-full">
        {/* NEW BOOKING FORM */}
        <div className="w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4">New {bookingType === 'hotel' ? 'Room' : 'Facility'} Booking</h2>
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select {bookingType === 'hotel' ? 'Room' : 'Facility'}</label>
              <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                {(bookingType === 'hotel' ? HOTEL_ROOMS : SPORTS_FACILITIES).map((item, idx) => (
                  <option key={idx} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" className="w-full p-2 border border-gray-300 rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time / Nights</label>
                <input type="text" placeholder={bookingType === 'hotel' ? 'e.g., 2 Nights' : 'e.g., 14:00 - 16:00'} className="w-full p-2 border border-gray-300 rounded-lg outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input type="text" placeholder="John Doe" className="w-full p-2 border border-gray-300 rounded-lg outline-none" />
            </div>
            <button className="w-full py-3 mt-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-colors">
              Confirm Booking
            </button>
          </form>
        </div>

        {/* SCHEDULE VIEW */}
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Today's Schedule</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                    <FiClock size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {bookingType === 'hotel' ? HOTEL_ROOMS[i-1] : SPORTS_FACILITIES[i-1]}
                    </h3>
                    <p className="text-sm text-gray-500">Booked by: Sarah Smith</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{bookingType === 'hotel' ? 'Check-in: 14:00' : '10:00 AM - 12:00 PM'}</p>
                  <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Confirmed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}