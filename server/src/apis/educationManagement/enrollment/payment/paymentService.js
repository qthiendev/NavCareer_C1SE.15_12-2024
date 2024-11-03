const ncdb = require('../../../databases/ncdbService');
const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const moment = require('moment');
const qs = require('qs');
require('dotenv').config();

const tryCreateOrder = async (aid, role, courseData, userData) => {
    try {
        const config = {
            appid: '553',
            key1: process.env.ZP_KEY1,
            key2: process.env.ZP_KEY2,
            endpoint: 'https://sandbox.zalopay.com.vn/v001/tpe/createorder'
        };

        const embeddata = {
            merchantinfo: 'embeddata123',
            redirecturl: `http://localhost:5173/edu/payment/check?course_id=${courseData.course_id}`,
        };

        const items = [{
            itemid: courseData.course_id,
            itemname: courseData.course_name,
            itemprice: courseData.course_price,
            itemquantity: 1
        }];

        const appuser = `${userData.user_id}/${userData.user_alias}/${userData.user_full_name}/${userData.user_phone_number}/${userData.user_email}`;

        const order = {
            appid: config.appid,
            apptransid: `${moment().format('YYMMDD')}_${Math.floor(Math.random() * 1000000)}`,
            appuser: appuser,
            apptime: Date.now(),
            item: JSON.stringify(items),
            embeddata: JSON.stringify(embeddata),
            amount: courseData.course_price,
            description: `ZaloPay - Payment order for course '${items[0].itemname}' by user '${userData.user_full_name}'`,
            bankcode: ''
        };

        const transData = `${config.appid}|${order.apptransid}|${order.appuser}|${order.amount}|${order.apptime}|${order.embeddata}|${order.item}`;
        order.mac = CryptoJS.HmacSHA256(transData, config.key1).toString();

        const response = await axios.post(config.endpoint, null, { params: order });

        if (response.data.returncode === 1) {
            const createPayemt = await ncdb.query(role,
                'EXECUTE CreatePayment @aid, @payment_transaction_id, @payment_description',
                { aid, payment_transaction_id: order.apptransid, payment_description: order.description });

            if (createPayemt[0].check !== 'SUCCESSED')
                return null;
        }

        return { ...response.data, apptransid: order.apptransid };

    } catch (err) {
        throw new Error(`paymentService.js/tryCreateOrder | ${err.message}`);
    }
};

const tryCheckOrder = async (aid, role, appTransID) => {
    try {
        const config = {
            appid: "553",
            key1: process.env.ZP_KEY1,
            key2: process.env.ZP_KEY2,
            endpoint: "https://sandbox.zalopay.com.vn/v001/tpe/getstatusbyapptransid"
        };

        const postData = {
            appid: config.appid,
            apptransid: appTransID,
        };

        const data = `${postData.appid}|${postData.apptransid}|${config.key1}`;
        postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        const response = await axios.post(config.endpoint, qs.stringify(postData), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (!response)
            throw new Error(`Cannot get respone of ${config.endpoint} => {appTransID:${appTransID}}`);

        if (response.data.returncode !== 1)
            return {
                returncode: response.data.returncode,
                returnmessage: response.data.returnmessage
            };

        const paymentCheck = await ncdb.query(role,
            'EXECUTE ReadPayment @aid, @payment_transaction_id',
            { aid, payment_transaction_id: appTransID }
        );

        if (paymentCheck && paymentCheck.length > 0) {
            return {
                returncode: response.data.returncode,
                state: paymentCheck[0].payment_state,
                returnmessage: response.data.returnmessage
            };
        } else {
            throw new Error('Payment exist but not in database');
        }

    } catch (err) {
        throw new Error(`paymentService.js/tryCheckOrder | ${err.message}`);
    }
};

module.exports = { tryCreateOrder, tryCheckOrder };
