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
import "./dataReview.css";
import { month } from "../constant";
import MyMenu from "../menu/menu.component.js";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { exportParams } from "ag-grid-community";
import data from "../../data/dataReview.json";
import dataEuro from "../../data/dataReviewEuro.json";
import CancelModal from "../modal/cancelModal";
import footerTotalReview from "./footerTotalReview";
import active from "../../images/active.png";
import closed from "../../images/closed.png";
import Home from "../../images/home-icon.png";
import * as xlsx from "xlsx";
import * as FileSaver from "file-saver";

function DataReviewComponent({}) {
  const gridRef = useRef();
  const navigate = useNavigate();
  const [rowData, setRowData] = useState();
  const [radioValue, setRadioValue] = useState("1");
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const radios = [
    { name: "Reporting Currency", value: "1" },
    { name: "Euro", value: "2" },
  ];

  const columnDefs = [
    {
      field: "Zone",
      rowGroup: true,
      hide: true,
    },
    {
      headerName: "Partner Account Name",
      field: "Partner",
      filter: true,
      sortable: true,
      pinned: "left",
      width: 100,
      suppressSizeToFit: true,
    },
    {
      headerName: "Country",
      field: "Country",
      rowGroup: true,
      hide: true,
      filter: true,
      sortable: true,
      pinned: "left",
      suppressSizeToFit: true,
      editable: false,
    },
    {
      headerName: "Model",
      field: "Model",
      rowGroup: true,
      hide: true,
      sortable: true,
      filter: true,
      pinned: "left",
      suppressSizeToFit: true,
      editable: false,
    },
    {
      headerName: "Currency of Reporting",
      field: "currency",
      sortable: true,
      filter: true,
      pinned: "left",
      width: 120,
      suppressSizeToFit: true,
      editable: false,
    },
    {
      headerName: "Status",
      field: "Status",
      pinned: "left",
      width: 110,
      suppressSizeToFit: true,
      cellRenderer: (params) => {
        const Status = params.value;
        return (
          <div>
            {Status === "Active" && (
              <img src={active} alt="active" style={{ width: "80px" }} />
            )}
            {Status === "Close" && (
              <img src={closed} alt="closed" style={{ width: "80px" }} />
            )}
          </div>
        );
      },
    },
  ];

  const defaultColDef = useMemo(() => {
    return {
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
      // headerRowHeight: 50,
    };
  }, []);

  const autoGroupColumnDef = useMemo(() => {
    return {
      // headerName: "Filter Criteria Zone",
      width: 160,
      filterValueGetter: (params) => {
        if (params.node) {
          var colGettingGrouped = params.colDef.showRowGroup + "";
          return params.api.getValue(colGettingGrouped, params.node);
        }
      },
      pinned: "left",
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: {
        suppressCount: true,
        checkbox: true,
        innerRenderer: footerTotalReview,
      },
    };
  }, []);

  const getRowStyle = (params) => {
    if (params.node.aggData) {
      return { fontWeight: "bold" };
    }
  };

  const setIsEstimated = (params, monthWithYearValue) => {
    if (params.data != undefined) {
      let monthYrKey = monthWithYearValue + "_E";
      var filterMonths = Object.keys(params.data)
        .filter((key) => [monthYrKey].includes(key))
        .reduce((obj, key) => {
          obj[key] = params.data[key];
          return obj;
        }, {});

      var isEstimated = filterMonths[monthYrKey] === "true";
      if (isEstimated === true) return { backgroundColor: "#EEB265" };
    } else {
      return { backgroundColor: "white" };
    }
  };

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = String(currentDate.getFullYear()).slice(-2);

  for (let i = 7; i > 0; i--) {
    let date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - (i - 1),
      1
    );
    const monthName = month[date.getMonth()];
    const year = String(date.getFullYear()).slice(-2);
    const monthWithYearLabel = monthName + " " + year;
    const monthWithYearValue = monthName + year;
    const monthAndYearAEFlagField = monthName + year + "_E";

    // to make sure user entered number only
    const checkNumericValue = (params) => {
      const newValInt = Number(params.newValue.toFixed(2));
      const valueChanged = params.data[monthWithYearValue] !== newValInt;
      if (valueChanged) {
        params.data[monthWithYearValue] =
          newValInt >= 0
            ? newValInt
            : params.oldValue !== undefined
            ? params.oldValue
            : "";
      }
      return valueChanged;
    };
    if (currentYear !== year && currentMonth !== 0) continue;
    i == 1
      ? columnDefs.push(
          {
            headerName: monthWithYearLabel,
            field: monthWithYearValue,
            editable: true,
            singleClickEdit: true,
            minWidth: 100,
            aggFunc: "sum",
            sortable: true,
            valueParser: (params) => Number(params.newValue),
            valueSetter: checkNumericValue,
            cellStyle: (params) => {
              return setIsEstimated(params, monthWithYearValue);
            },
          },
          {
            field: monthAndYearAEFlagField,
            hide: true,
          },
          {
            headerName: "vat. CM vs LM (value)",
            field: "vatVMvsLvalue",
            minWidth: 200,
            editable: true,
            singleClickEdit: true,
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
            sortable: true,
          },
          {
            headerName: "vat. CM vs LM (%)",
            field: "vatVMvsLM",
            minWidth: 170,
            editable: true,
            filter: "agNumberColumnFilter",
            sortable: true,
            aggFunc: "sum",
            singleClickEdit: true,
          }
        )
      : columnDefs.push({
          headerName: monthWithYearLabel,
          field: monthWithYearValue,
          editable: true,
          sortable: true,
          filter: "agNumberColumnFilter",
          aggFunc: "sum",
          singleClickEdit: true,
          minWidth: 100,
          valueParser: (params) => Number(params.newValue),
          valueSetter: checkNumericValue,
          cellStyle: (params) => {
            return setIsEstimated(params, monthWithYearValue);
          },
        });
  }

  const previousYear = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 12,
    1
  );
  const prevMonth = month[previousYear.getMonth()];
  const prevYear = String(previousYear.getFullYear()).slice(-2);

  const prevYearwithMonthValue = prevMonth + prevYear;
  const prevYearwithMonthLabel = prevMonth + " " + prevYear;
  const euroMonthAndYearAEFlagField = prevMonth + prevYear + "_E";

  if (previousYear !== prevYear && prevMonth !== 0);
  " "
    ? columnDefs.push(
        {
          headerName: prevYearwithMonthLabel,
          field: prevYearwithMonthValue,
          editable: true,
          singleClickEdit: true,
          minWidth: 100,
          aggFunc: "sum",
          sortable: true,
          valueParser: (params) => Number(params.newValue),
          cellStyle: (params) => {
            return setIsEstimated(params, prevYearwithMonthValue);
          },
        },
        {
          field: euroMonthAndYearAEFlagField,
          hide: true,
        },
        {
          headerName: "vat. CM vs LY (value)",
          field: "PreVMValue",
          minWidth: 200,
          editable: true,
          singleClickEdit: true,
          aggFunc: "sum",
          filter: "agNumberColumnFilter",
          sortable: true,
        },
        {
          headerName: "vat. CM vs CM vs LY (%)",
          field: "PreVMvsLM",
          minWidth: 200,
          editable: true,
          singleClickEdit: true,
          aggFunc: "sum",
          filter: "agNumberColumnFilter",
          sortable: true,
        }
      )
    : columnDefs.push({
        headerName: prevYearwithMonthLabel,
        field: prevYearwithMonthValue,
        editable: true,
        sortable: true,
        filter: "agNumberColumnFilter",
        aggFunc: "sum",
        singleClickEdit: true,
        minWidth: 100,
        valueParser: (params) => Number(params.newValue),
        cellStyle: (params) => {
          return setIsEstimated(params, prevYearwithMonthValue);
        },
      });

  const handleEdit = () => {
    navigate("/dataInput");
  };

  const handleConfirm = () => {
    setRowData(rowData);
  };

  const excelStyles = useMemo(() => {
    return [
      {
        id: "header",
        alignment: {
          vertical: "Center",
        },
        font: {
          bold: true,
          color: "#ffffff",
        },
        interior: {
          color: "#009530",
          pattern: "Solid",
        },
      },
      {
        id: "greenBackground",
        interior: {
          color: "#b5e6b5",
          pattern: "Solid",
        },
      },
    ];
  }, []);

  const handleExport = useCallback(() => {
    const params = {
      fileName: "Sell out Data Review.xlsx",
      sheetName: "Data Review",
    };
    gridRef.current.api.exportDataAsExcel(params);
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => data)
      .then((data) => setRowData(data));
  }, []);

  return (
    <>
      <Container fluid>
        <Row>
          <MyMenu />
        </Row>
        <div>
          <Breadcrumb>
            <Breadcrumb.Item href="/">
              <img
                src={Home}
                alt="home"
                style={{ height: "20px", width: "80px", cursor: "pointer" }}
              />
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div>
          <Stack direction="horizontal" gap={4}>
            <div className="sell-out-header">Sell Out Data Review</div>
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
            <div className="historical-header">
              <Button className="btn-md historical-data">
                Historical Data
              </Button>
            </div>
          </Stack>
        </div>

        <Row
          className="ag-theme-alpine ag-grid-table"
          style={{ height: 370, marginTop: "10px" }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={radioValue == 1 ? data : dataEuro}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            // groupDisplayType={'custom'}
            // groupDisplayType={"singleColumn"}
            groupHideOpenParents={true}
            showOpenedGroup={true}
            animateRows={true}
            suppressAggFuncInHeader={true}
            groupIncludeTotalFooter={true}
            groupIncludeFooter={true}
            groupDefaultExpanded={-1}
            onGridReady={onGridReady}
            getRowStyle={getRowStyle}
            excelStyles={excelStyles}
            rowSelection={"single"}
          ></AgGridReact>
          <div>
            <Row className="mb-3" style={{ float: "right", marginTop: "10px" }}>
              <Col xs="auto">
                <Button
                  className="btn-upload cancel-header"
                  onClick={handleShowModal}
                >
                  Cancel
                </Button>
                <CancelModal
                  show={showModal}
                  handleClose={handleCloseModal}
                  handleConfirm={handleCloseModal}
                  body={"Are you sure you want to cancel the review."}
                  button1={"Cancel"}
                  button2={"Confirm"}
                />
              </Col>
              <Col xs="auto">
                <Button
                  className="btn-upload edit-header"
                  onClick={(e) => handleExport()}
                >
                  Export
                </Button>
              </Col>
              <Col xs="auto">
                <Button
                  className="btn-upload edit-header"
                  onClick={(e) => handleEdit()}
                >
                  Edit
                </Button>
              </Col>
              <Col>
                <Button
                  className="btn-upload save-header"
                  onClick={() => {
                    handleConfirm();
                  }}
                >
                  Save
                </Button>
              </Col>
            </Row>
          </div>
        </Row>
      </Container>
    </>
  );
}

export default DataReviewComponent;
