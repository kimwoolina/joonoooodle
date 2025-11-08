import { generateFakeContact, formatPhoneNumber } from '../../utils/fakeDataGenerator';
import Input from '../UI/Input';
import Button from '../UI/Button';
import './ContactFields.css';

export default function ContactFields({ register, errors, setValue }) {
  const handleGenerateFakeData = () => {
    const fakeContact = generateFakeContact();
    setValue('contact.name', fakeContact.name);
    setValue('contact.email', fakeContact.email);
    setValue('contact.phone', fakeContact.phone);
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue('contact.phone', formatted);
  };

  return (
    <div className="contact-fields">
      <div className="section-header">
        <h3>Contact Information</h3>
        <Button
          type="button"
          variant="outline"
          onClick={handleGenerateFakeData}
        >
          Generate Demo Data
        </Button>
      </div>
      <p className="demo-notice">
        This is demo/testing data. Use the "Generate Demo Data" button to auto-fill fake information.
      </p>

      <Input
        label="Name"
        name="contact.name"
        placeholder="Kim Min-jun (Demo)"
        register={register}
        error={errors?.contact?.name?.message}
        required
      />

      <Input
        label="Email"
        name="contact.email"
        type="email"
        placeholder="demo.user@example.com"
        register={register}
        error={errors?.contact?.email?.message}
        required
      />

      <Input
        label="Phone"
        name="contact.phone"
        type="tel"
        placeholder="010-1234-5678"
        register={register}
        error={errors?.contact?.phone?.message}
        onChange={handlePhoneChange}
        required
      />
    </div>
  );
}
