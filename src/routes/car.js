const api = require('express').Router();
const multer = require('multer')
const upload = multer()
const auth=require("../middleware/auth")
const database = require('../config/database')
const { mySqlDb } = database

api.get('/models',auth, (req, res) => {
    try{
        mySqlDb.query('SELECT * from car_models',async (error, carModels) => {
            if (error) {
                res.status(500).json({  error: 'Unable to Find Car Model', message: error.message });
                return;
            }
            if(carModels.length<1){
                res.status(404).json({ error: 'No Car Model Yet' });
                return;
            }
            res.status(200).json(carModels)
            return;
        })
    }catch(error){
        res.status(500).json({ error: 'Unable to Find Car Model', message: error.message });
    }
});

api.post('/add',upload.any(),(req,res)=>{
    try{
        // const { renter_id, company_id, car_name, color, fuel_type, mileage, engine, kms_driven, address, longitude, latitude, province, city, famous_place_nearby} = req.body
        const {renter_id,company_id,car_name,province,city,address}=req.body
        if(!renter_id){
            res.status(500).json({error:"renter_id should not be empty"})
            return
        }
        if(!company_id){
            res.status(500).json({error:"company_id should not be empty"})
            return
        }
        if(!car_name){
            res.status(500).json({error:"car_name should not be empty"})
            return
        }
        if(!address){
            res.status(500).json({error:"address should not be empty"})
            return
        }
        if(!city){
            res.status(500).json({error:"city should not be empty"})
            return
        }
        if(!province){
            res.status(500).json({error:"province should not be empty"})
            return
        }
        const files = req.files
        const Image1 = files.find(file => file.fieldname === 'Image1')?.buffer
        const Image2 = files.find(file => file.fieldname === 'Image2')?.buffer
        const Image3 = files.find(file => file.fieldname === 'Image3')?.buffer
        const Image4 = files.find(file => file.fieldname === 'Image4')?.buffer

        const car={...req.body,Image1,Image2,Image3,Image4,ratings:-1}
        mySqlDb.query('INSERT INTO cars SET ?', car, (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Car is not added.', message: error.message });
            } else {
              res.status(200).json({ message: "Car added successfully." });
            }
          })

    }catch(error){
        res.status(500).json({ error: 'Car is not added...', message: error.message });
    }
})

api.get('/getCarsByRenter',(req,res)=>{
    try{
        const {renter_id}=req.body
        mySqlDb.query('SELECT * from cars WHERE renter_id = ?', [renter_id], async (error, cars) => {
            if (error) {
                res.status(500).json({ error: "Unable to find cars", message: error.message });
                return
            } else if (cars.length < 1) {
                res.status(404).json({ error: "No car found for this renter" });
                return;
            }
            res.status(200).json(cars)
        })

    }catch(error){
        res.status(500).json({ error: 'Unable to find cars', message: error.message });
    }
})

api.get('/getCarsByRenterAndModel',(req,res)=>{
    try{
        const {renter_id,model_id}=req.body
        mySqlDb.query('SELECT * from cars WHERE renter_id = ? AND company_id = ?', [renter_id,model_id], async (error, cars) => {
            if (error) {
                res.status(500).json({ error: "Unable to find cars", message: error.message });
                return
            } else if (cars.length < 1) {
                res.status(404).json({ error: "No car found against given renter and model" });
                return;
            }
            res.status(200).json(cars)
        })

    }catch(error){
        res.status(500).json({ error: 'Unable to find cars', message: error.message });
    }
})

api.get('/getCarById',(req,res)=>{
    try{
        const {car_id}=req.body
        mySqlDb.query('SELECT * from cars WHERE car_id = ? ', [car_id], async (error, cars) => {
            if (error) {
                res.status(500).json({ error: "Unable to find car", message: error.message });
                return
            } else if (cars.length < 1) {
                res.status(404).json({ error: "No car found against given car id" });
                return;
            }
            res.status(200).json(cars[0])
        })

    }catch(error){
        res.status(500).json({ error: 'Unable to find car', message: error.message });
    }
})

module.exports = api;