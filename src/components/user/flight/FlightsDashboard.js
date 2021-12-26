import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../../common/Loader";
import {
  getUser,
  getUserDetails,
  isUserAuthenticated,
} from "../../services/AccountService";
import { DOWNLOAD_FILE, USER_LOGIN_API } from "../../services/ApiService";
import { createHttpHeader, setToken, url } from "../../services/HttpService";
import "./FlightsDashboard.css";
import LoginModal from "./LoginModal";
import noImage from "../../../assests/noImage.png"


function FlightsDashboard() {
  const navigate = useNavigate();
  const [sourceFlight, updateSourceFlight] = useState({});
  const [destinationFlight, updateDestinationFlight] = useState({});
  const [flight, updateFlight] = useState(true);
  const [loading, setLoading] = useState(false);
  const [file, updateLogo] = useState({});
  const [count, setCount] = useState(0);

  const { state } = useLocation();
  const {
    departureFlights,
    returnFlights,
    source,
    destination,
    startDate,
    tripType,
    returnDate,
    seatType,
    totalSeats,
  } = state;



  const downloadLogo = () => {
    const arr = [...departureFlights, ...returnFlights];
    console.log(arr)
    const flightIds = arr.map((flight) => flight.flightId).join();
    const config = {
      ...createHttpHeader(),
      params: {
        flightIds: flightIds,
      },
    };
    axios
      .get(url + DOWNLOAD_FILE, config)
      .then((res) => {
        console.log("res", res);
        let _file = {};
        if (
          res.status == 200 &&
          res.data &&
          Array.isArray(res.data) &&
          res.data.length > 0
        ) {
          res.data.forEach((file) => {
            _file[file.flightId] = `data:image/png;base64, ${file.img}`;
          });
          updateLogo(_file);
        }
      })
      .catch((err) => {
        console.log("errr", err);
      });
  };

  useState(()=> {
    if(count == 0){
      setCount(1);
      downloadLogo()

    }
  })

  const changeSourceFlight = (flight) => {
    let updateFlights = { ...sourceFlight };
    if (!updateFlights.flightId || updateFlights.flightId != flight.flightId) {
      updateFlights = {};
      updateFlights = flight;
    }
    updateSourceFlight(updateFlights);
    console.log(sourceFlight, destinationFlight);
  };

  const changeDestinationFlight = (flight) => {
    let updateFlights = { ...destinationFlight };
    if (!updateFlights.flightId || updateFlights.flightId != flight.flightId) {
      updateFlights = {};
      updateFlights = flight;
    }
    updateDestinationFlight(updateFlights);
  };

  const bookTicket = (flight) => {
    if (tripType == "roundTrip") {
      if (Object.keys(sourceFlight).length == 0) {
        return alert("Select source flight first.");
      } else if (
        tripType == "roundTrip" &&
        Object.keys(destinationFlight).length == 0
      ) {
        return alert("Select destination flight first.");
      }
    }

    if (tripType == "oneWay") {
      navigate("/book-ticket", {
        state: {
          sourceFlight: flight,
          startDate,
          destinationFlight: {},
          tripType,
          returnDate,
          seatType,
          totalSeats,
        },
      });
    } else {
      navigate("/book-ticket", {
        state: {
          sourceFlight,
          destinationFlight,
          tripType,
          returnDate,
          seatType,
          totalSeats,
        },
      });
    }
  };

  const login = (credentials) => {
    setLoading(true);
    axios
      .post(url + USER_LOGIN_API, credentials)
      .then((res) => {
        console.log("res", res.data);
        if (res.status == 200 && res.data) {
          setToken(res.data.token);
          getUser({
            userName: credentials.username,
            role: "USER",
            callBack: (res) => {
              bookTicket(flight);
            },
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("err", err);
        alert("Inavalid Credentials");
      });
  };
  return (
    <div>
      <LoginModal
        id="exampleModal"
        toggle="modal"
        onSubmit={(credentials) => login(credentials)}
      />

      <div class="card col-12 dashboard_ticket_card">
        {loading && (
          <div className="text-center " id="dashboard_loader">
            <Loader />
          </div>
        )}
        <div className="header">
          <h3>Searched Flights</h3>
          {tripType == "roundTrip" && (
            <div className="d-grid gap-2 col-2 ">
              {isUserAuthenticated() ? (
                <button
                  className="btn btn-secondary "
                  type="button"
                  onClick={() => bookTicket()}
                >
                  Book
                </button>
              ) : (
                <button
                  disabled={
                    Object.keys(sourceFlight).length == 0 ||
                    Object.keys(destinationFlight).length == 0
                  }
                  className="btn btn-secondary "
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Book
                </button>
              )}
            </div>
          )}
        </div>
        <div className="row main_div">
          <div
            className={`table_main_div ${
              tripType == "roundTrip" ? "col-xl-6" : "col-xl-12"
            }`}
          >
            {Array.isArray(departureFlights) && departureFlights.length > 0 ? (
              departureFlights.map((flight, i) => (
                <div
                  class={`internal_card ${
                    sourceFlight.flightId == flight.flightId
                      ? "selectedCard"
                      : ""
                  }`}
                  key={i}
                  onClick={() =>
                    tripType == "roundTrip" ? changeSourceFlight(flight) : {}
                  }
                >
                  <h5 className="ticket_card_header">{`${source} → ${destination} `}</h5>
                  <table
                    class="table table-borderless"
                    id={
                      sourceFlight.flightId == flight.flightId
                        ? "selected_table"
                        : ""
                    }
                  >
                    <thead class="thead-dark">
                      <tr>
                        <th scope="col">Airline</th>
                        <th scope="col">Start Time</th>
                        <th scope="col">End Time</th>
                        <th scope="col">Ticket Cost</th>
                        <th scope="col">Meal</th>
                        {tripType != "roundTrip" && <th scope="col">Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className ="row_div_flight">
                              <img
                              src={file[flight.flightId] ? file[flight.flightId] : noImage}
                                style={{
                                  height: "3rem",
                                  display: "block",
                                  width: "3rem",
                                  cursor: "pointer",
                                }}
                              />
                          {flight.airLine}{" "}
                            </div>
                        </td>
                        <td>{flight.startTime}</td>
                        <td>{flight.endTime}</td>
                        <td>{flight.ticketCost}</td>
                        <td>{flight.meal}</td>
                        {tripType != "roundTrip" && (
                          <td>
                            {isUserAuthenticated() ? (
                              <button
                                className="btn btn-outline-success"
                                id="button"
                                type="button"
                                onClick={() => bookTicket(flight)}
                              >
                                Book Now
                              </button>
                            ) : (
                              <button
                                className="btn btn-outline-success"
                                id="button"
                                type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                onClick={() => updateFlight(flight)}
                              >
                                Book Now
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              <div className="no_data">
                <h3>No Data Available</h3>
              </div>
            )}
          </div>
          {tripType == "roundTrip" && (
            <div className="table_main_div col-xl-6">
              {Array.isArray(returnFlights) && returnFlights.length > 0 ? (
                returnFlights.map((flight, i) => (
                  <div
                    class={`internal_card ${
                      destinationFlight.flightId == flight.flightId
                        ? "selectedCard"
                        : ""
                    }`}
                    key={i}
                    onClick={() => changeDestinationFlight(flight)}
                  >
                    <h5 className="ticket_card_header">{`${destination} → ${source} `}</h5>
                    <table
                      class="table table-borderless"
                      id={
                        destinationFlight.flightId == flight.flightId
                          ? "selected_table"
                          : ""
                      }
                    >
                      <thead class="thead-dark">
                        <tr>
                          <th scope="col">Airline</th>
                          <th scope="col">Start Time</th>
                          <th scope="col">End Time</th>
                          <th scope="col">Ticket Cost</th>
                          <th scope="col">Meal</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className = "row_div_flight">
                              <img
                              src={file[flight.flightId] ? file[flight.flightId] : noImage}
                                style={{
                                  height: "3rem",
                                  display: "block",
                                  width: "3rem",
                                  cursor: "pointer",
                                }}
                              />
                            {flight.airLine}
                            </div>
                          </td>
                          <td>{flight.startTime}</td>
                          <td>{flight.endTime}</td>
                          <td>{flight.ticketCost}</td>
                          <td>{flight.meal}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))
              ) : (
                <div className="no_data">
                  <h3>No Data Available</h3>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FlightsDashboard;
