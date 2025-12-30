import { useEffect } from "react";
import { vehicleTypeApi } from "../services/api";
import { useState } from "react";
import { DataTable } from "../components/utility/DataTable";

export const VehiclesTypes = () => {

  const [data, setData] = useState([]);
  const fetchVehicleTypes = async () => {
    console.log("Fetching vehicle types");
    try {
      const response = await vehicleTypeApi.getAll();
      console.log({response});
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching vehicle types:", error);
    }
  }
  useEffect(() => {
    fetchVehicleTypes();
  }, [])

  return (
    <div>
      <h1>Vehicle Types</h1>
      <div
        style={{
          display: "flex",
          flexShrink: "1",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      ></div>

    <DataTable data={data} />
      
    </div>
  );
};
