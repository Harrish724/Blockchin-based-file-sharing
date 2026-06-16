import { useEffect, useState } from "react";
import "./Modal.css";

const Modal = ({ setModalOpen, contract }) => {
  const [expiryDuration, setExpiryDuration] = useState(0);

  const sharing = async () => {
    const address = document.querySelector(".address").value;
    if (!address) {
      alert("Please enter a valid address to share access.");
      return;
    }
    
    // Get the current timestamp and calculate expiry time
    const expiryTimestamp = Date.now() + expiryDuration * 60000; // Convert minutes to milliseconds
    
    // Store expiry time in localStorage
    let storedData = JSON.parse(localStorage.getItem("accessExpiry")) || {};
    storedData[address] = expiryTimestamp;
    localStorage.setItem("accessExpiry", JSON.stringify(storedData));
    
    await contract.allow(address); // Ensure the smart contract updates access
    alert("Access granted successfully!");
    setModalOpen(false);
  };

  useEffect(() => {
    const accessList = async () => {
      const addressList = await contract.shareAccess();
      let select = document.querySelector("#selectNumber");
      select.innerHTML = ""; // Clear previous options
      
      addressList.forEach(opt => {
        let e1 = document.createElement("option");
        e1.textContent = opt;
        e1.value = opt;
        select.appendChild(e1);
      });
    };
    contract && accessList();
  }, [contract]);

  return (
    <>
      <div className="modalBackground">
        <div className="modalContainer">
          <div className="title">Share with</div>
          <div className="body">
            <input
              type="text"
              className="address"
              placeholder="Enter Address"
            />
            <input
              type="number"
              className="expiry"
              placeholder="Expiry (minutes)"
              onChange={(e) => setExpiryDuration(e.target.value)}
            />
          </div>
          <form id="myForm">
            <select id="selectNumber">
              <option className="address">People With Access</option>
            </select>
          </form>
          <div className="footer">
            <button onClick={() => setModalOpen(false)} id="cancelBtn">
              Cancel
            </button>
            <button onClick={() => sharing()}>Share</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
