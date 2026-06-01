const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticket.controller");

const {
  upload,
  convertToWebp,
} = require("../middleware/upload");

/* CREATE TICKET WITH IMAGE */

router.post(
  "/create",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  convertToWebp,
  ticketController.createTicket
);

/* GET ALL */

router.get("/", ticketController.getAllTickets);

/* STATS */

router.get("/stats", ticketController.ticketStats);

/* GET SINGLE */

router.get("/:id", ticketController.getTicketById);

/* ADD REPLY */

router.post("/:id/reply", ticketController.addReply);

/* UPDATE STATUS */

router.put("/:id/status", ticketController.updateStatus);

router.put(
    "/:id",
    upload.fields([
      {
        name: "image",
        maxCount: 1,
      },
    ]),
    convertToWebp,
    ticketController.updateTicket
  );

/* DELETE */

router.delete("/:id", ticketController.deleteTicket);

module.exports = router;