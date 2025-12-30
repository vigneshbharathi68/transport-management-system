import { useEffect } from "react";
import { DataTable } from "../components/utility/DataTable";
import { shipmentApi } from "../services/api";
import { useState } from "react";
import { Button } from "@mui/material";
import { Add, Upload } from "@mui/icons-material";

export const Shipments = () => {
  const [data, setData] = useState([]);
  const addShipment = async (shipment) => {
    try {
      const response = await shipmentApi.create(shipment);
      setData([...data, response.data.data]);
    } catch (error) {
      console.error("Error adding shipment:", error);
    }
  };
  useEffect(() => {
    shipmentApi
      .getAll()
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching shipments:", error);
      });
  }, []);

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
              addShipment({ transport_id: 1, material_id: 1, quantity: 100 })
            }
          >
            Add Shipment
          </Button>
          <Button variant="outlined" startIcon={<Upload />}>Upload Shipment</Button>
        </div>
      </div>
      <DataTable data={data} />
    </div>
  );
};
