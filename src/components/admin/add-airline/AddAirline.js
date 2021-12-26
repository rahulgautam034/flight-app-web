import "./AddAirline.css";
import axios from "axios";
import React from "react";
import {
  ADD_OR_BLOCK_FLIGHT_API,
  UPLOAD_FILE,
} from "../../services/ApiService";
import { createHttpHeader } from "../../services/HttpService";
import { url } from "../../services/HttpService";
import { destArr, mealType, sourceArr } from "../../utils/AddAirlineArr";
import { dayMonth } from "../../utils/util";
import Loader from "../../../common/Loader";

export default class AddAirline extends React.PureComponent {
  state = {
    loading: false,
    airLine: "",
    source: sourceArr[0],
    destination: destArr[0],
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    instrumentUsed: "",
    businessClassSeats: "",
    nonBusinessClassSeats: "",
    ticketCost: "",
    totalRows: "",
    meal: mealType[0],
    file: {},
  };

  clearValues() {
    this.setState({
      airLine: "",
      source: "",
      destination: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      instrumentUsed: "",
      businessClassSeats: "",
      nonBusinessClassSeats: "",
      ticketCost: "",
      totalRows: "",
      meal: "",
    });
  }

  addFlight = () => {
    const {
      airLine,
      source,
      destination,
      startDate,
      endDate,
      startTime,
      endTime,
      instrumentUsed,
      businessClassSeats,
      nonBusinessClassSeats,
      ticketCost,
      totalRows,
      meal,
    } = this.state;
    if (
      airLine.length == 0 ||
      startDate.length == 0 ||
      endDate.length == 0 ||
      startTime.length == 0 ||
      endTime.length == 0 ||
      instrumentUsed.length == 0 ||
      businessClassSeats.length == 0 ||
      nonBusinessClassSeats.length == 0 ||
      ticketCost.length == 0 ||
      totalRows.length == 0 ||
      meal.length == 0
    ) {
      return alert("Please fill all * fields");
    }
    this.setState({ loading: true });

    const flightDto = {
      airLine,
      source,
      destination,
      startDate,
      endDate,
      startTime,
      endTime,
      instrumentUsed,
      businessClassSeats,
      nonBusinessClassSeats,
      ticketCost,
      totalRows,
      meal,
    };
    console.log(flightDto)

    let config = createHttpHeader();
    axios
      .post(url + ADD_OR_BLOCK_FLIGHT_API, flightDto, config)
      .then((res) => {
        console.log("res", res);
        if (res.data && res.data.flightId) {
          if (this.state.file.name) {
            this.uploadFile(res.data.flightId);
          }
          alert("Flight add successfully.");
          this.clearValues();
        } else {
          alert("error while adding new airline.");
        }
        this.setState({ loading: false });
      })
      .catch((err) => {
        console.log("errrr", err);
        this.setState({ loading: false });
      });
  };

  setMinStartDate = () => {
    var today = new Date();
    var dd = dayMonth(today.getDate());
    var mm = dayMonth(today.getMonth() + 1); //January is 0 so need to add 1 to make it 1!
    var yyyy = today.getFullYear();

    return yyyy + "-" + mm + "-" + dd;
  };
  setMinEndDate = () => {
    var d = new Date(this.state.startDate);
    var dd = dayMonth(d.getDate());
    var mm = dayMonth(d.getMonth() + 1); //January is 0 so need to add 1 to make it 1!
    var yyyy = d.getFullYear();

    return yyyy + "-" + mm + "-" + dd;
  };

  onFileChange = (e) => {
    const image = e.target.files[0];
    this.setState({ file: image });
  };

