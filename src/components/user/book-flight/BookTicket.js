import axios from "axios";
import {  useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../../common/Loader";
import { getUserDetails } from "../../services/AccountService";
import { BOOK_TICKET_API, FLIGHT_API } from "../../services/ApiService";
import { createHttpHeader, url } from "../../services/HttpService";
import "./BookTicket.css";
import UserDetail from "./UserDetail";
function BookTicket() {
  const [passengers, addPassenger] = useState([]);
  const [passengerName, setPassengerName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  // const [totalSeats, setTotalTickets] = useState(1);
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    sourceFlight,
    destinationFlight,
    startDate,
    tripType,
    returnDate,
    seatType,
    totalSeats
  } = state;

  const user = getUserDetails();
  const addPassengerInList = () => {
    if (passengers.length == totalSeats) {
      return alert("traveller already added.");
    } else if (passengerName.trim().length == 0) {
      return alert("Add Name of traveller.");
    } else if (age == "") {
      return alert("Add age of traveller.");
    } else if (gender == "") {
      return alert("Add gender of traveller.");
    }

    const passenger = {
      name: passengerName,
      age,
      gender,
    };
    passengers.push(passenger);
    addPassenger(passengers);
    setPassengerName("");
    setAge("");
    setGender("");
  };

  const deletePassenger = (i) => {
    let updatePassenger = [...passengers];
    updatePassenger.splice(i, 1);
    addPassenger(updatePassenger);
  };

  const clearValues = () => {
    let _passengers = [...passengers];
    _passengers = [];
    addPassenger(_passengers);
    setPassengerName("");
    setAge("");
    setGender("");
  };

  const updateFlight = (flightId) => {
    const config = {
      ...createHttpHeader(),
      params: {
        flightId,
        seats:totalSeats,
        seatType,
        totalSeats
      },
    };
    axios
      .put(url + FLIGHT_API, {}, config)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log("errr", err);
      });
  };

  const bookTicket = () => {
    let isTicketBooked = false;
    const ticketArr =
      tripType == "roundTrip"
        ? [{ ...sourceFlight }, { ...destinationFlight }]
        : [{ ...sourceFlight }];
    if (passengers.length == 0) {
      return alert("Please add atleast one traveller");
    } else if (passengers.length != totalSeats) {
      return alert("Please add all traveller");
    }

    ticketArr.forEach((ticket) => {
      setLoading(true);
      const ticketObj = {
        flightId: ticket.flightId,
        flightName: ticket.airLine,
        date: tripType == "roundTrip" ? returnDate : startDate,
        source: ticket.source,
        destination: ticket.destination,
        name: user.firstName + " " + user.lastName,
        email: user.userName,
        mealType: ticket.meal,
        startTime:ticket.startTime,
	      endTime:ticket.endTime,
        passengers: passengers,
        totalSeats,
      };
      console.log(ticketObj)

      axios
        .post(url + BOOK_TICKET_API, ticketObj, createHttpHeader())
        .then((res) => {
          setLoading(false);
          isTicketBooked = true;
          clearValues();
          console.log("res", res);
          updateFlight(ticket.flightId);
        })
        .catch((err) => {
          console.log("errr", err);
          setLoading(false);
        });
    });
    if (isTicketBooked) {
      alert("Ticket Booked Successfully.");
      navigate("/");
    }
  };

  const renderPassenger = (item, i) => {
    return (
      <tr key={i}>
        <td>{item.name}</td>
        <td>{item.age}</td>
        <td>{item.gender}</td>
        <td>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => deletePassenger(i)}
          >
            Remove
          </button>
        </td>
      </tr>
    );
  };
  return (
    <div className="card col-12" id="card">
      {loading && (
        <div className="text-center loader">
          <Loader />
        </div>
      )}
      <div className="header">
        <h3>Complete your booking</h3>
      </div>

      <div className="card_content">
        <div className="row">
          <div className=" row_main col-xl-8">
            <div className="internal_card_header">
              <h5>{sourceFlight.source}</h5>
              <div>
                <strong>{sourceFlight.airLine}</strong>
              </div>
              <h5>{sourceFlight.destination}</h5>
            </div>
            <div className="sub_card internal_card_header">
              <div className="card_schedule">
                <h5>{sourceFlight.startTime}</h5>
              </div>
              <div>
                <strong style={{ fontSize: "30px" }}>→</strong>
              </div>
              <h5>{sourceFlight.endTime}</h5>
            </div>
          </div>
          <div className=" row_main col-xl-3">
            <div className="internal_card_header">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Fare Summary</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Base Fair</th>
                    <td>
                      {tripType == "roundTrip"
                        ? Number(
                            sourceFlight.ticketCost +
                              destinationFlight.ticketCost
                          )
                        : sourceFlight.ticketCost}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Other Charges</th>
                    <td>0</td>
                  </tr>
                  <tr>
                    <th>Total Cost</th>
                    <td>
                      {tripType == "roundTrip"
                        ? Number(
                            sourceFlight.ticketCost +
                              destinationFlight.ticketCost
                          )
                        : sourceFlight.ticketCost}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {tripType == "roundTrip" && (
            <div className=" row_main col-xl-8">
              <div className="internal_card_header">
                <h5>{destinationFlight.source}</h5>
                <div>
                  <strong>{destinationFlight.airLine}</strong>
                </div>
                <h5>{destinationFlight.destination}</h5>
              </div>
              <div className="sub_card internal_card_header">
                <div className="card_schedule">
                  <h5>{destinationFlight.startTime}</h5>
                </div>
                <div>
                  <strong style={{ fontSize: "30px" }}>→</strong>
                </div>
                <h5>{destinationFlight.endTime}</h5>
              </div>
            </div>
          )}
          <div className="col-xl-8 passenger_card row">
            <h5>Traveller Details</h5>
            <div className="col-xl-4">
              <input
                placeholder="Name"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
              />
            </div>
            <div className="col-xl-4">
              <input
                type="number"
                min="1"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div
              className="btn-group col-xl-3"
              role="group"
              aria-label="Basic example"
            >
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setGender("male")}
              >
                Male
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setGender("female")}
              >
                Female
              </button>
            </div>
            <div
              className="btn-group col-xl-1"
              role="group"
              aria-label="Basic example"
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => addPassengerInList()}
              >
                Add
              </button>
            </div>
            {passengers.length > 0 && (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Age</th>
                    <th scope="col">Gender</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {passengers.map((item, i) => renderPassenger(item, i))}
                </tbody>
              </table>
            )}
          </div>

          <UserDetail
            email={user.userName}
            name={user.firstName + " " + user.lastName}
          />
          <div class="book_ticket_btn">
            <button
              type="button"
              className="btn btn-secondary add_button"
              onClick={() => bookTicket()}
            >
              Book Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookTicket;
