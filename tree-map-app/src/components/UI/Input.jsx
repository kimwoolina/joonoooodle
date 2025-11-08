import './Input.css';

export default function Input({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  register,
  ...props
}) {
  const inputProps = register ? register(name) : { name, value, onChange };

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        id={name}
        type={type}
        className={`input ${error ? 'input-error' : ''}`}
        placeholder={placeholder}
        {...inputProps}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}
