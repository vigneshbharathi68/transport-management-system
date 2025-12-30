import { useEffect } from "react";
import { DataTable } from "../components/utility/DataTable.js";
import { useState } from "react";
import { transportApi } from "../services/api.js";

export const Transports = () => {
  const [data, setData] = useState([]);
  console.log({ data });

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
      <div style={{ display: "flex", marginBottom: "20px" }}>
        <input type="text" placeholder="Name" />
        <input type="text" placeholder="GSTIN" />
        <button>Search</button>
      </div>
      {/* Add button for hitting search using @mui */}

      <DataTable
        data={[
          { name: "Transport 1", status: "Active" },
          { name: "Transport 1", status: "Active" },
        ]}
      />
    </div>
  );
};
