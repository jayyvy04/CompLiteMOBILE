import axios from 'axios';

export const loginUser = async (username, password) => {
    try {
        const response = await axios.post('http://10.0.2.2:8000/api/login', {username, password}, );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getProfile = async (student_id) => {
    try {
        console.log(student_id);
        const response = await axios.post('http://10.0.2.2:8000/api/profile', student_id);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getInstructorProfile = async (instructor_id) => {
    try {
        console.log(instructor_id);
        const response = await axios.post('http://10.0.2.2:8000/api/instructorprofile', instructor_id);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getSectionDetails = async (instructorid) => {
    try {
        console.log(instructorid)
        const response = await axios.post('http://10.0.2.2:8000/api/sectionlist', instructorid);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const sendReport = async (account_id, report) => {
    try {
        const response = await axios.post('http://10.0.2.2:8000/api/sendreport', {account_id, report});
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const addSection = async (instructor_id, course_name, course_description, activityname, sectionname, sectioncode, actduedate) => {
    try {
        const response = await axios.post('http://10.0.2.2:8000/api/addsection', {instructor_id, course_name, course_description, activityname, sectionname, sectioncode, actduedate});
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getEnrollSection = async (student_id) => {
    try {
        const response = await axios.post('http://10.0.2.2:8000/api/enrolledsection', student_id);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const enrollToSection = async (sectionCode, student_id) => {
    try {
        console.log(sectionCode);
        const response = await axios.post('http://10.0.2.2:8000/api/enroll', {sectionCode, student_id});
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};