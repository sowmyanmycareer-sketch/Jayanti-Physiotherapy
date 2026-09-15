import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CLINIC_INFO, CLINIC_SERVICES } from '../data/clinicData';
import { 
  Calendar, 
  Clock, 
  Phone, 
  User, 
  X, 
  CheckCircle2, 
  MessageCircle, 
  Sparkles,
  MapPin
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTreatment?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({ 
  isOpen, 
  onClose,
  preselectedTreatment = 'Comprehensive Biomechanical Consultation'
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [condition, setCondition] = useState('Spine & Lower Back Pain');
  const [treatmentType, setTreatmentType] = useState(preselectedTreatment);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);

  useEffect(() => {
    if (preselectedTreatment) {
      setTreatmentType(preselectedTreatment);
    }
  }, [preselectedTreatment]);

  // Set default tomorrow date
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  if (!isOpen) return null;

  const timeSlots = [
    '08:30 AM', '09:30 AM', '10:30 AM', '11:30 AM', '12:30 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          selectedDate,
          preferredTime,
          conditionOrPainArea: condition,
          treatmentType,
          notes
        })
      });
      const data = await response.json();
      if (data && data.success) {
        setBookingSuccess(data);
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Error booking appointment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppConfirmationUrl = () => {
    const msg = `Hello Jayanti Physiotherapy Clinic, I booked an appointment via your 3D Website:\n• Name: ${fullName}\n• Phone: ${phone}\n• Slot: ${selectedDate} at ${preferredTime}\n• Condition: ${condition}\n• Service: ${treatmentType}\nPlease confirm my slot.`;
    return `https://wa.me/${CLINIC_INFO.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-400" />
              Book Clinical Consultation
            </h3>
            <p className="text-xs text-slate-400">
              Jayanti Physiotherapy Clinic • Dasarahalli, Bengaluru
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation Screen */}
        {bookingSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-teal-500/20 border border-teal-500 flex items-center justify-center mx-auto text-teal-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-bold text-white">
                Appointment Requested!
              </h4>
              <p className="text-xs font-mono text-teal-400">
                Reference ID: {bookingSuccess.appointmentId}
              </p>
              <p className="text-xs text-slate-300 max-w-sm mx-auto pt-1">
                {bookingSuccess.message}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 text-left space-y-1">
              <div><strong>Patient:</strong> {fullName} ({phone})</div>
              <div><strong>Scheduled For:</strong> {selectedDate} at {preferredTime}</div>
              <div><strong>Location:</strong> 26, 7th Cross Rd, Dasarahalli (Between Bharat Petrol Pump & Sangeetha Mobile)</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={getWhatsAppConfirmationUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm on WhatsApp</span>
              </a>

              <button
                onClick={onClose}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            
            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Patient Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Reddy"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  WhatsApp / Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 00000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Preferred Slot
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Condition / Pain Area */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Primary Pain Concern or Joint
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="Spine & Lower Back Pain">Spine & Lower Back Pain / Sciatica</option>
                <option value="Cervical Spondylosis / Neck">Cervical Spondylosis / Neck & Shoulder</option>
                <option value="Frozen Shoulder">Frozen Shoulder / Rotator Cuff</option>
                <option value="Knee Arthritis / Meniscus">Knee Osteoarthritis / Post-TKR Rehab</option>
                <option value="Sports Injury / ACL">Sports Injury / ACL / Ankle Sprain</option>
                <option value="Neurological / Stroke Rehab">Neurological Rehab / Stroke Hemiplegia</option>
                <option value="General Posture Consultation">General Posture & Biomechanical Audit</option>
              </select>
            </div>

            {/* Treatment Type */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Requested Modality / Treatment
              </label>
              <input
                type="text"
                value={treatmentType}
                onChange={(e) => setTreatmentType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Additional notes */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Additional Clinical Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Doctor prescribed IFT and cervical traction; bringing recent MRI report"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Securing Slot...' : 'Confirm Appointment Request'}</span>
            </button>

            <p className="text-[11px] text-center text-slate-400">
              No advance payment required. Clinic desk will confirm availability via WhatsApp/SMS.
            </p>

          </form>
        )}

      </div>
    </div>
  );
};
