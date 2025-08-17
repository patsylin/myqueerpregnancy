// server/api/index.js (ESM)
//import { Router } from "express";
// import auth from "./auth.js";
// import pregnancies from "./pregnancies.js";
// import weeks from "./weeks.js";
// import journal from "./journal.js";

const router = Router();

router.use("/auth", auth);
router.use("/pregnancies", pregnancies);
router.use("/weeks", weeks);
router.use("/journal", journal);

//export default router;
