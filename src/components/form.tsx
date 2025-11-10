"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
interface FormProps {
  onSuccessChange?: (success: boolean) => void;
}

export default function WaitlistForm({ onSuccessChange }: FormProps) {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    preorders: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const quantityOptions = [
    { value: "1", label: "1 Device", description: "Perfect for personal use" },
    { value: "2", label: "2 Devices", description: "For you and a partner" },
    { value: "3", label: "3 Devices", description: "Small team setup" },
    { value: "5", label: "5 Devices", description: "Team collaboration" },
    { value: "10", label: "10+ Devices", description: "Enterprise solution" },
  ];
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate all fields at once
    if (!formData.email || !isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    
    const preorderCount = Number(formData.preorders);
    if (!Number.isFinite(preorderCount) || !Number.isInteger(preorderCount) || preorderCount <= 0) {
      toast.error("Please enter a valid number of devices (whole number > 0)");
      return;
    }

    try {
      setLoading(true);

      const promise = new Promise((resolve, reject) => {
        const { name, email } = formData;

        fetch("/api/mail", {
          cache: "no-store",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firstname: name, email, preorders: preorderCount }),
        })
          .then((mailResponse) => {
            if (!mailResponse.ok) {
              if (mailResponse.status === 429) {
                reject("Rate limited");
              } else {
                reject("Email sending failed");
              }
              return null;
            }

            return fetch("/api/notion", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name, email, preorders: preorderCount }),
            });
          })
          .then((notionResponse) => {
            if (!notionResponse) return;

            if (!notionResponse.ok) {
              if (notionResponse.status === 429) {
                reject("Rate limited");
              } else {
                reject("Notion insertion failed");
              }
            } else {
              resolve({ name });
            }
          })
          .catch((error) => {
            reject(error);
          });
      });

      toast.promise(promise, {
        loading: "Getting you on the waitlist... 🚀",
        success: (data) => {
          setFormData({ email: "", name: "", preorders: "" });
          setSuccess(true);
          onSuccessChange?.(true);
          setTimeout(() => {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: [
                "#ff0000",
                "#00ff00",
                "#0000ff",
                "#ffff00",
                "#ff00ff",
                "#00ffff",
              ],
            });
          }, 100);
          return "Thank you for joining the waitlist 🎉";
        },
        error: (error) => {
          if (error === "Rate limited") {
            return "You're doing that too much. Please try again later";
          }
          if (error === "Email sending failed") {
            return "Failed to send email. Please try again 😢.";
          }
          if (error === "Notion insertion failed") {
            return "Failed to save your details. Please try again 😢.";
          }
          return "An error occurred. Please try again 😢.";
        },
      });

      promise.finally(() => {
        setLoading(false);
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({ email: "", name: "", preorders: "" });
    setSuccess(false);
    setDropdownOpen(false);
    onSuccessChange?.(false);
  };

  const selectedOption = quantityOptions.find(option => option.value === formData.preorders);

  return (
    <div className="w-full relative">
      {success ? (
        <motion.div
          className="text-center p-8 bg-background border border-border rounded-[12px]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="mb-4">
            <svg className="w-16 h-16 text-blue-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Preorder Confirmed!</h3>
          <p className="text-muted-foreground mb-6">Thank you for your preorder. We'll send you updates as we prepare your device.</p>
          <button
            onClick={resetForm}
            className="bg-blue-500 text-white px-6 py-3 rounded-[12px] font-semibold hover:bg-blue-600 transition-all"
            type="button"
          >
            Preorder Another Device
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background border border-border rounded-[12px] p-6"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-2">Reserve Your Device</h3>
            <p className="text-muted-foreground text-sm">Join the exclusive preorder list for early access</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full bg-background border border-border text-foreground px-4 py-3 rounded-[12px] focus:outline-1 transition-all duration-300 focus:outline-offset-4 focus:outline-blue-500"
                disabled={loading}
                required
              />
            </div>
            
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full bg-background border border-border text-foreground px-4 py-3 rounded-[12px] focus:outline-1 transition-all duration-300 focus:outline-offset-4 focus:outline-blue-500"
                disabled={loading}
                required
              />
            </div>
            
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full bg-background border border-border text-foreground px-4 py-3 rounded-[12px] focus:outline-1 transition-all duration-300 focus:outline-offset-4 focus:outline-blue-500 flex items-center justify-between"
                disabled={loading}
              >
                <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
                  {selectedOption ? selectedOption.label : "Select number of devices"}
                </span>
                <svg
                  className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-[12px] shadow-lg z-50 overflow-hidden"
                  >
                    {quantityOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, preorders: option.value }));
                          setDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex flex-col"
                      >
                        <span className="text-foreground font-medium">{option.label}</span>
                        <span className="text-muted-foreground text-sm">{option.description}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/50 rounded-[12px] p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Early Bird Pricing</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Preorder customers get 20% off retail price and priority shipping in early 2026.</p>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-4 px-6 rounded-[12px] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing Preorder...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure Preorder - $0 Today
                </span>
              )}
            </button>
            
            <p className="text-xs text-muted-foreground text-center">
              payment required. We'll contact you with pricing and payment details before shipping.
            </p>
          </form>
        </motion.div>
      )}
    </div>
  );
}
