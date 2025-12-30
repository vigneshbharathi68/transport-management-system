import { useEffect } from "react";
import { DataTable } from "../components/utility/DataTable.js";
import { useState } from "react";
import { transportApi } from "../services/api.js";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";

export const Transports = () => {
  const [data, setData] = useState([]);

  const fetchTransports = async () => {
    try {
      const response = await transportApi.getAll();
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching transports:", error);
    }
  };

  const addTransport = async (transport) => {
    try {
      const response = await transportApi.create(transport);
      setData([...data, response.data.data]);
    } catch (error) {
      console.error("Error adding transport:", error);
    }
  };

  useEffect(() => {
    fetchTransports();
  }, []);
  return (
    <div>
      <h1>Transport</h1>
      {/* Create split search bar with mui  */}
      <div style={{ display: "flex", flexShrink:"1", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
        <input type="text" placeholder="Name" />
        <input type="text" placeholder="GSTIN" />
        <Button variant="outlined">Search</Button>
        </div>
          <Button variant="outlined" startIcon={<Add />} onClick={() => addTransport({ vehicle_type_id: 1, status: 'PLANNED' })}>
            Add Transport
          </Button>
      </div>
      {/* Add button for hitting search using @mui */}
      <DataTable
        data={data}
      />
    </div>
  );
};
