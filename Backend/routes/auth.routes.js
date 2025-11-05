import { Router} from "express";

const router = Router();

router.post("/login", (req, res) =>{
    console.log(req.body);
    res.json({mensaje: "ok"});
})
export default router;