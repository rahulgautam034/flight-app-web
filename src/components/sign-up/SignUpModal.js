import { useState } from "react";

function SignUpModal(props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isModalClose, setModalState] = useState(false);

  const signUp = () => {
    if (
      firstName.trim().length == 0 ||
      lastName.trim().length == 0 ||
      userName.trim().length == 0 ||
      password.trim().length == 0
    ) {
      return alert("Please fill all * fields");
    }
    const data = {
      firstName,
      lastName,
      userName,
      password,
    };
    setFirstName("")
    setLastName("")
    setUserName("")
    setPassword("")
    setModalState(true)
    props.onSubmit(data);
  };
  return (
    <div
      class="modal fade"
      id={props.id}
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Signup{" "}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="recipient-name" class="col-form-label">
                  First Name<label className="mandatory_symbol">*</label>
                </label>
                <input
                  value={firstName}
                  type="text"
                  class="form-control"
                  id="recipient-name"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div class="mb-3">
                <label for="message-text" class="col-form-label">
                  Last Name<label className="mandatory_symbol">*</label>
                </label>
                <input
                  value={lastName}
                  type="text"
                  class="form-control"
                  id="message-text"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div class="mb-3">
                <label for="recipient-name" class="col-form-label">
                  User Name<label className="mandatory_symbol">*</label>
                </label>
                <input
                  value={userName}
                  type="text"
                  class="form-control"
                  id="recipient-name"
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div class="mb-3">
                <label for="message-text" class="col-form-label">
                  Password<label className="mandatory_symbol">*</label>
                </label>
                <input
                  value={password}
                  type="password"
                  class="form-control"
                  id="message-text"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </form>
          </div>
          <div class="modal-footer center-block d-grid col-4 mx-auto ">
            <button
              type="button"
              class="btn btn-secondary d-grid gap-2 loginBtn"
              data-bs-dismiss={isModalClose ? "modal" : ""}
              onClick={() => signUp()}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpModal;
