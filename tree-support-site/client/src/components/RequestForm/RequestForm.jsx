import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { validationRules } from './FormValidation';
import EmergencyTypeSelect from './EmergencyTypeSelect';
import ContactFields from './ContactFields';
import LocationFields from './LocationFields';
import Button from '../UI/Button';
import './RequestForm.css';

export default function RequestForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emergencyType: '',
      contact: {
        name: '',
        email: '',
        phone: '',
      },
      location: {
        address: '',
        crossStreets: '',
        district: '',
        landmarks: '',
      },
      description: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await api.createRequest(data);
      // Navigate to confirmation page with request data
      navigate('/confirmation', { state: { request: response.request } });
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit request. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="request-form-container">
      <div className="form-header">
        <h1>Tree Emergency Service Request</h1>
        <p>Submit a report for fallen trees, branch hazards, or root damage</p>
      </div>

      {submitError && (
        <div className="alert alert-error">
          <strong>Error:</strong> {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="request-form">
        <EmergencyTypeSelect
          register={register}
          error={errors.emergencyType}
        />

        <ContactFields
          register={register}
          errors={errors}
          setValue={setValue}
        />

        <LocationFields
          register={register}
          errors={errors}
        />

        <div className="description-field">
          <label htmlFor="description" className="input-label">
            Description (Optional)
          </label>
          <textarea
            id="description"
            className="textarea"
            placeholder="Provide additional details about the tree emergency..."
            rows="5"
            {...register('description', validationRules.description)}
          />
          {errors.description && (
            <span className="error-message">{errors.description.message}</span>
          )}
        </div>

        <div className="form-actions">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            fullWidth
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </form>
    </div>
  );
}
