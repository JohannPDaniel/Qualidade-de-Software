import { Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { resetAssessmentDetail } from "../store/modules/assessmentDetail/assessmentDetailSlice";

export const Detail = () => {
    const assessmentDetailRedux = useAppSelector( state => state.assessmentDetail )
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    function handleReturn () {
        dispatch( resetAssessmentDetail() )
        navigate("/home")
    }
    return (
			<>
				<Typography>Detalhes de uma Avaliação</Typography>
				<Typography>{assessmentDetailRedux.title}</Typography>
				<Button onClick={handleReturn}>voltar</Button>
			</>
		);
}