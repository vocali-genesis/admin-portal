import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Provider } from '@supabase/supabase-js';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerUser } from '@/modules/auth/register-service';
import { oauth } from '@/modules/auth/oauth-service';
import form_style from '@/styles/forms/form.module.css';
import auth_schema from '@/resources/form-schemas/auth-schema';
import { getStaticPropsWithTranslations } from '@/modules/lang/props';

export const getStaticProps = getStaticPropsWithTranslations;

interface RegisterFormProps {
  onRegisterSuccess: (user: any, token: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const t = useTranslations('common');
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(auth_schema)
  });

  const [message, setMessage] = useState<{ type: 'error' | 'success' | null; text: string | null }>({ type: null, text: null });

  const setTemporaryMessage = (type: 'error' | 'success', text: string) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage({ type: null, text: null });
    }, 5000);
  };

  const onSubmit = async (data: any) => {
    try {
      setMessage({ type: null, text: null });
      const { user, token } = await registerUser(data.email, data.password);
      setTemporaryMessage('success', t('Registration successful'));
      onRegisterSuccess(user, (token) as string);
    } catch (error) {
      console.error('Registration failed:', error);
      if (error instanceof Error) {
        setTemporaryMessage('error', t(error.message));
      } else {
        setTemporaryMessage('error', t('An unexpected error occurred'));
      }
    }
  };

  const handleOAuthClick = async (provider: Provider) => {
    try {
      setMessage({ type: null, text: null }); 
      const { url } = await oauth(provider);
      if (url) {
        window.location.href = url;
      } else {
        setTemporaryMessage('error', t('Failed to initiate OAuth login'));
      }
    } catch (error) {
      console.error('OAuth login failed:', error);
      if (error instanceof Error) {
        setTemporaryMessage('error', t(error.message));
      } else {
        setTemporaryMessage('error', t('An unexpected error occurred during OAuth login'));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={form_style.formContainer}>
      {message.text && (
        <div className={`${form_style.messageContainer} ${message.type === 'error' ? form_style.errorContainer : form_style.successContainer}`}>
          <span className={form_style.messageText}>{message.text}</span>
        </div>
      )}
      <div className={form_style.formInput}>
        <input 
          {...register('email', { required: 'Email is required' })} 
          type="email" 
          placeholder={t('Email')}
          className={`${form_style.formControl} ${form_style.inputEmailIcon}`} 
        />
        {errors.email && <span className={form_style.errorMessage}>{t(errors.email.message)}</span>}
      </div>
      <div className={form_style.formInput}>
        <input 
          {...register('password', { required: 'Password is required' })} 
          type="password"
          placeholder={t('Password')}
          className={`${form_style.formControl} ${form_style.inputPasswordIcon}`} 
        />
        {errors.password && <span className={form_style.errorMessage}>{t(errors.password.message)}</span>}
      </div>
      <div className={form_style.buttonWrapper}>
        <button type="submit" className={form_style.submitButton}>{t('Register')}</button>
      </div>
      <div className={form_style.oauth}>
        <div className={form_style.oauthTextContainer}>
          <p className={form_style.oauthText}><strong>{t('Register')}</strong> {t('with others')}:</p>
        </div>
        <button 
          type="button" 
          onClick={() => handleOAuthClick('google')} 
          className={`${form_style.oauthButton} ${form_style.googleOAuthButton}`}
        >
          <p> {t('Register with')} <strong> google</strong> </p>
        </button>
        <button 
          type="button" 
          onClick={() => handleOAuthClick('facebook')} 
          className={`${form_style.oauthButton} ${form_style.facebookOAuthButton}`}
        >
          <p> {t('Register with')} <strong> facebook</strong> </p>
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
