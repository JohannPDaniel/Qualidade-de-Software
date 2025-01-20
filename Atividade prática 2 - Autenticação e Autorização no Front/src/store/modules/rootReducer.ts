import { combineReducers } from '@reduxjs/toolkit';
import { alertReducer } from './Alert/Alert';
import { assessmentDetailReducer } from './assessmentDetail/assessmentDetailSlice';
import { assessmentsReduce } from './assessments/assessmentsSlice';
import { authLoggedReducer } from "./authLogged/authLoggedSlice";
import { studentReducer } from "./students/studentSlice";

export const rootReducer = combineReducers({
	// Todos os novos estados globais criado, devem ser chamados aqui...
	authLogged: authLoggedReducer,
	students: studentReducer,
	assessments: assessmentsReduce,
	assessmentDetail: assessmentDetailReducer,
	alert: alertReducer,
});
