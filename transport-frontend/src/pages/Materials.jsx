import { useEffect } from "react";
import { materialApi } from "../services/api";
import { useState } from "react";
import { DataTable } from "../components/utility/DataTable";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { AddForm } from "../components/utility/AddForm";

export const Materials = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const formFields = [
    { label: "Material Name", type: "text", name: "name" },
    { label: "Material Code", type: "text", name: "code" },
    { label: "Category", type: "text", name: "category" },
    { label: "Unit Weight", type: "number", name: "unit_weight" },
    { label: "Unit Volume", type: "number", name: "unit_volume" },
    { label: "Is Active", type: "checkbox", name: "is_active" },
  ];
  const handleAddMaterial = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const material = {};
    formFields.forEach((field) => {
      if (field.type === "checkbox") {
        material[field.name] = formData.get(field.name) === "on";
      } else {
        material[field.name] = formData.get(field.name);
      }
    });
    try {
      const response = await materialApi.create(material);
      setData([...data, response.data.data]);
      setShow(false);
    } catch (error) {
      console.error("Error adding material:", error);
    }
  };
  useEffect(() => {
    materialApi
      .getAll()
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching materials:", error);
        
      });
  }, []);
  return (
    <div>
      <h1>Materials</h1>
      <div
        style={{
          display: "flex",
          flexShrink: "1",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <input type="text" placeholder="Search Material ... " />
          <Button variant="outlined">Search</Button>
        </div>
        <Button variant="outlined" startIcon={<Add />} onClick={() => setShow(true)}>
          Add Material
        </Button>
      </div>
      <DataTable data={data} />

      <AddForm
        showState={[show, setShow]}
        fields={formFields}
        onSubmit={handleAddMaterial}
      />
    </div>
  );
};
