const mysql = require('mysql');
const config = require('../config');

const test = {
    id: 1,
    name: 'Mar',
    age: 43
}

function all(table){
    return test;
}

function getOne(table, id){

}

function add(tale, data){

}

function remove(table, id){

}

module.exports = {
    all,
    getOne,
    add,
    remove,
}