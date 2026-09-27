import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  FileText,
  ImagePlus,
  IndianRupee,
  Settings2,
  ShieldCheck,
} from 'lucide-react';
import { vehicleAPI } from './api/vehicles';

const steps = [
  ['Basics', 'Vehicle identity'],
  ['Media', 'Photos'],
  ['Documents', 'Compliance'],
  ['Pricing', 'Rental rules'],
  ['Publish', 'Review & publish'],
];

const initialForm = {
  vehicleName: '',
  brand: '',
  model: '',
  vehicleType: 'bike',
  engineCC: '',
  fuelType: 'Petrol',
  transmission: 'Manual',
  registrationNumber: '',
  seatingCapacity: '',
  engineSegment: '',
  city: '',
  rcDocument: '',
  insuranceStartDate: '',
  insuranceExpiry: '',
  insuranceDocument: '',
  pollutionStartDate: '',
  pollutionExpiry: '',
  pollutionDocument: '',
  pricePerHour: '',
  pricePerDay: '',
  securityDeposit: '',
  lateReturnCharge: '',
  minRentalDuration: '1',
  maxRentalDuration: '30',
  deliveryAvailable: false,
  deliveryChargePerKm: '',
  description: '',
};

export default function VehicleOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(initialForm);

  const set = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const input = (key, label, type = 'text') => (
    <label className="text-xs text-white/40" key={key}>
      {label}
      <input
        type={type}
        value={form[key]}
        onChange={(event) => set(key, event.target.value)}
        className="mt-2 w-full rounded-xl bg-black/25 border border-white/10 p-3 text-sm text-white outline-none"
      />
    </label>
  );

  const next = () => {
    setError('');

    if (step === 0 && !form.vehicleName.trim()) {
      setError('Vehicle name is required.');
      return;
    }

    if (step === 0 && !form.registrationNumber.trim()) {
      setError('Registration number is required.');
      return;
    }

    if (step === 2) {
      if (!form.insuranceExpiry || !form.pollutionExpiry) {
        setError('Insurance and pollution expiry dates are required.');
        return;
      }
    }

    if (step === 3 && (!form.pricePerDay || Number(form.pricePerDay) <= 0)) {
      setError('Enter a valid daily rental price.');
      return;
    }

    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const submit = async () => {
    setSaving(true);
    setError('');

    try {
      const response = await vehicleAPI.createVehicle({
        ...form,
        complianceStatus: 'pending',
        verificationStatus: 'pending',
        publishStatus: 'pending',
      });

      navigate('/seller-dashboard', {
        state: { createdVehicle: response?.vehicle || response },
      });
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          'Unable to create vehicle'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#08090b] text-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-white/40"
        >
          <ArrowLeft size={16} className="inline mr-2" />
          Back
        </button>

        <div className="mt-8 grid lg:grid-cols-[220px_1fr] gap-8">
          <aside>
            <p className="text-xs uppercase tracking-[.25em] text-amber-300">
              Fleet onboarding
            </p>
            <h1 className="mt-3 text-3xl font-semibold">Add a vehicle.</h1>

            <div className="mt-8 space-y-2">
              {steps.map(([name, description], index) => (
                <div
                  key={name}
                  className={
                    'rounded-xl p-3 ' +
                    (index === step ? 'bg-white/[.07]' : '')
                  }
                >
                  <div className="flex gap-3 items-center">
                    <span
                      className={
                        'h-7 w-7 rounded-full grid place-items-center text-xs ' +
                        (index < step
                          ? 'bg-emerald-300 text-black'
                          : index === step
                            ? 'bg-white text-black'
                            : 'bg-white/10 text-white/35')
                      }
                    >
                      {index < step ? <Check size={14} /> : index + 1}
                    </span>
                    <div>
                      <p className="text-sm">{name}</p>
                      <p className="text-[11px] text-white/30">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <section className="rounded-[2rem] border border-white/10 bg-white/[.035] p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-amber-300/10 grid place-items-center text-amber-300">
                {step === 0 ? (
                  <Settings2 />
                ) : step === 1 ? (
                  <ImagePlus />
                ) : step === 2 ? (
                  <FileText />
                ) : step === 3 ? (
                  <IndianRupee />
                ) : (
                  <ShieldCheck />
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Step {step + 1} / {steps.length}
                </p>
                <h2 className="text-2xl font-semibold">{steps[step][1]}</h2>
              </div>
            </div>

            {step === 0 && (
              <div className="mt-8 grid md:grid-cols-2 gap-4">
                {input('vehicleName', 'Vehicle display name')}
                {input('brand', 'Brand')}
                {input('model', 'Model')}
                {input('engineCC', 'Engine capacity (cc)', 'number')}
                <label className="text-xs text-white/40">
                  Vehicle type
                  <select
                    value={form.vehicleType}
                    onChange={(event) => set('vehicleType', event.target.value)}
                    className="mt-2 w-full rounded-xl bg-black/25 border border-white/10 p-3 text-sm text-white"
                  >
                    <option value="bike">Bike</option>
                    <option value="scooter">Scooter</option>
                    <option value="car">Car</option>
                  </select>
                </label>
                <label className="text-xs text-white/40">
                  Fuel
                  <select
                    value={form.fuelType}
                    onChange={(event) => set('fuelType', event.target.value)}
                    className="mt-2 w-full rounded-xl bg-black/25 border border-white/10 p-3 text-sm text-white"
                  >
                    <option>Petrol</option>
                    <option>Electric</option>
                    <option>Diesel</option>
                  </select>
                </label>
                <label className="text-xs text-white/40">
                  Transmission
                  <select
                    value={form.transmission}
                    onChange={(event) =>
                      set('transmission', event.target.value)
                    }
                    className="mt-2 w-full rounded-xl bg-black/25 border border-white/10 p-3 text-sm text-white"
                  >
                    <option>Manual</option>
                    <option>Automatic</option>
                  </select>
                </label>
                {input('registrationNumber', 'Registration number')}
                {input('seatingCapacity', 'Seating capacity', 'number')}
                {input('engineSegment', 'Engine segment')}
                {input('city', 'City')}
              </div>
            )}

            {step === 1 && (
              <div className="mt-8 rounded-2xl border border-dashed border-white/15 p-12 text-center">
                <ImagePlus className="mx-auto text-amber-300" size={32} />
                <h3 className="mt-4 text-lg font-medium">Add vehicle photos</h3>
                <p className="mt-2 text-sm text-white/35">
                  Upload clear front, rear, side and dashboard photos. Files
                  must be reviewed before a vehicle can be published.
                </p>
                <button
                  type="button"
                  className="mt-6 rounded-xl border border-white/10 px-5 py-3 text-sm"
                >
                  Choose photos
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="mt-8 grid md:grid-cols-2 gap-4">
                {input('insuranceStartDate', 'Insurance start date', 'date')}
                {input('insuranceExpiry', 'Insurance expiry date', 'date')}
                {input('pollutionStartDate', 'PUC start date', 'date')}
                {input('pollutionExpiry', 'PUC expiry date', 'date')}
                <div className="rounded-xl border border-dashed border-white/15 p-5 text-sm text-white/40">
                  RC document upload — verification required
                </div>
                <div className="rounded-xl border border-dashed border-white/15 p-5 text-sm text-white/40">
                  Insurance document upload — verification required
                </div>
                <div className="rounded-xl border border-dashed border-white/15 p-5 text-sm text-white/40">
                  Pollution certificate upload — verification required
                </div>
                <div className="md:col-span-2 rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm text-amber-100/70">
                  Documents remain pending until the applicable official
                  verification source confirms them. A pending vehicle cannot
                  be published or rented.
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mt-8 grid md:grid-cols-2 gap-4">
                {input('pricePerHour', 'Price per hour', 'number')}
                {input('pricePerDay', 'Price per day', 'number')}
                {input('securityDeposit', 'Security deposit', 'number')}
                {input('lateReturnCharge', 'Late return charge / day', 'number')}
                {input('minRentalDuration', 'Minimum rental duration (days)', 'number')}
                {input('maxRentalDuration', 'Maximum rental duration (days)', 'number')}
                {input('deliveryChargePerKm', 'Delivery charge / km', 'number')}
              </div>
            )}

            {step === 4 && (
              <div className="mt-8 space-y-4">
                <div className="rounded-2xl border border-white/10 p-5">
                  <p className="font-medium">
                    {form.vehicleName || 'Untitled vehicle'}
                  </p>
                  <p className="text-sm text-white/40 mt-1">
                    {form.brand} {form.model} · {form.vehicleType} ·{' '}
                    {form.fuelType}
                  </p>
                  <p className="mt-4 text-xl">
                    ₹{Number(form.pricePerDay || 0).toLocaleString('en-IN')}{' '}
                    <span className="text-xs text-white/35">/ day</span>
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-white/[.03]">
                    <ShieldCheck className="text-emerald-300" size={17} />
                    <p className="mt-2 text-sm">Documents pending review</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[.03]">
                    <ImagePlus className="text-amber-300" size={17} />
                    <p className="mt-2 text-sm">Photos ready</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[.03]">
                    <IndianRupee className="text-amber-300" size={17} />
                    <p className="mt-2 text-sm">Pricing configured</p>
                  </div>
                </div>

                <p className="text-xs text-white/35">
                  Creating this vehicle submits it for verification. It will
                  not become publicly bookable until required documents and
                  compliance checks are approved.
                </p>
              </div>
            )}

            {error && <p className="mt-6 text-sm text-red-300">{error}</p>}

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                disabled={!step}
                onClick={() => setStep((current) => current - 1)}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm disabled:opacity-30"
              >
                Previous
              </button>

              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  className="rounded-xl bg-white text-black px-5 py-3 font-semibold"
                >
                  Continue <ChevronRight size={16} className="inline" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={saving}
                  onClick={submit}
                  className="rounded-xl bg-amber-300 text-black px-6 py-3 font-semibold disabled:opacity-50"
                >
                  {saving ? 'Submitting…' : 'Submit for verification'}
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
