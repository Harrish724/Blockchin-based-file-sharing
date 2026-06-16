import { useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import "./FileUpload.css";

const FileUpload = ({ contract, account }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const encryptionKey = "de3ault12345678"; // Change this to a secure method

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const encryptedFile = CryptoJS.AES.encrypt(reader.result, encryptionKey).toString();
        const blob = new Blob([encryptedFile], { type: "text/plain" });
        const formData = new FormData();
        formData.append("file", blob, fileName + ".enc");

        const resFile = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
          headers: {
            pinata_api_key: "e9d9b47419643705b658",
            pinata_secret_api_key: "8f1de0196ec2fec91a11b2c12f5d6a8ac7ee956130a61008b4118ff67f4a14ce",
            "Content-Type": "multipart/form-data",
          },
        });

        const encryptedHash = resFile.data.IpfsHash;
        await contract.add(account, encryptedHash);
        alert("File successfully encrypted and uploaded!");
        setFileName("No file selected");
        setFile(null);
      };
    } catch (e) {
      alert("Error encrypting or uploading file");
    }
  };

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    setFile(data);
    setFileName(data.name);
    e.preventDefault();
  };

  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        {/* <label htmlFor="file-upload" className="choose">Choose File</label> */}
        <input type="file" id="file-upload" onChange={retrieveFile} />
        {/* <span className="textArea">File: {fileName}</span> */}
        <button type="submit" className="upload" disabled={!file}>Upload File</button>
      </form>
    </div>
  );
};
export default FileUpload;