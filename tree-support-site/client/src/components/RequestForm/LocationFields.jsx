import { getDistricts } from '../../utils/fakeDataGenerator';
import Input from '../UI/Input';
import './LocationFields.css';

export default function LocationFields({ register, errors }) {
  const districts = getDistricts();

  return (
    <div className="location-fields">
      <h3>Location Details</h3>

      <Input
        label="Street Address"
        name="location.address"
        placeholder="456 Teheran-ro, Gangnam-gu, Seoul"
        register={register}
        error={errors?.location?.address?.message}
        required
      />

      <Input
        label="Cross Streets (Optional)"
        name="location.crossStreets"
        placeholder="Near intersection with Samseong-ro"
        register={register}
        error={errors?.location?.crossStreets?.message}
      />

      <div className="input-group">
        <label htmlFor="location.district" className="input-label">
          District <span className="required">*</span>
        </label>
        <select
          id="location.district"
          className={`input ${errors?.location?.district ? 'input-error' : ''}`}
          {...register('location.district')}
        >
          <option value="">Select a district</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
        {errors?.location?.district && (
          <span className="error-message">{errors.location.district.message}</span>
        )}
      </div>

      <Input
        label="Landmarks or Special Instructions (Optional)"
        name="location.landmarks"
        placeholder="Across from COEX Mall, near bus stop #23"
        register={register}
        error={errors?.location?.landmarks?.message}
      />
    </div>
  );
}
