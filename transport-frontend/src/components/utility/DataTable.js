import Paper from "@mui/material/Paper";

import { DataGrid } from "@mui/x-data-grid";

export const DataTable = ({ data }) => {
  const columns = data.length > 0 ? Object.keys(data[0]).map(col => ({ field: col, headerName: col })) : [];
  

  const paginationModel = {
    pageSize: 5,
    page: 0,
  };
  return (
    // can you distribute the columns dynamically based on the data keys

    <Paper sx={{ width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        // checkboxSelection
        sx={{ border: 0 }}
        distributeColumnsEvenly={true}
      />
    </Paper>
  );
};
