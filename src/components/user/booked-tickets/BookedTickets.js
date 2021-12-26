import axios from "axios";
import React, { useEffect, useState } from "react";
import { getUserDetails } from "../../services/AccountService";
import { BOOK_TICKET_API, CANCEL_TICKET_API } from "../../services/ApiService";
import { createHttpHeader, url } from "../../services/HttpService";
import "./BookedTickets.css";
import DownloadTicket from "../download-ticket/DownloadTicket";
import Loader from "../../../common/Loader";
import ViewModal from "./ViewModal";
function BookedTickets() {
  const [tickets, setTickets] = useState([]);
  let [count, setCount] = useState(0);
  const [ticket, setSelectedTicket] = useState({});
  const [loading, setLoading] = useState(false);


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
        setLoading(false);
        console.log("res", res);
        if (res.data && Array.isArray(res.data)) {
          const today = new Date();
          const tickets = res.data.filter(ticket=> new Date(ticket.date) >= today);
          setTickets(tickets);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("errr", err);
      });
  };

  const cancelTicket = (ticket) => {
    let txt = "";

    if (new Date(ticket.startDate) < new Date()) {
      return alert("not possible to cancel this ticket.");
    }

    if (window.confirm(`Are you sure you want to cancel the ticket`)) {
      txt = "yes";
    } else {
      txt = "no";
    }

    if (txt === "no") {
      return;
    }
    setLoading(true);
    axios
      .put(
        url + CANCEL_TICKET_API + "/" + ticket.pnrNumber,
        {},
        createHttpHeader()
      )
      .then((res) => {
        setLoading(false);
        console.log("res", res);
        if (res && res.data) {
          getTickets();
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("errr", err);
      });
  };

  const renderTickets = (ticket, i) => {
    return (
      <div id="booked_card_content" key={i}>
        <div class="row">
          <div class="col-xl-2 input_div">
            <span className={ticket.status == "booked" ? "booked" : "cancel"}>
              {ticket.status}
            </span>
          </div>
        </div>
        <div class="row">
          <div class="col-xl-2 input_div">
            <span>Pnr Number</span>
          </div>
          <div class="col-xl-2 input_div">
            <span>Flight No.</span>
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
          <div class="col-xl-3 button_div">
            <span>Action</span>
          </div>
        </div>
        <div class="row">
          <div class="col-xl-2 input_div">
            <label>{ticket.pnrNumber}</label>
          </div>
          <div class="col-xl-2 input_div">
            <label>{ticket.flightId}</label>
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
          <div class="col-xl-3 action_div">
            <button
              onClick={() => setSelectedTicket(ticket)}
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              className="btn btn-primary btn-lg btn-block custom"
            >
              View
            </button>
            <button className="btn btn-success btn-lg btn-block custom"
            data-bs-toggle="modal"
            data-bs-target="#downloadModal"
             onClick ={()=>setSelectedTicket(ticket)}>
              Download
            </button>

            {ticket.status == "booked" && (
              <button
                className="btn btn-danger btn-lg btn-block custom"
                data-toggle="modal"
                data-target=".bd-example-modal-lg"
                onClick={() => cancelTicket(ticket)}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      <DownloadTicket id ="downloadModal" ticket = {ticket}/>
      <ViewModal id="exampleModal" toggle="modal" ticket={ticket} />
      <div className="card col-12 ticket_card" id ="mypdf" >
        {loading && (
          <div className="text-center " id="loader">
            <Loader />
          </div>
        )}
        <div className="header">
          <h3>Booked Tickets</h3>
        </div>
        <div className="main_content_div">
          {tickets.length > 0 ? (
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
    </div>
  );
}

export default BookedTickets;
