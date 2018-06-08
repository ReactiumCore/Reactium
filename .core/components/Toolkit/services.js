import axios from 'axios';
import { restHeaders } from 'dependencies';


const fetch = () => {
    let hdr = restHeaders();
    return axios.get(`/some/rest/route`, {headers: hdr}).then(({data}) => data);
};

export default {
    fetch,
};
