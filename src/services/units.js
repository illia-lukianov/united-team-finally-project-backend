import unitsModel from "../models/units.js";

export const getUnits = async () => {
    return await unitsModel.find({}, { _id: 0 }); 
};