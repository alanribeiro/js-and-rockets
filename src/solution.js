// Please implement your solution in this file
import axios from 'axios';

const noop = () => {};

const filterLaunches = (list) => {
    return list.filter(element => {
        const is2018 = element.launch_year === "2018";
        let hasNasa = false;
        element.rocket.second_stage.payloads.map(payload => {
            payload.customers.map(customer => {
                if(customer.includes("NASA")) hasNasa = true;
            });
        });
        return is2018 && hasNasa;
    });
}

const sortList = (list) => {
    return list.sort((a, b) => {
        const payloadA = a.rocket.second_stage.payloads.length;
        const payloadB = b.rocket.second_stage.payloads.length;
        if(payloadA > payloadB) {
            return -1;
        }
        if(payloadA < payloadB) {
            return 1;
        }
        const timeA = new Date(a.launch_date_utc);
        const timeB = new Date(b.launch_date_utc);
        if(timeA > timeB) return -1;
        if(timeA < timeB) return 1;
        return 0;
    });
}

const fetchData = () => {
    axios.get("https://api.spacexdata.com/v3/launches/past")
        .then(response => renderData(prepareData(response.data)))
        .catch(error => console.log(error));
}

const prepareData = (response) => {
    const data = filterLaunches(response);
    const result = sortList(data).map(element => {
        return {
            flight_number: element.flight_number,
            mission_name: element.mission_name,
            payloads_count: element.rocket.second_stage.payloads.length
        }
    });
    return result;
};

const renderData = (result) => {
    const element = document.getElementById('out');
    element.innerHTML = JSON.stringify(result, undefined, 2);
}

module.exports = {
  prepareData,
  renderData,
  fetchData
};
