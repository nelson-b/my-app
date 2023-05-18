import { Form, FormControl, Row, Col, Button, Container } from "react-bootstrap";
import "./parentInput.component.css";
import { get, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import React, { useState, useMemo } from "react";
import * as xlsx from "xlsx-js-style";
import FileSaver from "file-saver";
import AlertModel from "../modal/alertModel";
import { month } from "../constant";

function BatchInputComponent({ getData }) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    reValidateMode: "onChange",
  });
  
  // const initialState = {
  //   fileData: ''
  // };
  
  // const [formData, setFormData] = useState(initialState);

  // const onChangeHandler = (e) => {
  //   console.log('e',e);
  //   setFormData({ ...formData, [e.target.id]: e.target.value });
  //   console.log('formData',formData);
  // };

  const handleChange=({target})=> {
    console.log('target', target);
    setSelectedFile(target);
    // target.value = ''
  };
  
  const handleClick = event => {
    console.log('event', event);
    // const { target = {} } = event || {};
    setSelectedFile(event.target.files);
  };

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [fileData, setFileData] = useState([]);
  const [fileError, setFileError] = useState([]);
  const [showShouldUpdModal, setShowShouldUpdModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleShowSuccessModal = () => {
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleShowErrorModal = () => {
    setShowErrorModal(true);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  const handleShowShouldUpdModal = () => {
    setShowShouldUpdModal(true);
  };

  const handleCloseShouldUpdModal = () => {
    setShowShouldUpdModal(false);
  };

  const successmsg = {
    headerLabel: "Success....",
    variant: "success",
    header: 'Data has been saved successfully!!',
    content: ['Navigating you to the Sell out data review page.....']
  }

  const errormsg = {
    headerLabel: "Error....",
    variant: "danger",
    header: "There are below errors while processing. Please recitify and retry",
    content: fileError
  }

  const shouldUpdateMsg={
    headerLabel: "Warning....",
    variant: "warning",
    header: 'Do you wish to update the existing data!!',
    content: ['Your previous data would be lost if you update it with new data']
  }

  const ShouldUpdate = () =>{
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = String(currentDate.getFullYear()).slice(-2);

      for (let i = 7; i > 0; i--) 
      {
        let date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - (i - 1), 
          1
        );
        
        const monthName = month[date.getMonth()];
        const year = String(date.getFullYear()).slice(-2);
        const monthField = monthName+'_Amount';

        if (currentYear !== year && currentMonth !== 0) continue;

        let data = getData.filter(item => item[monthField] != '');
        console.log('data', data);

        if(data.length > 0){
          console.log('show data already exist popup');
          setShowShouldUpdModal(true);
          return;
        }
      }
      postBatchData();
  }

  const postBatchData = () => {
    console.log('selectedFile', selectedFile);
    const file = selectedFile.file[0];
    
    if (
      file.type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setError("fileData", {
        type: "filetype",
        message: "Only Excel files are valid for upload.",
      });
      return;
    } else {
      var res = ShouldUpdate();
      res ? setShowShouldUpdModal(true):setShowShouldUpdModal(false);

      if (selectedFile.file) {
        let reader = new FileReader();
        reader.onload = (e) => {
          console.log("reader onload");
          let result = e.target.result;
          let workbook = xlsx.read(result, { type: "array" });
          let sheetName = workbook.SheetNames[0];
          let worksheet = workbook.Sheets[sheetName];
          let json = xlsx.utils.sheet_to_json(worksheet);
          let errorJson = [];
          console.log("Reading excel: ", json);
          
          setFileData(json);
            fileData.forEach((i) => {
              if(i.Jan){
                if(isNaN(i.Jan)){
                  errorJson.push('There should be number for Jan month at partner : ' + i.Partner);
                  console.log('There should be number for Jan month at partner : ' + i.Partner);
                }
              }
              if(i.Feb){
                if(isNaN(i.Feb)){
                  errorJson.push('There should be number for Feb month at partner : ' + i.Partner);
                  console.log('There should be number for Feb at partner : ' + i.Partner);
                }
              }
              if(i.Mar){
                if(isNaN(i.Mar)){
                  errorJson.push('There should be number for Mar month at partner : ' + i.Partner);
                  console.log('There should be number for Mar month at partner : ' + i.Partner);
                }
              }
              if(i.Apr){
                if(isNaN(i.Apr)){
                  errorJson.push('There should be number at Apr at partner : ' + i.Partner);
                  console.log('There should be number at Apr at partner : ' + i.Partner);
                }
              }
              if(i.May){
                if(isNaN(i.May)){
                  errorJson.push('There should be number at May at partner : ' + i.Partner);
                  console.log('There should be number at May at partner : ' + i.Partner);
                }
              }
              if(i.Jun){
                if(isNaN(i.Jun)){
                  errorJson.push('There should be number at Jun at partner : ' + i.Partner);
                  console.log('There should be number at Jun at partner : ' + i.Partner);
                }
              }
              if(i.Jul){
                if(isNaN(i.Jul)){
                  errorJson.push('There should be number at Jul at partner : ' + i.Partner);
                  console.log('There should be number at Jul at partner : ' + i.Partner);
                }
              }
              if(i.Aug){
                if(isNaN(i.Aug)){
                  errorJson.push('There should be number at Jul at partner : ' + i.Partner);
                  console.log('There should be number at Aug at partner : ' + i.Partner);
                }
              }
              if(i.Sep){
                if(isNaN(i.Sep)){
                  errorJson.push('There should be number at Jul at partner : ' + i.Partner);
                  console.log('There should be number at Sep at partner : ' + i.Partner);
                }
              }
              if(i.Oct){
                if(isNaN(i.Oct)){
                  errorJson.push('There should be number at Oct at partner : ' + i.Partner);
                  console.log('There should be number at Oct at partner : ' + i.Partner);
                }
              }
              if(i.Nov){
                if(isNaN(i.Nov)){
                  errorJson.push('There should be number at Nov at partner : ' + i.Partner);
                  console.log('There should be number at Nov at partner : ' + i.Partner);
                }
              }
              if(i.Dec){
                if(isNaN(i.Dec)){
                  errorJson.push('There should be number at Dec at partner : ' + i.Partner);
                  console.log('There should be number at Dec at partner : ' + i.Partner);
                }
              }
          });

          if(errorJson.length > 0){
            setFileError(errorJson);
            setShowErrorModal(true);
            setShowSuccessModal(false);
          }
          else
          {
            setFileError([]);
            setShowErrorModal(false);
            setShowSuccessModal(true);
            setTimeout(()=>navigate('/dataReview'), 3000);
          }

          errorJson = [];
        };

        reader.readAsArrayBuffer(selectedFile.file[0]);
      }
      console.log("Reading excel useState: ", fileData);
      console.log('fileError',fileError);
    }
  }

  const onSubmit = (frmData) => {
    setSelectedFile(frmData);
    ShouldUpdate();
  };

  const onError = (error) => {
    console.log("ERROR:::", error);
  };

  const readMeData = [
    ["How to use this template"],
    [
      "1. Please verify the partner name, channel, Model and correct the values in case of any invalid data.",
    ],
    [
      "2. If the value mentioned as True means it is estimated value. If nothing mentioned, by Default values treated as actuals. ",
    ],
    [
      "3. For each month, we have a flag field with suffix IsEstimated for each month (e.g Jan_IsEstimated) to indicate values as Actual or Estimate. ",
    ],
    [
      "4. Zone, Country, Partner and Model fields are text fields. All alpha numeric characters are allowed (e.g A-Z, 1, 2, & % etc)",
    ],
    [
      "5. Partner field should be unique for each record. It would be used as identifier for each record.",
    ],
    [
      "6. Fill only the data from the previous 6 months to the current reporting month for the current academic year.",
    ],
    [
      "7. All months field can have only numbers with precision of maximum 2 decimals allowed.",
    ],
    ["8. Please verify the values in each cell before the upload"],
  ];

  const exportToExcel = async (exportedData) => {
    const tempData = exportedData.map((e) => {
      const { id, status, ...rest } = e;
      return rest;
    });

    const currentDate = new Date();

    const workbook = xlsx.utils.book_new();
    const readmeDataWithoutHeader = readMeData.slice(0);
    const sheet1 = xlsx.utils.aoa_to_sheet(readmeDataWithoutHeader);
    xlsx.utils.book_append_sheet(workbook, sheet1, "Read Me");

    const sheet2 = xlsx.utils.json_to_sheet(tempData);
    xlsx.utils.book_append_sheet(workbook, sheet2, "Sell out Data Input");
    console.log('workbook', workbook);
    console.log('workbook sheets["Sell out Data Input"]["A1"]', workbook.Sheets["Sell out Data Input"]["A1"]);
    console.log('convert Object.keys(params.data): ',Object.keys(workbook.Sheets["Sell out Data Input"]));

    //style excel header with green bgcolor and white forecolor
    workbook.Sheets["Sell out Data Input"]["A1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["B1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["C1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["D1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["E1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["F1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["G1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["H1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["I1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["J1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["K1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["L1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["M1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["N1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["O1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["P1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["Q1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["R1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["S1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["T1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["U1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["V1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["W1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["X1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["Y1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["Z1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["AA1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["AB1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["AC1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["AD1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["AE1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };
    workbook.Sheets["Sell out Data Input"]["AF1"].s = {
      fill: { patternType: "solid", fgColor: { rgb: "009E4D" }},
      font: { bold: true, color: { rgb: "FFFFFF" }}
    };

    xlsx.writeFile(workbook, "Sell out Data Input" + currentDate.getFullYear() + ".xlsx");
  };

  return (
    <>
      <Container fluid>
        <h5 className="sell-out-input-header">Sell Out Data Input</h5>
        <Container className="sell-out-input-upload">
          <Row>
            <Col xs="auto" className="align-item-center file-upload-container">
              <Form.Label>BATCH UPLOAD</Form.Label>
            </Col>
            <Col xs="auto">
              <Form noValidate onSubmit={handleSubmit(onSubmit, onError)}>
                <Row>
                  <Col xs="auto">
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="file"
                        accept=".xlsx,.xls"
                        // value={selectedFile}
                        onClick={handleClick}
                        onChange={handleChange}
                        {...register("file", {
                          required: "Excel file is required",
                        })}
                      />
                      {errors.file && (
                        <Form.Text className="text-danger">
                          {errors.file.message}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                  <Col xs="auto">
                    <Button className=" btn-upload save-header" type="submit">
                      Upload
                    </Button>
                    <AlertModel
                      show={ showSuccessModal }
                      handleClose={ handleCloseSuccessModal }
                      body={ successmsg }
                    />
                    <AlertModel
                      show={ showErrorModal }
                      handleClose={ handleCloseErrorModal }
                      body={ errormsg }
                    />
                    <AlertModel
                      show={ showShouldUpdModal }
                      handleClose={ handleCloseShouldUpdModal }
                      body={ shouldUpdateMsg }
                      handleConfirm={ postBatchData }
                      button1Label = {'Confirm'}
                      button2Label = {'Cancel'}
                    />
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col xs="auto">
              <Button
                size="lg"
                className="edit-header"
                onClick={(e) => exportToExcel(getData)}>
                Download Template
              </Button>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
}

export default BatchInputComponent;