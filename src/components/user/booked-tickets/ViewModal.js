function ViewModal(props) {
  const ticket = props.ticket;
  console.log(ticket)
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
            <i
              style={
                ticket.status == "booked"
                  ? { color: "green" }
                  : { color: "red" }
              }
              className={`bi bi-circle-fill status_circle`}
            ></i>
            <h5 className="modal-title" id="exampleModalToggleLabel">
              PNR - {ticket.pnrNumber}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="row_div col-12">
              <div className="col-sm-3 div_col">
                <strong>Flight</strong>

                <span>{ticket.flightName}</span>
              </div>
              <div className="col-sm-3 div_col">
                <strong>Source</strong>
                <span>{ticket.source}</span>
              </div>
              <div className="col-sm-3 div_col">
                <strong>Destination</strong>
                <span>{ticket.destination}</span>
              </div>

              <div className="col-sm-3 div_col">
                <strong>Date</strong>
                <span>{ticket.date}</span>
              </div>
            </div>
            <div className="row_div col-12">
              <div className="col-sm-3 div_col">
                <strong>Flight Id</strong>

                <span>{ticket.flightId}</span>
              </div>
              <div className="col-sm-3 div_col">
                <strong>Meal</strong>
                <span>{ticket.mealType}</span>
              </div>
              <div className="col-sm-3 div_col">
                <strong>Seats</strong>
                <span>{ticket.totalSeats}</span>
              </div>
              <div className="col-sm-3 div_col">
                <strong>Booked By</strong>
                <span>{ticket.name}</span>
              </div>
            </div>
          </div>
          <div className="modal-header"></div>
          <div className="modal-body">
            <h5>Passengers</h5>
            <div className ="passenger_body">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Age</th>
                    <th scope="col">Gender</th>
                  </tr>
                </thead>
                <tbody>
                  { ticket && Array.isArray(ticket?.passengers) && ticket.passengers.map(item=>
                  <tr>
                    <td>{item.name || ""}</td>
                    <td>{item.age || ""}</td>
                    <td>{item.gender || ""}</td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-primary"
              data-bs-target="#exampleModalToggle2"
              data-bs-toggle="modal"
              data-bs-dismiss="modal"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewModal;
