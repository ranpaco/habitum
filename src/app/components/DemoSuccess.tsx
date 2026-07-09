import { useState } from "react";
import { CheckCircle, Calendar, Clock, Video, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface DemoSuccessProps {
  formData: any;
}

export function DemoSuccess({ formData }: DemoSuccessProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isBooked, setIsBooked] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0);

  // Generate next 14 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    today.setDate(today.getDate() + 1); // Start from tomorrow
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }
    return dates;
  };

  const dates = generateDates();
  const visibleDates = dates.slice(currentWeek * 5, (currentWeek + 1) * 5);

  // Available time slots (9 AM - 5 PM)
  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", 
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleBooking = () => {
    setIsBooked(true);
  };

  if (isBooked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-8 shadow-2xl animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold text-[#1A365D] mb-6">
            You're All Set! 🎉
          </h1>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <p className="text-xl text-gray-700 mb-6">
              Your demo has been scheduled for:
            </p>
            
            <div className="bg-gradient-to-r from-[#00A3BF]/10 to-[#1A365D]/10 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center gap-4 mb-3">
                <Calendar className="w-6 h-6 text-[#00A3BF]" />
                <span className="text-2xl font-bold text-[#1A365D]">
                  {selectedDate && formatDate(selectedDate)}
                </span>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Clock className="w-6 h-6 text-[#00A3BF]" />
                <span className="text-2xl font-bold text-[#1A365D]">
                  {selectedTime}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-left mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <p className="text-gray-700">Calendar invitation sent to <strong>{formData.email}</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <Video className="w-5 h-5 text-[#00A3BF] mt-0.5" />
                <p className="text-gray-700">Zoom link included in confirmation email</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <p className="text-gray-700">SMS reminder 1 hour before your demo</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Pro Tip:</strong> To make the most of your demo, have your current unit list and 
                outstanding balances ready. We'll show you how Habitum can digitize them instantly!
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => window.location.hash = ""}
              size="lg"
              className="bg-gradient-to-r from-[#00A3BF] to-[#1A365D] hover:from-[#00A3BF]/90 hover:to-[#1A365D]/90 text-white px-8"
            >
              Return to Homepage
            </Button>
            
            <p className="text-gray-600">
              Questions? Email us at <a href="mailto:demos@habitum.io" className="text-[#00A3BF] hover:underline">demos@habitum.io</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 shadow-xl">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold text-[#1A365D] mb-4">
            Thank You, {formData.name.split(' ')[0]}!
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-2">
            We're excited to show you how Habitum can transform {formData.condoName}'s management.
          </p>
          
          <p className="text-lg text-gray-600 font-semibold">
            Book your optimal time slot below
          </p>
        </div>

        {/* Scheduler Interface */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1A365D] to-[#00A3BF] px-8 py-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-2xl font-bold mb-1">Select Your Demo Time</h2>
                <p className="text-white/80">30-minute personalized walkthrough via Zoom</p>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Video className="w-5 h-5" />
                <span className="font-semibold">Video Call</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Date Selection */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#1A365D]">Select a Date</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
                      disabled={currentWeek === 0}
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-[#1A365D]" />
                    </button>
                    <button
                      onClick={() => setCurrentWeek(Math.min(1, currentWeek + 1))}
                      disabled={currentWeek === 1}
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-[#1A365D]" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {visibleDates.map((date, index) => {
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime(""); // Reset time when date changes
                        }}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? 'border-[#00A3BF] bg-[#00A3BF]/5 shadow-md'
                            : 'border-gray-200 hover:border-[#00A3BF]/50 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`font-semibold ${isSelected ? 'text-[#00A3BF]' : 'text-[#1A365D]'}`}>
                              {date.toLocaleDateString('en-US', { weekday: 'long' })}
                            </p>
                            <p className="text-sm text-gray-600">
                              {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 bg-[#00A3BF] rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <h3 className="text-xl font-bold text-[#1A365D] mb-6">
                  {selectedDate ? 'Available Times' : 'Select a date first'}
                </h3>

                {selectedDate ? (
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((time, index) => {
                      const isSelected = selectedTime === time;
                      // Simulate some slots being taken
                      const isTaken = index === 2 || index === 4;
                      
                      return (
                        <button
                          key={index}
                          onClick={() => !isTaken && setSelectedTime(time)}
                          disabled={isTaken}
                          className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                            isTaken
                              ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                              : isSelected
                              ? 'border-[#00A3BF] bg-[#00A3BF] text-white shadow-lg'
                              : 'border-gray-200 text-[#1A365D] hover:border-[#00A3BF] hover:bg-[#00A3BF]/5'
                          }`}
                        >
                          {time}
                          {isTaken && <div className="text-xs mt-1">Taken</div>}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">Please select a date to see available times</p>
                    </div>
                  </div>
                )}

                {/* Booking Summary */}
                {selectedDate && selectedTime && (
                  <div className="mt-8 bg-gradient-to-r from-[#00A3BF]/10 to-[#1A365D]/10 rounded-xl p-6 border-2 border-[#00A3BF]/30">
                    <h4 className="font-bold text-[#1A365D] mb-4">Your Selected Time:</h4>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-[#00A3BF]" />
                        <span className="font-semibold text-[#1A365D]">{formatDate(selectedDate)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-[#00A3BF]" />
                        <span className="font-semibold text-[#1A365D]">{selectedTime}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Video className="w-5 h-5 text-[#00A3BF]" />
                        <span className="text-sm text-gray-600">30-minute Zoom call</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleBooking}
                      size="lg"
                      className="w-full bg-gradient-to-r from-[#00A3BF] to-[#1A365D] hover:from-[#00A3BF]/90 hover:to-[#1A365D]/90 text-white font-semibold shadow-xl hover:shadow-2xl transition-all"
                    >
                      Confirm Booking
                      <CheckCircle className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h4 className="font-bold text-[#1A365D] mb-4">What to Expect:</h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-[#00A3BF]/10 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-[#00A3BF]">1</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A365D] mb-1">Personalized Demo</p>
                    <p className="text-sm text-gray-600">See Habitum configured for {formData.condoName}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-[#00A3BF]/10 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-[#00A3BF]">2</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A365D] mb-1">Live AI Demo</p>
                    <p className="text-sm text-gray-600">Watch our WhatsApp AI handle real scenarios</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-[#00A3BF]/10 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-[#00A3BF]">3</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A365D] mb-1">Custom Pricing</p>
                    <p className="text-sm text-gray-600">Get a quote tailored to your needs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
