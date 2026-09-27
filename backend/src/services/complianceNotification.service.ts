import { Vehicle } from '../models/Vehicle.model.js';
import { Notification } from '../models/Notification.model.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const startOfToday = () => { const d=new Date(); d.setHours(0,0,0,0); return d; };

export const createComplianceNotifications = async () => {
  const today = startOfToday();
  const windowEnd = new Date(today.getTime() + 10 * DAY_MS);
  const vehicles = await Vehicle.find({
    $or: [
      { insuranceExpiry: { $gte: today, $lte: windowEnd } },
      { pollutionExpiry: { $gte: today, $lte: windowEnd } },
      { insuranceExpiry: { $lt: today } },
      { pollutionExpiry: { $lt: today } },
    ],
  }).select('_id seller title insuranceExpiry pollutionExpiry');

  for (const vehicle of vehicles) {
    const checks = [
      { field:'insuranceExpiry', type:'insurance_expiring' as const, label:'Insurance' },
      { field:'pollutionExpiry', type:'pollution_expiring' as const, label:'Pollution certificate' },
    ];
    for (const check of checks) {
      const expiry = (vehicle as any)[check.field] as Date | undefined;
      if (!expiry) continue;
      const days = Math.ceil((new Date(expiry).setHours(0,0,0,0) - today.getTime()) / DAY_MS);
      if (days > 10) continue;
      const type = days < 0 ? 'compliance_expired' as const : check.type;
      const message = days < 0
        ? `${check.label} for ${vehicle.title} has expired. Renew it to keep the vehicle compliant.`
        : `${check.label} for ${vehicle.title} expires in ${days} day(s). Please arrange renewal.`;
      const since = new Date(today.getTime() - DAY_MS);
      const exists = await Notification.findOne({ recipient: vehicle.seller, vehicle: vehicle._id, type, createdAt: { $gte: since } });
      if (!exists) await Notification.create({ recipient: vehicle.seller, vehicle: vehicle._id, type, message });
    }
  }
};
