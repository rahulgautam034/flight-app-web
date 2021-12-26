import { useState } from "react";
import "./DropDown.css"
function DropDown(props) {
  const [dropdown, changeDropDown] = useState(false);

  const changeDropDownMenu = () => {
    changeDropDown(!dropdown);
  };
  return (
    <div class="button_main">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        onClick={() => changeDropDownMenu()}
      >
        {props.title}
      </button>
      <div class="drop_down_list ">
        {dropdown &&
          props.list.map((item) => (
            <a class="dropdown-item" href="#">
              {item}
            </a>
          ))}
      </div>
    </div>
  );
}

export default DropDown;
