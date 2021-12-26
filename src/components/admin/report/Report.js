import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "../../../common/Loader";
import {
  ADD_OR_BLOCK_FLIGHT_API,
  DOWNLOAD_FILE,
  GET_APP_FLIGHTS_API,
} from "../../services/ApiService";
import { createHttpHeader, url } from "../../services/HttpService";
import "./Report.css";
import noImage from "../../../assests/noImage.png";
import DownloadTicket from "../../user/download-ticket/DownloadTicket";
import DownloadReportModal from "./DownloadReportModal";
function Report() {
  const [loading, setLoading] = useState(false);
  const [flights, updateArr] = useState([]);
  let [count, setCount] = useState(0);
  let [file, setFile] = useState({});
  const [flight, setSelectedFlight] = useState({});

  useEffect(() => {
    if (flights.length == 0 && count == 0) {
      getAirlines();
    }
  });

  const downloadLogo = (flightIds) => {
    console.log(flightIds);
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
          setFile(_file);
        }
      })
      .catch((err) => {
        console.log("errr", err);
      });
  };

  const getAirlines = () => {
    setCount(1);
    setLoading(true);
    axios
      .get(url + GET_APP_FLIGHTS_API, createHttpHeader())
      .then((res) => {
        console.log("res", res);
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const flightIds = res.data.map((flight) => flight.flightId).join();
          downloadLogo(flightIds);
          const today = new Date();
          const _flights = res.data.filter(
            (flight) => new Date(flight.endDate) > today
          );
          updateArr(_flights);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("errr", err);
        setLoading(false);
      });
  };

  const updateFlight = (flightId, type) => {
    let txt = "";
    if (window.confirm(`Are you sure you want to ${type} the flight`)) {
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
        url + ADD_OR_BLOCK_FLIGHT_API + "/" + flightId,
        {},
        createHttpHeader()
      )
      .then((res) => {
        console.log("res", res);
        setLoading(false);
        getAirlines();
      })
      .catch((err) => {
        console.log("errr", err);
        setLoading(false);
      });
  };

  return (
      <div>
    <DownloadReportModal id ="downloadModal" flight = {flight} logos = {file}/>

    <div className="card manage_card col-12">
      {loading && (
        <div className="text-center loader">
          <Loader />
        </div>
      )}
      <div className="header">
        <h3>Manage Flights</h3>
      </div>
      <div id="manage_card_content">
        {Array.isArray(flights) && flights.length > 0 ? (
          flights.map((flight) => (
            <div class="internal_card">
              <table class="table table-borderless">
                <thead class="thead-dark head">
                  <tr>
                    <th scope="col">Airline</th>
                    <th scope="col">flight Id</th>
                    <th scope="col">Soure</th>
                    <th scope="col">Destination</th>
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Total Seats</th>
                    <th scope="col">Ticket Cost</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div style={{ flexDirection: "row", display: "flex" }}>
                        <img
                          src={
                            file[flight.flightId]
                              ? file[flight.flightId]
                              : noImage
                          }
                          style={{
                            height: "3rem",
                            display: "block",
                            width: "3rem",
                            cursor: "pointer",
                          }}
                        />
                        <span>{flight.airLine}</span>
                      </div>
                    </td>
                    <td>{flight.flightId}</td>
                    <td>{flight.source}</td>
                    <td>{flight.destination}</td>
                    <td>{flight.startDate}</td>
                    <td>{flight.endDate}</td>
                    <td>
                      {flight.businessClassSeats + flight.nonBusinessClassSeats}
                    </td>
                    <td>{flight.ticketCost}</td>
                    <td>
                      <button
                        className="btn btn-success btn-block"
                        data-bs-toggle="modal"
                        data-bs-target="#downloadModal"
                        onClick={() => setSelectedFlight(flight)}
                      >
                        Download
                      </button>
                    </td>
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
    </div>
    </div>
  );
}

export default Report;
