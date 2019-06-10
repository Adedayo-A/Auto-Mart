const cars = [
    {
        "state": "new",
        "status": "sold",
        "price": 150000,
        "manufacturer": "toyota",
        "model": "avalon",
        "body_type": "cars",
        "owner": 1,
        "created_on": 2,
        "id": 1
    },
    {
        "state": "new",
        "status": "available",
        "price": 80000,
        "manufacturer": "lexus",
        "model": "jeep",
        "body_type": "cars",
        "owner": 1,
        "created_on": 21,
        "id": 2
    },
    {
        "state": "new",
        "status": "available",
        "price": 100000,
        "manufacturer": "mazda",
        "model": "mazda 106",
        "body_type": "cars",
        "owner": 1,
        "created_on": 21,
        "id": 3
    },
    {
        "state": "used",
        "status": "available",
        "price": 130000,
        "manufacturer": "Sienna",
        "model": "Sienna 102",
        "body_type": "van",
        "owner": 1,
        "created_on": 21,
        "id": 4
    },
    {
        "state": "used",
        "status": "available",
        "price": 200000,
        "manufacturer": "Mercedez",
        "model": "M-2019",
        "body_type": "cars",
        "owner": 1,
        "created_on": 21,
        "id": 5
    },
    {
        "state": "used",
        "status": "available",
        "price": 200000,
        "manufacturer": "Mitsubushi",
        "model": "M-2019",
        "body_type": "van",
        "owner": 1,
        "created_on": 21,
        "id": 6
    }


]


module.exports = cars;

// {  
//     "id":​ Integer​,
//     "owner":​ Integer​, //user id
//     ​"created_on":​ ​DateTime​,
//     ​"state":​ ​String​, // new,used  
//     ​"status":​ String​, // sold,available - default is available
//     "price":​ ​Float​,
//     "manufacturer":​ ​String​,
//     ​"model":​ ​String​,
//     "body_type":​ String​
//     }

// {
//     ​"state": ​'new'​,
//     ​"status":​ "sold"​,
//     "price": ​100000,
//     "manufacturer":​ ​"mercedez",
//     "​model": ​"benz"​,
//     "body_type": "cars"​,
//     "owner":​ 1​,
//     ​"created_on":​ ​"20"​,
//     "id": 1​
// }