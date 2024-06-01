import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";
import { FaUserTie } from "react-icons/fa";
import "../../styles/custom.css";
import { date } from "yup";
import { MdOutlineClose } from "react-icons/md";

function Activity() {
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [viewAll, setViewAll] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Define truncateText function inside the component
  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) {
      return text;
    }
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const content = [
    {
      icon: <FaUserTie className="me-2" />,
      title: "Naveen",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      details: {
        name: "Suriya",
        email: "suriyaecs22@gmail.com",
        phone: "9876543456",
      },
      date: "01/06/2024",
    },
    {
      icon: <FaUserTie className="me-2" />,
      title: "Naveen",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      details: {
        name: "Suriya",
        email: "suriyaecs22@gmail.com",
        phone: "9876543456",
      },
      date: "02/06/2024",
    },
    {
      icon: <FaUserTie className="me-2" />,
      title: "Naveen",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      details: {
        name: "Suriya",
        email: "suriyaecs22@gmail.com",
        phone: "9876543456",
      },
      date: "03/06/2024",
    },
    {
      icon: <FaUserTie className="me-2" />,
      title: "Naveen",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      details: {
        name: "Suriya",
        email: "suriyaecs22@gmail.com",
        phone: "9876543456",
      },
      date: "04/06/2024",
    },
    {
      icon: <FaUserTie className="me-2" />,
      title: "Naveen",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      details: {
        name: "Suriya",
        email: "suriyaecs22@gmail.com",
        phone: "9876543456",
      },
      date: "05/06/2024",
    },
  ];

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Activity
      </Button>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton className="Calenderview">
          <Modal.Title>Recent Activity</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="danger" className="me-2">
            New Activity
          </Button>
        </Modal.Footer>
        <Modal.Body className={viewAll ? "scrollable-modal-body" : ""}>
          {/* Add dotted line outside the Accordion */}

          <Accordion
            activeKey={expanded}
            onSelect={(e) => setExpanded(e)}
            className="custom-accordion"
          >
            {content
              .slice(0, viewAll ? content.length : 3)
              .map((item, index) => (
                <Accordion.Item eventKey={index.toString()} key={index}>
                  <Accordion.Header>
                    <div className="iconDesign">{item.icon}</div>
                    <div className="flex-group-1">
                      <b>{item.title}</b>
                      <br />
                      <span className="text-muted small">
                        {expanded !== index.toString() &&
                          truncateText(item.text, 10)}
                      </span>
                    </div>
                    <div className="text-end ms-auto">
                      <span className="text-muted small text-end">
                        {item.date}
                      </span>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    {item.text}
                    <div className="mt-3">
                      <span>
                        <b>Name:</b> {item.details.name}
                      </span>
                      <br />
                      <span>
                        <b>Email:</b> {item.details.email}
                      </span>
                      <br />
                      <span>
                        <b>Phone no:</b> {item.details.phone}
                      </span>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
          </Accordion>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="viewBtn"
            variant="primary"
            onClick={() => setViewAll(!viewAll)}
          >
            {viewAll ? "Show Less" : "View All"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Activity;
