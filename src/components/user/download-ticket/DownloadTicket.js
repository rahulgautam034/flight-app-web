import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../../assests/logo.jpeg";
import "./DownloadTicket.css";
function DownloadTicket(props) {
  const { ticket } = props;
  const downloadTicket = () => {
    const domElement = document.getElementById("myImage");
    html2canvas(domElement, {
      onclone: (document) => {},
    }).then((canvas) => {
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(img, "JPEG", 15, 0, 180, 180);
      pdf.save(ticket.pnrNumber + ".pdf");
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
            <img src={logo} className="img" href="#" />
            <table class="table table-bordered ticket_table">
              <thead>
                <tr>
                  <th scope="col">Pnr Number</th>
                  <td>{ticket.pnrNumber}</td>
                </tr>
                <tr>
                  <th scope="col">Flight Name</th>
                  <td>{ticket.flightName}</td>
                </tr>
                <tr>
                  <th scope="col">Flight No.</th>
                  <td>{ticket.flightId}</td>
                </tr>
                <tr>
                  <th scope="col">Source</th>
                  <td>{ticket.source}</td>
                </tr>
                <tr>
                  <th scope="col">Destination</th>
                  <td>{ticket.destination}</td>
                </tr>
                <tr>
                  <th scope="col">Meal</th>
                  <td>{ticket.mealType}</td>
                </tr>
                <tr>
                  <th scope="col">Date</th>
                  <td>{ticket.date}</td>
                </tr>
              </thead>
            </table>
            <div>
              <h5>Passengers</h5>
              <div className="report_passenger_div">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Age</th>
                      <th scope="col">Gender</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ticket &&
                      Array.isArray(ticket?.passengers) &&
                      ticket.passengers.map((item) => (
                        <tr>
                          <td>{item.name || ""}</td>
                          <td>{item.age || ""}</td>
                          <td>{item.gender || ""}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
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

export default DownloadTicket;
