import { useEffect } from "react";
import { DataTable } from "../components/utility/DataTable";
import { materialApi, shipmentApi } from "../services/api";
import { useState } from "react";
import { Button } from "@mui/material";
import { Add, Upload } from "@mui/icons-material";
import { useRef } from "react";
import { AddForm } from "../components/utility/AddForm.jsx";

export const Shipments = () => {
  const [data, setData] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const fileInputRef = useRef(null);
  const addShipment = async (shipment) => {
    try {
      const response = await shipmentApi.create(shipment);
      setData([...data, response.data.data]);
    } catch (error) {
      console.error("Error adding shipment:", error);
    }
  };

  const [shipmentInputForm, setShipmentInputForm] = useState([
    { label: "Source", type: "text", name: "source" },
    { label: "Destination", type: "text", name: "destination" },
    { label: "Material ID", type: "select", name: "material_id", values:[] },
    { label: "Vehicle Type ID", type: "select", name: "vehicle_type_id" },
    { label: "weight", type: "number", name: "weight" },
    { label: "Volume", type: "number", name: "volume" },
    { label: "Quantity", type: "number", name: "quantity" },
    { label: "Order No", type: "number", name: "order_no" },
  ]);
  useEffect(() => {
    shipmentApi
      .getAll()
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching shipments:", error);
      });

      materialApi.getIds().then(response => {
        setShipmentInputForm((preState) => {
          return preState.map((field) => {
            if (field.name === "material_id") {
              return { ...field, values: response.data.data };
            }
            return field;
          });
        })
      })
  }, []);

  const uploadShipmentOrders = () => {
    fileInputRef.current.click();
  };

  const handleSubmitShipment = async (event) => {
    console.log("Submitting shipment form");
    event.preventDefault();
    // Extract form data and create shipment object
    const formData = new FormData(event.target);
    const shipment = {};
    shipmentInputForm.forEach((field) => {
      shipment[field.name] = formData.get(field.name);
    });

    await addShipment(shipment);
    setFormVisible(false);
  };

  const onFileUpload = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    shipmentApi
      .upload(formData)
      .then((response) => {
        console.log("File uploaded successfully:", response);
        // Optionally, refresh the shipments list
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
    e.target.value = null; // Reset file input
  };

  return (
    <div>
      <h1>Shipments</h1>
      <div
        style={{
          display: "flex",
          flexShrink: "1",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            style={{ width: "14rem" }}
            type="text"
            placeholder="Search Shipments ... "
          />
          <Button variant="outlined">Search</Button>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() =>
              setFormVisible(true)
            }
          >
            Add Shipment
          </Button>
          <Button
            variant="outlined"
            startIcon={<Upload />}
            onClick={uploadShipmentOrders}
          >
            Upload Shipment
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            hidden
            onChange={(e) => {
              onFileUpload(e);
            }}
          />
        </div>
      </div>
      <DataTable data={data} />
      {/* Form for adding shipment */}

      <AddForm
        showState={[formVisible, setFormVisible]}
        onSubmit={handleSubmitShipment}
        fields={shipmentInputForm}
      />
    </div>
  );
};
