import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../../assests/logo.jpeg";
import "./Report.css";

function DownloadReportModal(props) {
  const { flight, logos } = props;
  const downloadTicket = () => {
    const domElement = document.getElementById("myImage");
    html2canvas(domElement, {
      onclone: (document) => {},
    }).then((canvas) => {
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(img, "JPEG", 15, 0, 180, 180);
      pdf.save(flight.flightId + ".pdf");
    });
  };
  return (
    <div
      className="modal fade"
      id={props.id}
      aria-hidden="true"
      aria-labelledby="exampleModalToggleLabel"
      tabIndex="-1"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalToggleLabel">
              Download Ticket
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body modal-main" id="myImage">
            <img
              src={logos[flight.flightId] || logo}
              className="img"
              href="#"
            />
            <table class="table table-bordered ticket_table">
              <thead>
                <tr>
                  <th scope="col">Airline</th>
                  <td>{flight.airLine}</td>
                </tr>
                <tr>
                  <th scope="col">Flight No.</th>
                  <td>{flight.flightId}</td>
                </tr>
                <tr>
                  <th scope="col">Source</th>
                  <td>{flight.source}</td>
                </tr>
                <tr>
                  <th scope="col">Destination</th>
                  <td>{flight.destination}</td>
                </tr>
                <tr>
                  <th scope="col">Meal</th>
                  <td>{flight.meal}</td>
                </tr>
                <tr>
                  <th scope="col">Start Date</th>
                  <td>{flight.startDate}</td>
                </tr>
                <tr>
                  <th scope="col">End Date</th>
                  <td>{flight.endDate}</td>
                </tr>
                <tr>
                  <th scope="col">Start Time</th>
                  <td>{flight.startTime}</td>
                </tr>
                <tr>
                  <th scope="col">End Time</th>
                  <td>{flight.endTime}</td>
                </tr>
                <tr>
                  <th scope="col">Amount</th>
                  <td>{flight.ticketCost}</td>
                </tr>
                <tr>
                  <th scope="col">Status</th>
                  <td>{flight.status}</td>
                </tr>
                <tr>
                  <th scope="col">Total Rows</th>
                  <td>{flight.totalRows}</td>
                </tr>
              </thead>
            </table>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-primary"
              onClick={() => downloadTicket()}
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DownloadReportModal;
