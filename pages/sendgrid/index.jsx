import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function SendGrid() {
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });

  const [inputs, setInputs] = useState({
    email: '',
    message: '',
  });

  const { register, handleSubmit, errors } = useForm();

  const handleResponse = (status, msg) => {
    if (status === 200) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: msg },
      });
      setInputs({
        email: '',
        message: '',
      });
    } else {
      setStatus({
        info: { error: true, msg: msg },
      });
    }
  };

  const handleOnChange = (e) => {
    e.persist();
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    setStatus({
      submitted: false,
      submitting: false,
      info: { error: false, msg: null },
    });
  };

  const handleOnSubmit = async ({}, e) => {
    e.preventDefault();
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));
    const res = await fetch('/api/sendgrid/contactus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    });
    const text = await res.text();
    handleResponse(res.status, text);
  };

  return (
    <main>
      <form onSubmit={handleSubmit(handleOnSubmit)} noValidate>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          onChange={handleOnChange}
          name="email"
          ref={register({ required: 'this field is required' })}
          value={inputs.email}
        />
        {errors.email && <span>{errors.email.message}</span>}

        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          onChange={handleOnChange}
          value={inputs.message}
          name="message"
          ref={register({ required: 'this field is required' })}
        />
        {errors.message && <span>{errors.message.message}</span>}

        <button type="submit" disabled={status.submitting}>
          {!status.submitting
            ? !status.submitted
              ? 'Submit'
              : 'Submitted'
            : 'Submitting...'}
        </button>
      </form>
      {status.info.error && (
        <div className="error">Error: {status.info.msg}</div>
      )}
      {!status.info.error && status.info.msg && (
        <div className="success">{status.info.msg}</div>
      )}
    </main>
  );
}
