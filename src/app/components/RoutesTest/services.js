import axios from 'axios';
import { restHeaders } from "appdir/app";


const fetch = () => {
    let hdr = restHeaders();
    return axios.get(`/some/rest/route`, {headers: hdr}).then(({data}) => data);
};

export default {
    fetch,
};
