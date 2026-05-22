import { Document } from 'mongoose';
import { IUser } from './index.js';
import { IVehicle } from './index.js';

export interface IFavorite extends Document {
  user: IUser['_id'];
  vehicle: IVehicle['_id'];
}

