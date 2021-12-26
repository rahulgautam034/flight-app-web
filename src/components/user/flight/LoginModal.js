import { useState } from "react";

function LoginModal(props) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const onLoginClick = () => {
    if (username.trim().length == 0) {
      return alert("Please enter user name");
    } else if (password.trim().length == 0) {
      return alert("Please enter password");
    }
    const credentials = {
      username,
      password,
    };
    props.onSubmit(credentials);
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
              Login{" "}
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
                  User Name
                </label>
                <input
                  value={username}
                  type="text"
                  class="form-control"
                  id="recipient-name"
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div class="mb-3">
                <label for="message-text" class="col-form-label">
                  Password
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
              data-bs-dismiss="modal"
              onClick={() => onLoginClick()}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
