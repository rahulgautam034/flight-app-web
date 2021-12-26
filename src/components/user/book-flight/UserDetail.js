function UserDetail({ name, email }) {
  return (
    <div class="col-xl-8 passenger_card row">
      <h5>Booking detail will send to</h5>
      <div className="col-xl-4">
        <input disabled placeholder=" Name" value={name} />
      </div>
      <div className="col-xl-4">
        <input disabled placeholder="Email Id" value={email} />
      </div>
      <div
        class="btn-group col-xl-3"
        role="group"
        aria-label="Basic example"
      ></div>
      <div
        class="btn-group col-xl-1"
        role="group"
        aria-label="Basic example"
      ></div>
    </div>
  );
}

export default UserDetail;
