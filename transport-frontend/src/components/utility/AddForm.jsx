import { Button, SwipeableDrawer } from "@mui/material";

export const AddForm = ({ showState, onSubmit, fields }) => {
  const [show, setShow] = showState;
  const renderForm = (field) => {
    switch (field.type) {
      case "text":
        return (
          <input
            style={{ width: "100%" }}
            id={field.name}
            type={field.type}
            name={field.name}
            required
          />
        );
      case "number":
        return (
          <input
            style={{ width: "100%" }}
            id={field.name}
            type={field.type}
            name={field.name}
            required
          />
        );
      case "select":
        return (
          <select
            style={{ width: "100%" }}
            id={field.name}
            name={field.name}
            required
          >
            <option value="">Select an option</option>
            {field.values?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };
  return (
    <SwipeableDrawer
      anchor="right"
      open={show}
      onClose={() => setShow(false)}
      onOpen={() => setShow(true)}
      swipeAreaWidth={40}
    >
      <div style={{ width: "500px", padding: "20px" }}>
        <h1>Add Shipment</h1>
        {/* Form fields go here */}
        <form onSubmit={onSubmit}>
          {fields.map((field) => {
            return (
              <div key={field.name} style={{ marginBottom: "15px" }}>
                <label style={{ display: "block" }} htmlFor={field.name}>
                  {field.label}
                </label>
                {renderForm(field)}
              </div>
            );
          })}
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </div>
    </SwipeableDrawer>
  );
};