  uploadFile = (flightId) => {
    const formdata = new FormData();
    formdata.append("file", this.state.file);
    const config = {
      ...createHttpHeader(),
      params: { flightId },
    };
    axios
      .post(url + UPLOAD_FILE, formdata, config)
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        console.log("errrr", err);
        this.setState({ loading: false });
      });
  };

  render() {
    const {
      airLine,
      source,
      destination,
      startDate,
      endDate,
      startTime,
      endTime,
      instrumentUsed,
      businessClassSeats,
      nonBusinessClassSeats,
      ticketCost,
      totalRows,
      meal,
    } = this.state;
    return (
      <div className="card col-12" id="card_main">
        {this.state.loading && (
          <div className="text-center loader">
            <Loader />
          </div>
        )}
        <div className="header">
          <h3>Add New Flight</h3>
          <div className="d-grid gap-2 col-2 ">
            <button
              className="btn btn-secondary "
              type="button"
              onClick={() => this.addFlight()}
            >
              Add Flight
            </button>
          </div>
        </div>
        <div id="card_content" className="col-12">
          <form className="form ">
            <div className="form-row form_main">
              <div className="col">
                <label>
                  Airline <span className="mandatory_symbol">*</span>
                </label>
                <input
                  value={airLine}
                  type="text"
                  className="form-control"
                  placeholder="Airline"
                  onChange={(e) => this.setState({ airLine: e.target.value })}
                />
              </div>
              <div className="col">
                <label>Source </label>
                <select
                  value={source}
                  className="form-control"
                  onChange={(e) => this.setState({ source: e.target.value })}
                >
                  {sourceArr.map((item) => (
                    <option>{item}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row form_main">
              <div className="col">
                <label>Destination</label>
                <select
                  value={destination}
                  className="form-control"
                  onChange={(e) =>
                    this.setState({ destination: e.target.value })
                  }
                >
                  {destArr.map((item) => (
                    <option>{item}</option>
                  ))}
                </select>
              </div>
              <div className="col">
                <label>
                  Start Date <span className="mandatory_symbol">*</span>
                </label>
                <input
                  value={startDate}
                  min={this.setMinStartDate()}
                  type="date"
                  className="form-control"
                  placeholder="Start Date"
                  onChange={(e) => this.setState({ startDate: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row form_main">
              <div className="col">
                <label>
                  End Date <span className="mandatory_symbol">*</span>
                </label>
                <input
                  value={endDate}
                  min={this.setMinEndDate()}
                  type="date"
                  className="form-control"
                  placeholder="End Date"
                  onChange={(e) => this.setState({ endDate: e.target.value })}
                />
              </div>
              <div className="col">
                <label>
                  Start Time <span className="mandatory_symbol">*</span>
                </label>
                <input
                  value={startTime}
                  type="time"
                  className="form-control"
                  placeholder="End Date"
                  onChange={(e) => this.setState({ startTime: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row form_main">
              <div className="col">
                <label>
                  End Time <span className="mandatory_symbol">*</span>
                </label>
                <input
                  value={endTime}
                  type="time"
                  className="form-control"
                  placeholder="End Date"
                  onChange={(e) => this.setState({ endTime: e.target.value })}
                />
              </div>
              <div className="col">
                <label>
                  Business Class Seats{" "}
                  <span className="mandatory_symbol">*</span>
                </label>
                <input
                  min="1"
                  value={businessClassSeats}
                  type="number"
                  className="form-control"
                  placeholder=""
                  onChange={(e) =>
                    this.setState({ businessClassSeats: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-row form_main">
              <div className="col">
                <label>
                  Economy Class Seats{" "}
                  <span className="mandatory_symbol">*</span>
                </label>
                <input
                  min="1"
                  value={nonBusinessClassSeats}
                  type="number"
                  className="form-control"
                  placeholder=""
                  onChange={(e) =>
                    this.setState({ nonBusinessClassSeats: e.target.value })
                  }
                />
              </div>
              <div className="col">
                <label>
                  Ticket Cost <span className="mandatory_symbol">*</span>
                </label>
                <input
                  value={ticketCost}
                  min="1"
                  type="number"
                  className="form-control"
                  placeholder=""
                  onChange={(e) =>
                    this.setState({ ticketCost: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-row form_main">
              <div className="col">
                <label>
                  Total Rows <span className="mandatory_symbol">*</span>
                </label>
                <input
                  value={totalRows}
                  min="1"
                  type="number"
                  className="form-control"
                  placeholder=""
                  onChange={(e) => this.setState({ totalRows: e.target.value })}
                />
              </div>
              <div className="col">
                <label>
                  Meal Type <span className="mandatory_symbol">*</span>
                </label>
                <select
                  value={meal}
                  className="form-control"
                  onChange={(e) => this.setState({ meal: e.target.value })}
                >
                  {mealType.map((item) => (
                    <option>{item}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row form_main">
              <div className="col">
                <label>
                  Instrument Used <span className="mandatory_symbol">*</span>
                </label>
                <input
                  value={instrumentUsed}
                  type="text"
                  className="form-control"
                  placeholder=""
                  onChange={(e) =>
                    this.setState({ instrumentUsed: e.target.value })
                  }
                />
              </div>
              <div className="col">
                <label>Upload Logo</label>
                <input
                  type="file"
                  className="form-control"
                  placeholder=""
                  onChange={(e) => this.onFileChange(e)}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
