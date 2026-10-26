'use client';

import React, { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Button } from '../ui/Button';

interface FormData {
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phone: string;
  destination: string;
  countryOfResidence: string;
  occupation: string;
  contactMethod: 'email' | 'phone';
  message: string;
  privacyConsent: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  destination?: string;
  countryOfResidence?: string;
  message?: string;
  privacyConsent?: string;
}

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneCountryCode: '+44',
    phone: '',
    destination: 'not-sure',
    countryOfResidence: '',
    occupation: '',
    contactMethod: 'email',
    message: '',
    privacyConsent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitErrorSummary, setSubmitErrorSummary] = useState<string | null>(null);

  const validateField = (name: keyof FormData, value: any): string | undefined => {
    switch (name) {
      case 'fullName':
        if (!value || typeof value !== 'string' || !value.trim()) {
          return 'Full name is required.';
        }
        if (value.trim().length < 2) {
          return 'Please provide your full legal name.';
        }
        return undefined;

      case 'email':
        if (!value || typeof value !== 'string' || !value.trim()) {
          return 'Email address is required.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address.';
        }
        return undefined;

      case 'countryOfResidence':
        if (!value || typeof value !== 'string' || !value.trim()) {
          return 'Country of current residence is required.';
        }
        return undefined;

      case 'message':
        if (!value || typeof value !== 'string' || !value.trim()) {
          return 'Message is required.';
        }
        if (value.trim().length < 20) {
          return `Please write at least 20 characters (currently ${value.trim().length}).`;
        }
        return undefined;

      case 'privacyConsent':
        if (!value) {
          return 'You must consent to the privacy policy to proceed.';
        }
        return undefined;

      default:
        return undefined;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    const val = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));

    if (touched[name]) {
      const err = validateField(name as keyof FormData, val);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const val = type === 'checkbox' ? checked : value;

    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name as keyof FormData, val);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all as touched
    const allTouched: Record<string, boolean> = {
      fullName: true,
      email: true,
      countryOfResidence: true,
      message: true,
      privacyConsent: true,
    };
    setTouched(allTouched);

    const newErrors: FormErrors = {
      fullName: validateField('fullName', formData.fullName),
      email: validateField('email', formData.email),
      countryOfResidence: validateField('countryOfResidence', formData.countryOfResidence),
      message: validateField('message', formData.message),
      privacyConsent: validateField('privacyConsent', formData.privacyConsent),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => Boolean(err));

    if (hasErrors) {
      setSubmitErrorSummary('Please review and correct the highlighted fields before submitting.');
      return;
    }

    setSubmitErrorSummary(null);
    setIsSubmitting(true);

    // Mock submission: 1500ms
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div
        className="bg-white border border-[#DAD8D3] p-8 sm:p-12 text-center"
        role="alert"
        aria-live="polite"
      >
        <div className="w-16 h-16 bg-[#F5F4F1] border border-[#850D0D] flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-[#850D0D]" aria-hidden="true" />
        </div>
        <h3 className="font-heading font-bold text-2xl sm:text-3xl text-[#171717] mb-3">
          Inquiry Successfully Logged
        </h3>
        <p className="text-base text-[#777570] max-w-lg mx-auto leading-relaxed mb-6">
          Thank you for your inquiry. Our team will be in touch within 2 business days to review your background and provide preliminary guidance.
        </p>

        <div className="bg-[#F5F4F1] p-4 text-xs text-[#777570] text-left max-w-md mx-auto border border-[#DAD8D3] mb-8 space-y-1">
          <p className="font-semibold text-[#171717]">Submitted Details (Simulation):</p>
          <p><span className="text-[#171717]">Name:</span> {formData.fullName}</p>
          <p><span className="text-[#171717]">Contact:</span> {formData.email}</p>
          <p><span className="text-[#171717]">Destination:</span> {formData.destination.toUpperCase()}</p>
        </div>

        <div className="text-xs text-[#777570] italic mb-6">
          Notice: This is a demonstration form. No external network request was transmitted.
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              fullName: '',
              email: '',
              phoneCountryCode: '+44',
              phone: '',
              destination: 'not-sure',
              countryOfResidence: '',
              occupation: '',
              contactMethod: 'email',
              message: '',
              privacyConsent: false,
            });
            setTouched({});
            setErrors({});
          }}
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#DAD8D3] p-6 sm:p-10 lg:p-12 shadow-sm">
      <div className="mb-6 pb-6 border-b border-[#DAD8D3]">
        <h3 className="font-heading font-bold text-2xl text-[#171717] mb-2">
          Consultation Intake Form
        </h3>
        <p className="text-xs text-[#777570] leading-relaxed">
          Provide your preliminary background for review. Required fields are marked with an asterisk (<span className="text-[#850D0D] font-bold">*</span>).
        </p>
      </div>

      {submitErrorSummary && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 p-4 bg-[#850D0D]/10 border border-[#850D0D] text-[#850D0D] text-xs flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{submitErrorSummary}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-xs font-semibold uppercase tracking-wider text-[#171717] mb-2"
          >
            Full Name <span className="text-[#850D0D]">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            aria-invalid={Boolean(errors.fullName)}
            placeholder="e.g. Eleanor Vance"
            className={`w-full px-4 py-3 bg-[#F5F4F1] border text-sm text-[#171717] placeholder-[#777570]/60 focus:bg-white focus:outline-none focus:ring-1 ${
              errors.fullName && touched.fullName
                ? 'border-[#850D0D] focus:ring-[#850D0D]'
                : 'border-[#DAD8D3] focus:ring-[#850D0D]'
            }`}
          />
          {errors.fullName && touched.fullName && (
            <p id="fullName-error" className="mt-1.5 text-xs text-[#850D0D]">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-[#171717] mb-2"
            >
              Email Address <span className="text-[#850D0D]">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={Boolean(errors.email)}
              placeholder="eleanor@example.com"
              className={`w-full px-4 py-3 bg-[#F5F4F1] border text-sm text-[#171717] placeholder-[#777570]/60 focus:bg-white focus:outline-none focus:ring-1 ${
                errors.email && touched.email
                  ? 'border-[#850D0D] focus:ring-[#850D0D]'
                  : 'border-[#DAD8D3] focus:ring-[#850D0D]'
              }`}
            />
            {errors.email && touched.email && (
              <p id="email-error" className="mt-1.5 text-xs text-[#850D0D]">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-semibold uppercase tracking-wider text-[#171717] mb-2"
            >
              Phone Number <span className="text-xs text-[#777570] font-normal">(Optional)</span>
            </label>
            <div className="flex">
              <select
                id="phoneCountryCode"
                name="phoneCountryCode"
                aria-label="Phone country dialing code"
                value={formData.phoneCountryCode}
                onChange={handleChange}
                className="w-24 px-2 py-3 bg-[#EAE8E3] border border-r-0 border-[#DAD8D3] text-xs text-[#171717] focus:outline-none"
              >
                <option value="+44">+44 (UK)</option>
                <option value="+1">+1 (US/CA)</option>
                <option value="+40">+40 (RO)</option>
                <option value="+385">+385 (HR)</option>
                <option value="+358">+358 (FI)</option>
                <option value="+91">+91 (IN)</option>
                <option value="+971">+971 (UAE)</option>
                <option value="+63">+63 (PH)</option>
                <option value="+234">+234 (NG)</option>
              </select>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="7911 123456"
                className="w-full px-4 py-3 bg-[#F5F4F1] border border-[#DAD8D3] text-sm text-[#171717] placeholder-[#777570]/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#850D0D]"
              />
            </div>
          </div>
        </div>

        {/* Destination & Country of Residence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="destination"
              className="block text-xs font-semibold uppercase tracking-wider text-[#171717] mb-2"
            >
              Target Destination
            </label>
            <select
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#F5F4F1] border border-[#DAD8D3] text-sm text-[#171717] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#850D0D]"
            >
              <option value="romania">Romania (IGI / WorkinRomania)</option>
              <option value="croatia">Croatia (MUP / Single Permit)</option>
              <option value="finland">Finland (Migri / Enter Finland)</option>
              <option value="not-sure">Not sure yet (Comparative assessment)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="countryOfResidence"
              className="block text-xs font-semibold uppercase tracking-wider text-[#171717] mb-2"
            >
              Country of Residence <span className="text-[#850D0D]">*</span>
            </label>
            <input
              id="countryOfResidence"
              name="countryOfResidence"
              type="text"
              required
              value={formData.countryOfResidence}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-describedby={errors.countryOfResidence ? 'residence-error' : undefined}
              aria-invalid={Boolean(errors.countryOfResidence)}
              placeholder="e.g. United Kingdom, India, UAE"
              className={`w-full px-4 py-3 bg-[#F5F4F1] border text-sm text-[#171717] placeholder-[#777570]/60 focus:bg-white focus:outline-none focus:ring-1 ${
                errors.countryOfResidence && touched.countryOfResidence
                  ? 'border-[#850D0D] focus:ring-[#850D0D]'
                  : 'border-[#DAD8D3] focus:ring-[#850D0D]'
              }`}
            />
            {errors.countryOfResidence && touched.countryOfResidence && (
              <p id="residence-error" className="mt-1.5 text-xs text-[#850D0D]">
                {errors.countryOfResidence}
              </p>
            )}
          </div>
        </div>

        {/* Occupation */}
        <div>
          <label
            htmlFor="occupation"
            className="block text-xs font-semibold uppercase tracking-wider text-[#171717] mb-2"
          >
            Employment Background / Occupation <span className="text-xs text-[#777570] font-normal">(Optional)</span>
          </label>
          <input
            id="occupation"
            name="occupation"
            type="text"
            value={formData.occupation}
            onChange={handleChange}
            placeholder="e.g. Software Engineer, Civil Project Lead, Mechanical Tech"
            className="w-full px-4 py-3 bg-[#F5F4F1] border border-[#DAD8D3] text-sm text-[#171717] placeholder-[#777570]/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#850D0D]"
          />
        </div>

        {/* Preferred Contact Method */}
        <div>
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wider text-[#171717] mb-2">
              Preferred Contact Method
            </legend>
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-[#171717]">
                <input
                  type="radio"
                  name="contactMethod"
                  value="email"
                  checked={formData.contactMethod === 'email'}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#850D0D] focus:ring-[#850D0D]"
                />
                <span>Email</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-[#171717]">
                <input
                  type="radio"
                  name="contactMethod"
                  value="phone"
                  checked={formData.contactMethod === 'phone'}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#850D0D] focus:ring-[#850D0D]"
                />
                <span>Phone / WhatsApp</span>
              </label>
            </div>
          </fieldset>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-xs font-semibold uppercase tracking-wider text-[#171717] mb-2"
          >
            Message & Background Summary <span className="text-[#850D0D]">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-describedby={errors.message ? 'message-error' : undefined}
            aria-invalid={Boolean(errors.message)}
            placeholder="Outline your current job offer status, target country, qualifications, and specific questions (minimum 20 characters)..."
            className={`w-full px-4 py-3 bg-[#F5F4F1] border text-sm text-[#171717] placeholder-[#777570]/60 focus:bg-white focus:outline-none focus:ring-1 ${
              errors.message && touched.message
                ? 'border-[#850D0D] focus:ring-[#850D0D]'
                : 'border-[#DAD8D3] focus:ring-[#850D0D]'
            }`}
          />
          {errors.message && touched.message && (
            <p id="message-error" className="mt-1.5 text-xs text-[#850D0D]">
              {errors.message}
            </p>
          )}
        </div>

        {/* Privacy Consent */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              id="privacyConsent"
              name="privacyConsent"
              type="checkbox"
              required
              checked={formData.privacyConsent}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-describedby={errors.privacyConsent ? 'privacy-error' : undefined}
              className="mt-1 w-4 h-4 text-[#850D0D] focus:ring-[#850D0D] rounded-none"
            />
            <span className="text-xs text-[#777570] leading-relaxed">
              I consent to ORSA collecting and holding my personal data for the purpose of communicating regarding my inquiry, in compliance with GDPR standards. <span className="text-[#850D0D]">*</span>
            </span>
          </label>
          {errors.privacyConsent && touched.privacyConsent && (
            <p id="privacy-error" className="mt-1.5 text-xs text-[#850D0D]">
              {errors.privacyConsent}
            </p>
          )}
        </div>

        {/* Demonstration Note */}
        <div className="flex items-center gap-2 p-3 bg-[#F5F4F1] border border-[#DAD8D3] text-[11px] text-[#777570]">
          <Info className="w-3.5 h-3.5 text-[#850D0D] flex-shrink-0" />
          <span>This is a demonstration form with simulated client intake validation.</span>
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Inquiry...</span>
              </>
            ) : (
              <span>Submit Consultation Request</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
