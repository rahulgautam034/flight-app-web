import { Route, Routes } from "react-router-dom";
import Dashboard from "../components/user/dashboard/Dashboard";
import Login from "../components/login/Login"
import FlightDashboard from "../components/user/flight/FlightsDashboard"
import AddAirline from "../components/admin/add-airline/AddAirline"
import BookedTickets from "../components/user/booked-tickets/BookedTickets";
import BookingHistory from "../components/user/booking-history/BookingHistory";
import ManageAirline from "../components/admin/manage-airline/ManageAirline";
import BookTicket from "../components/user/book-flight/BookTicket";
import AdminDashboard from "../components/admin/admin-dashboard/AdminDashboard";
import { useEffect, useState } from "react";
import Report from "../components/admin/report/Report";
function Router() {
  const [role,updateRole] = useState();

  useEffect(()=> {
    const _role = localStorage.getItem("role")
    if(_role != role){
      updateRole(_role)
    }
  },role)

  return (
    <Routes>
      <Route path="/" element={role == "ADMIN" ? <AdminDashboard /> :<Dashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/flight-dashboard" element={<FlightDashboard />} />
      <Route path = "/add-flight" element = {<AddAirline />} />
      <Route path = "/booking-detail" element = {<BookedTickets />} />
      <Route path = "/booking-history" element = {<BookingHistory />} />
      <Route path = "/manage-airline" element = {<ManageAirline />} />
      <Route path = "/book-ticket" element = {<BookTicket />} />
      <Route path = "/report" element = {<Report />} />

    </Routes>
  );
}

export default Router;
