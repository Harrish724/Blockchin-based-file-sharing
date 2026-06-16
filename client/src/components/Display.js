import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import "./Display.css";

const Display = ({ contract, account }) => {
  const [data, setData] = useState([]);
  const [logs, setLogs] = useState([]); // ✅ Store access logs
  const [showLogs, setShowLogs] = useState(false); // ✅ Toggle logs visibility
  const [uploaderAddress, setUploaderAddress] = useState(""); 
  const [isExpired, setIsExpired] = useState(false);
  const encryptionKey = "de3ault12345678";

  useEffect(() => {
    const checkExpiry = () => {
      const storedData = JSON.parse(localStorage.getItem("accessExpiry")) || {};
      const expiryTime = storedData[account];

      if (expiryTime && Date.now() > expiryTime) {
        setIsExpired(true);
      } else {
        setIsExpired(false);
      }
    };
    checkExpiry();
  }, [account]);

  const getData = async () => {
    if (isExpired) {
      alert("Access has expired for this user.");
      return;
    }

    try {
      const targetAddress = uploaderAddress || account;

      const hasAccess = await contract.checkAccess(targetAddress, account);
      if (!hasAccess && targetAddress !== account) {
        alert("You don't have access to these files.");
        return;
      }

      const dataArray = await contract.display(targetAddress);
      if (!dataArray || dataArray.length === 0) {
        alert("No file available or access denied");
        return;
      }

      const decryptedFiles = await Promise.all(
        dataArray.map(async (item) => {
          const fileUrl = `https://gateway.pinata.cloud/ipfs/${item}`;
          const response = await fetch(fileUrl);
          const encryptedText = await response.text();
          const decrypted = CryptoJS.AES.decrypt(encryptedText, encryptionKey).toString(CryptoJS.enc.Utf8);
          return { fileUrl, decrypted };
        })
      );

      setData(decryptedFiles.map(item => item.decrypted));

      // Log each file access to the backend
      decryptedFiles.forEach(async ({ fileUrl }) => {
        try {
          await fetch("http://localhost:3001/api/logAccess", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              file: fileUrl,
              user: account,
            }),
          });
        } catch (err) {
          console.error("Failed to log access", err);
        }
      });
    } catch (e) {
      alert("Error fetching or decrypting file");
    }
  };

  // ✅ Fetch logs from backend
  const fetchLogs = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/getLogs");
      const logs = await response.json();
      setLogs(logs);
      setShowLogs(true);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  };

  return (
    <>
      <input
        type="text"
        placeholder="Enter uploader's address (leave empty for own files)"
        value={uploaderAddress}
        onChange={(e) => setUploaderAddress(e.target.value)}
        className="address"
      />
      <div className="button-container">
        <button className="button" onClick={getData} disabled={isExpired}>Get Data</button>
        <button className="button" onClick={fetchLogs}>View Access Logs</button> 
      </div>

      {showLogs && (
        <div className="logs">
          <h3>Access Logs</h3>
          <ul>
            {logs.map((log, index) => (
              <li key={index}>
                <strong>User:</strong> {log.user} <br />
                <strong>File:</strong> <a href={log.file} target="_blank" rel="noopener noreferrer">{log.file}</a> <br />
                <strong>Time:</strong> {new Date(log.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
          <button className="button" onClick={() => setShowLogs(false)}>Close Logs</button>
        </div>
      )}

      <div className="image-list">
        {data.map((file, i) => (
          <a href={file} key={i} target="_blank" rel="noopener noreferrer">
            <img src={file} alt="Decrypted File" className="image-list" />
          </a>
        ))}
      </div>
    </>
  );
};

export default Display;
