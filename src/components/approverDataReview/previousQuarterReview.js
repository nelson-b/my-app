import React, { useCallback, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import {
  Button,
  Row,
  Col,
  Stack,
  ToggleButton,
  ButtonGroup,
  Breadcrumb,
  Container,
} from "react-bootstrap";
import { month } from "../constant";
import MyMenu from "../menu/menu.component.js";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import partnerPrevious from "../../data/partnerPreviousData.json";
import Home from "../../images/home-icon.png";

function PartnerQuarterApprover({}) {
  const gridRef = useRef();
  const navigate = useNavigate();
  const [rowData, setRowData] = useState();
  const [radioValue, setRadioValue] = useState("1");
  const [message, setMessage] = useState(0);
  const [updatedData, setUpdatedData] = useState(rowData);

  const radios = [
    { name: "Reporting Currency", value: "1" },
    { name: "Euro", value: "2" },
  ];

  const ChildMessageRenderer = (props) => {
    const invokeParentMethod = () => {
      props.context.methodFromParent(
        `Row: ${props.node.rowIndex}, Col: ${props.colDef.field}`
      );
    };
    return (
      <div>
        <div>Received Updated Values From Distributor
        <Button
          style={{ height: 30, width: 100, lineHeight: 0.5, margin: "0px 0px 5px 100px" }}
          onClick={invokeParentMethod}
          className="cancel-header btn-reject"
        >
          Reject
        </Button>
        <Button
          style={{ height: 30, width: 100, lineHeight: 0.5, margin: " 0px 10px 5px 20px" }}
          onClick={invokeParentMethod}
          className="save-header btn-reject"
        >
          Validate
        </Button>
        </div>
      </div>
    );
  };

  const columnDefs = [
    {
      field: "Zone",
      headerName: "Zone",
      filter: true,
      width: 140,
      pinned: "left",
      suppressSizeToFit: true,
      editable: false,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
    },
    {
      headerName: "Country",
      field: "Country",
      filter: true,
      width: 140,
      pinned: "left",
      suppressSizeToFit: true,
      editable: false,
    },
    {
      headerName: "Partner Account Name",
      field: "Partner",
      filter: true,
      pinned: "left",
      width: 170,
      suppressSizeToFit: true,
    },
    {
      headerName: "Month Impacted",
      field: "month",
      pinned: "left",
      width: 140,
      editable: false,
    },
    {
      headerName: "Sellout value Approved (in KE)",
      field: "SelloutValue",
      editable: false,
      minWidth: 140,
      wrapHeaderText: true,
      sortable: true,
      suppressMenu: true,
    },
    {
      headerName: "New value (in KE)",
      field: "newValue",
      editable: false,
      minWidth: 100,
      wrapHeaderText: true,
      sortable: true,
      suppressMenu: true,
    },
    {
      headerName: "Change in Value",
      field: "changeValue",
      minWidth: 90,
      editable: false,
      wrapHeaderText: true,
      sortable: true,
      suppressMenu: true,
    },
    {
      headerName: "Change In %",
      field: "change_per",
      minWidth: 90,
      editable: false,
      wrapHeaderText: true,
      sortable: true,
      suppressMenu: true,
    },
    {
      headerName: "User that made the change",
      field: "userChange",
      editable: false,
      minWidth: 140,
      wrapHeaderText: true,
      sortable: true,
      suppressMenu: true,
    },
    {
      headerName: "Editors Comments",
      field: "editorComments",
      minWidth: 620,
      editable: false,
      wrapHeaderText: true,
      sortable: true,
      suppressMenu: true,
      cellRenderer: ChildMessageRenderer,
    },
  ];

  const defaultColDef = useMemo(() => {
    return {
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClassRules: {
        greenBackground: (params) => {
          return params.node.footer;
        },
      },
      flex: 1,
      resizable: true,
      filter: true,
      sortable: true,
      suppressSizeToFit: true,
      suppressMenuHide: true,
    };
  }, []);

  const handleCheckboxClick = (params) => {
    const selectedRows = params.api.getSelectedRows();
    setMessage(selectedRows?.length);
  };

  const handleSave = (params) => {
    const gridApi = params.api;
    const updatedRowData = gridApi.getData();
    setRowData(updatedRowData);
  };

  const handleReviewNavigation = () => {
    navigate("/approverHome");
  };

  const handleInvestigation = () => {
    // navigate("/editorHome", { state: { message } });
    alert(message ? `${message} Partner Accounts Sent For Investigation` : "");
  };

  const handleConfirm = () => {
    setRowData(rowData);
  };

  const getRowStyle = (params) => {
    if (params.node.aggData) {
      return { fontWeight: "bold" };
    }
  };

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => partnerPrevious)
      .then((partnerPrevious) => setRowData(partnerPrevious));
  }, []);

  return (
    <>
      <Container fluid>
        <Row>
          <MyMenu />
        </Row>
        <div>
          <Breadcrumb>
            <Breadcrumb.Item href="/approverHome">
              <img
                src={Home}
                alt="home"
                style={{ height: "20px", width: "80px", cursor: "pointer" }}
              />
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div>
          <Stack direction="horizontal">
            <div className="sell-out-header">Previous Quarter Data Review</div>
            <div className="mt-0 ms-auto">
              <Row className="currency-mode">CURRENCY MODE</Row>
              <Col>
                <ButtonGroup>
                  {radios.map((radio, idx) => (
                    <ToggleButton
                      key={idx}
                      id={`radio-${idx}`}
                      type="radio"
                      variant={idx % 2 ? "outline-success" : "outline-success"}
                      name="radio"
                      value={radio.value}
                      checked={radioValue === radio.value}
                      onChange={(e) => setRadioValue(e.currentTarget.value)}
                    >
                      {radio.name}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
              </Col>
            </div>
          </Stack>
        </div>

        <Row
          className="ag-theme-alpine ag-grid-table"
          style={{ height: 370, marginTop: "10px" }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={radioValue == 1 ? partnerPrevious : partnerPrevious}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            groupHideOpenParents={true}
            animateRows={true}
            onGridReady={onGridReady}
            getRowStyle={getRowStyle}
            rowSelection={"multiple"}
            suppressRowClickSelection={true}
            onSelectionChanged={handleCheckboxClick}
            groupSelectsChildren={true}
            suppressMenuHide={true}
          ></AgGridReact>
          <div className="checkbox-message">
            {message > 0 ? `${message} Partner Account ` : ""}
          </div>
          <div>
            <Row className="mb-3" style={{ float: "right", marginTop: "20px" }}>
              <Col xs="auto">
                <Button
                  className="btn-upload cancel-header"
                  onClick={() => {
                    handleReviewNavigation();
                  }}
                >
                  Cancel
                </Button>
              </Col>
              <Col xs="auto">
                <Button
                  className="btn-invest edit-header"
                  onClick={(e) => handleInvestigation(message)}
                >
                  Send For Investigation
                </Button>
              </Col>
              <Col>
                <Button
                  className="btn-data save-header"
                  onClick={() => {
                    handleConfirm();
                  }}
                >
                  Validate All
                </Button>
              </Col>
            </Row>
          </div>
        </Row>
      </Container>
    </>
  );
}

export default PartnerQuarterApprover;