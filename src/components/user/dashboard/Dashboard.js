import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Loader from "../../../common/Loader";
import { GET_APP_FLIGHTS_API, SEARCH_API } from "../../services/ApiService";
import { createHttpHeader, url } from "../../services/HttpService";
import { seatTypeArr } from "../../utils/AddAirlineArr";
import { dayMonth } from "../../utils/util";
import "./Dashboard.css";
import RouteTypes from "./RouteTypes";

function Dashboard() {
  const navigate = useNavigate();
  const [tripType, updateTrip] = useState("oneWay");
  const [source, updateSource] = useState();
  const [destination, updateDestination] = useState();
  const [startDate, updateStartDate] = useState("");
  const [returnDate, updateReturnDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [seatType, updateSeatType] = useState(seatTypeArr[0]);
  const [totalSeats, updateTotalSeats] = useState(1);
  const [sourceArr, updateSourceArr] = useState([]);
  const [destArr, updateDestArr] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count == 0) {
      setCount(1)
      getAllFlights();
    }
  });

  const getAllFlights = () => {
    setLoading(true);
    axios
      .get(url + GET_APP_FLIGHTS_API, createHttpHeader())
      .then((res) => {
        console.log("res", res);
        setLoading(false);
        if (Array.isArray(res.data) && res.data.length > 0) {
          const _sourceArr = [
            ...new Set(res.data.map((flight) => flight.source)),
          ];
          const _destArr = [
            ...new Set(res.data.map((flight) => flight.destination)),
          ];
          updateSourceArr(_sourceArr);
          updateDestArr(_destArr);
          updateSource(_sourceArr[0]);
          updateDestination(_destArr[0]);
        }
      })
      .catch((err) => {
        console.log("errr", err);
        setLoading(false);
      });
  };

  const getFlights = () => {
    if (source === destination) {
      return alert("source and destination are same.");
    } else if (startDate.length == 0) {
      return alert("Please select departure date.");
    } else if (returnDate.length == 0 && tripType == "roundTrip") {
      return alert("Please select return date.");
    }
    setLoading(true);
    let config = {
      ...createHttpHeader(),
      params: { source, destination, date: startDate, seatType },
    };

    axios
      .get(url + SEARCH_API, config)
      .then((res) => {
        setLoading(false);
        console.log("resssss", res);
        const filterFlights =
          res.data &&
          Array.isArray(res.data) &&
          res.data.filter((flight) =>
            seatType == "Economy"
              ? flight.nonBusinessClassSeats >= totalSeats
              : flight.businessClassSeats >= totalSeats
          );
        if (filterFlights.length > 0) {
          if (tripType == "oneWay" && filterFlights) {
            navigate("/flight-dashboard", {
              state: {
                departureFlights: filterFlights,
                returnFlights: [],
                source,
                destination,
                startDate,
                tripType,
                seatType,
                totalSeats,
              },
            });
          } else {
            searchReturnFlights(filterFlights);
          }
        } else {
          return alert("no Flight available of this route.");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("errrr", err);
      });
  };

  const searchReturnFlights = (departureFlights) => {
    setLoading(true);
    let config = {
      ...createHttpHeader(),
      params: {
        destination: source,
        source: destination,
        date: returnDate,
        seatType,
      },
    };
    axios
      .get(url + SEARCH_API, config)
      .then((res) => {
        setLoading(false);
        const filterFlights =
          Array.isArray(res.data) &&
          res.data.length > 0 &&
          res.data.filter((flight) =>
            seatType == "Economy"
              ? flight.nonBusinessClassSeats >= totalSeats
              : flight.businessClassSeats >= totalSeats
          );
        if (
          Array.isArray(departureFlights) &&
          departureFlights.length > 0 &&
          filterFlights.length > 0
        ) {
          navigate("/flight-dashboard", {
            state: {
              departureFlights,
              returnFlights: filterFlights,
              source,
              destination,
              startDate,
              tripType,
              returnDate,
              seatType,
              totalSeats,
            },
          });
        } else {
          alert("no Flight available of this route.");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("errrr", err);
      });
  };

  const setMinStartDate = () => {
    var today = new Date();
    var dd = dayMonth(today.getDate());
    var mm = dayMonth(today.getMonth() + 1); //January is 0 so need to add 1 to make it 1!
    var yyyy = today.getFullYear();

    return yyyy + "-" + mm + "-" + dd;
  };
  const setMinEndDate = () => {
    var d = new Date(startDate);
    var dd = dayMonth(d.getDate());
    var mm = dayMonth(d.getMonth() + 1); //January is 0 so need to add 1 to make it 1!
    var yyyy = d.getFullYear();

    return yyyy + "-" + mm + "-" + dd;
  };
  return (
    <div className="card col-12">
      {loading && (
        <div className="text-center loader">
          <Loader />
        </div>
      )}
      <div className="header">
        <h2>Search Flights</h2>
      </div>
      <div className="card main">
        <div className="card-body">
          <RouteTypes onChangeHandler={(value) => updateTrip(value)} />
          <div className="input_area row">
            <div className="new-expense__control col-xl-6">
              <label>FROM</label>
              <select
                value={source}
                className="form-control"
                onChange={(e) => updateSource(e.target.value)}
              >
                {sourceArr.length > 0 &&
                  sourceArr.map((item, i) => {
                    return <option key={i}>{item}</option>;
                  })}
              </select>
            </div>
            <div className="new-expense__control col-xl-6">
              <label>TO</label>
              <select
                value={destination}
                className="form-control"
                onChange={(e) => updateDestination(e.target.value)}
              >
                {destArr.length > 0 &&
                  destArr.map((item, i) => {
                    if (item == source) return;
                    return <option key={i}>{item}</option>;
                  })}
              </select>
            </div>
          </div>

          <div className="input_area row">
            <div className="new-expense__control col-xl-6">
              <label>DEPARTURE</label>
              <input
                min={setMinStartDate()}
                type="date"
                onChange={(e) => updateStartDate(e.target.value)}
              />
            </div>
            <div className="new-expense__control col-xl-6">
              <label>Class Type</label>
              <select
                value={seatType}
                className="form-control"
                onChange={(e) => updateSeatType(e.target.value)}
              >
                {seatTypeArr.map((item, i) => (
                  <option key={i}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="input_area row">
            <div className="new-expense__control col-xl-6">
              <label>passengers</label>
              <input
                min="1"
                type="number"
                value={totalSeats}
                onChange={(e) => updateTotalSeats(e.target.value)}
              />
            </div>
            {tripType == "roundTrip" && (
              <div className="new-expense__control col-xl-6">
                <label>RETURN</label>
                <input
                  min={setMinEndDate()}
                  type="date"
                  value={returnDate}
                  onChange={(e) => updateReturnDate(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="d-grid gap-2 col-6 mx-auto">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => getFlights()}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
