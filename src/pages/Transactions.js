import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faCheck, faHome, faSearch, faAngleDown, faAngleUp, faArrowDown, faArrowUp, faEdit, faEllipsisH, faExternalLinkAlt, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Form, Button, ButtonGroup, Breadcrumb, InputGroup, Dropdown } from 'react-bootstrap';

import { TransactionsTable } from "../components/Tables";

export default () => {
  const axios = require('axios').default;
  const [axiosres, setAxios] = useState([]);
  useEffect(()=>{
    axios.get('http://192.168.4.19:3009/api/transactions').then(response => setAxios(response.data));
  }, []);

  const columns = [
    {
      name: "Block #",
      selector: row => row.blockNumber,
      sortable: true
    },
    {
      name: "From",
      selector: row => row.from,
      sortable: true
    },
    {
      name: "To",
      selector: row=> row.to,
      sortable: true
    },
    {
      name: "Value",
      selector: row=>(row.ethValue === undefined ? `${row.tokenAmount} ${row.tokenSymbol}` : `${row.ethValue} ETH`),
      sortable: true
    },
    {
      name:"Action",
      cell: (row) => (
        <>
        <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle as={Button} split variant="link" className="text-dark m-0 p-0">
              <span className="icon icon-sm">
                <FontAwesomeIcon icon={faEllipsisH} className="icon-dark" />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>
                <FontAwesomeIcon icon={faEye} className="me-2" onClick={()=> alert("Load up details for %s", row.hash)} /> View Details
              </Dropdown.Item>
              <Dropdown.Item>
                <FontAwesomeIcon icon={faEdit} className="me-2" onClick={()=> alert("Load up edit page for %s", row.hash)} /> Edit
              </Dropdown.Item>
              <Dropdown.Item className="text-danger">
                <FontAwesomeIcon icon={faTrashAlt} className="me-2" onClick={()=> alert("Prompt confirmation to delete %s", row.hash)}/> Remove
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </>
      )
    }
  ]
  const [filterText, setFilterText] = React.useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
	const filteredItems = axiosres.filter(
		item => (item.from && item.from.toLowerCase().includes(filterText.toLowerCase())) || (item.to && item.to.toLowerCase().includes(filterText.toLowerCase())),
	);

  const FilterComponent = ({ filterText, onFilter, onClear }) => (
    	<>
      <Col xs={8} md={6} lg={3} xl={4}>
            
      <InputGroup>
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
              <Form.Control type="text" placeholder="Search" aria-label="Search Input" value={filterText} onChange={onFilter} />
            </InputGroup>
            
            </Col>
    	</>
    );
  
  const subHeaderComponentMemo = React.useMemo(() => {
		const handleClear = () => {
			if (filterText) {
				setResetPaginationToggle(!resetPaginationToggle);
				setFilterText('');
			}
		};

		return (
			<FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
		);
	}, [filterText, resetPaginationToggle]);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Volt</Breadcrumb.Item>
            <Breadcrumb.Item active>Transactions</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Transactions</h4>
          <p className="mb-0">Your web analytics dashboard template.</p>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <ButtonGroup>
            <Button variant="outline-primary" size="sm">Share</Button>
            <Button variant="outline-primary" size="sm">Export</Button>
          </ButtonGroup>
        </div>
      </div>

      <div className="table-settings mb-4">
        <Row className="justify-content-between align-items-center">
          <Col xs={4} md={2} xl={1} className="ps-md-0 text-end">
            <Dropdown as={ButtonGroup}>
              <Dropdown.Toggle split as={Button} variant="link" className="text-dark m-0 p-0">
                <span className="icon icon-sm icon-gray">
                  <FontAwesomeIcon icon={faCog} />
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-xs dropdown-menu-right">
                <Dropdown.Item className="fw-bold text-dark">Show</Dropdown.Item>
                <Dropdown.Item className="d-flex fw-bold">
                  10 <span className="icon icon-small ms-auto"><FontAwesomeIcon icon={faCheck} /></span>
                </Dropdown.Item>
                <Dropdown.Item className="fw-bold">20</Dropdown.Item>
                <Dropdown.Item className="fw-bold">30</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </div>

      <TransactionsTable data={filteredItems} columns={columns} subHeaderComponent={subHeaderComponentMemo} />
    </>
  );
};
