import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../../common/Loader";
import { getUserDetails } from "../../services/AccountService";
import { BOOK_TICKET_API } from "../../services/ApiService";
import { createHttpHeader, url } from "../../services/HttpService";
import "./BookingHistory.css";

function BookingHistory() {
  const [viewDetail, setViewDetail] = useState({});
  const [tickets, setTickets] = useState([]);
  let [count, setCount] = useState(0);
  let [loader, setLoading] = useState(0);

  useEffect(() => {
    if (count == 0) {
      setCount(1);
      getTickets();
    }
  });

  const getTickets = () => {
    setLoading(true);
    const user = getUserDetails();
    axios
      .get(url + BOOK_TICKET_API + "/" + user.userName, createHttpHeader())
      .then((res) => {
        console.log("res", res);
        setLoading(false);
        if (res.data && Array.isArray(res.data)) {
          setTickets(res.data);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("errr", err);
      });
  };

  const renderTickets = (ticket, i) => {
    return (
      <div id="history_card_content" key={i}>
         <div class="row">
          <div class="col-xl-2 input_div">
            <span className={ticket.status == "booked" ? "booked" : "cancel"}>
              {ticket.status}
            </span>
          </div>
        </div>
        <div class="row">
          <div class="col-xl-1 input_div">
            <span>Pnr Number</span>
          </div>
          <div class="col-xl-1 input_div">
            <span>Flight No.</span>
          </div>
          <div class="col-xl-1 input_div">
            <span>Start Time</span>
          </div>
          <div class="col-xl-1 input_div">
            <span>End Time</span>
          </div>
          <div class="col-xl-2 input_div">
            <span>Source</span>
          </div>
          <div class="col-xl-2 input_div">
            <span>Destination</span>
          </div>
          <div class="col-xl-1 input_div">
            <span>meal</span>
          </div>
          <div class="col-xl-1 input_div">
            <span>Date</span>
          </div>
          <div class="col-xl-2 button_div">
            <span>Travellers</span>
          </div>
        </div>
        <div class="row">
          <div class="col-xl-1 input_div">
            <label>{ticket.pnrNumber}</label>
          </div>
          <div class="col-xl-1 input_div">
            <label>{ticket.flightId}</label>
          </div>
          <div class="col-xl-1 input_div">
            <label>{ticket.startTime}</label>
          </div>
          <div class="col-xl-1 input_div">
            <label>{ticket.endTime}</label>
          </div>
          <div class="col-xl-2 input_div">
            <label>{ticket.source}</label>
          </div>
          <div class="col-xl-2 input_div">
            <label>{ticket.destination}</label>
          </div>
          <div class="col-xl-1 input_div">
            <label>{ticket.mealType}</label>
          </div>
          <div class="col-xl-1 input_div">
            <label>{ticket.date}</label>
          </div>
          <div class="col-xl-2 button_div">
            <strong>{ticket.totalSeats}</strong>
            <button
              onClick={() =>
                setViewDetail({
                  [ticket.pnrNumber]: !viewDetail[ticket.pnrNumber],
                })
              }
              className="btn btn-primary btn-lg btn-block custom"
            >
              View
            </button>
          </div>
          {viewDetail[ticket.pnrNumber] &&
            ticket.passengers.length > 0 &&
            ticket.passengers.map((item, i) => {
              return renderPassengers(item, i);
            })}
        </div>
      </div>
    );
  };

  const renderPassengers = (item, i) => {
    return (
      <table class="table table-bordered">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Gender</th>
            <th scope="col">Age</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{item.name}</td>
            <td>{item.age}</td>
            <td>{item.gender}</td>
          </tr>
        </tbody>
      </table>
    );
  };
  return (
    <div className="card col-12 history_card_main">
      <div className="header">
        <h3>Booked Tickets</h3>
      </div>
      {loader && (
        <div className="text-center " id="loader">
          <Loader />
        </div>
      )}
      <div className="main_content_div">
        {tickets && tickets.length > 0 ? (
          tickets.map((ticket, i) => {
            return renderTickets(ticket, i);
          })
        ) : (
          <div className="no_data">
            <h3>No Data Available</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingHistory;
