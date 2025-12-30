import { useEffect } from "react";
import { materialApi } from "../services/api";
import { useState } from "react";
import { DataTable } from "../components/utility/DataTable";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";

export const Materials = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    materialApi.getAll().then(response => {
      setData(response.data.data);
    }
    ).catch(error => {
      console.error("Error fetching materials:", error);
    });
  }, [])
  return (
    <div>
      <h1>Materials</h1>
      <div style={{ display: "flex", flexShrink:"1", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
        <input type="text" placeholder="Search Material ... " />
        <Button variant="outlined">Search</Button>
        </div>
        <Button variant="outlined" startIcon={<Add />}>Add Material</Button>
      </div>
      <DataTable data={data} />
      
    </div>
  )
}