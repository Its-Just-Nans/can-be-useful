import axios from 'axios';


const ENDPOINT = "https://webservices.synbird.com/v6/pro"



const getInformations = async (id) =>{
    const obj = {
        method: "POST",
        data: {}
    };
    obj.data.id_professional_company = id;
    let {data: data} = await axios(`${ENDPOINT}/company/get`, obj).catch((e)=>{
        e;
        data = {};
    });
    return data;
}


const getWidget = async (id) =>{
    const obj = {
        method: "POST",
        data: {}
    };
    obj.data.id_professional_company = id.toString();
    let {data: data} = await axios(`${ENDPOINT}/company/getWidget`, obj).catch((e)=>{
        e;
        data = {};
    });
    return data;
    
}

const getSlotFor = async (data) => {
    const obj = {
        method: "POST",
        data: {}
    };
    obj.data = data;
    let ans = {}
    ans = await axios(`${ENDPOINT}/company/getSlotsFor`, obj).catch((e)=>{
        e;
        ans = {};
    });
    return ans.data || {};
}

export {
    getInformations,
    getWidget,
    getSlotFor
};