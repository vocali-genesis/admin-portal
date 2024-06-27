import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginUser } from '@/modules/auth/register-service';
import { oauth } from '@/modules/auth/oauth-service';
import form_style from '@/styles/forms/form.module.css';
import auth_schema from '@/resources/form-schemas/auth-schema';
import { getStaticPropsWithTranslations } from '@/modules/lang/props';

export const getStaticProps = getStaticPropsWithTranslations;

interface RegisterFormProps {
  onRegisterSuccess: (user: any, token: string) => void;
}

const LoginForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const t = useTranslations('common');
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(auth_schema)
  });

  const onSubmit = async (data: any) => {
    try {
      const { user, token } = await loginUser(data.email, data.password);
      onLoginSuccess(user, token);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleOAuthClick = async (provider: string) => {
    try {
      const userData = await oauth(provider);
      // Handle OAuth login success (e.g., redirect, store tokens)
      console.log('OAuth login success:', userData);
    } catch (error) {
      console.error('OAuth login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={form_style.formContainer}>
      <div className={form_style.formInput}>
        <input 
          {...register('email', { required: 'Email is required' })} 
          type="email" 
          placeholder={t('Email')}
          className={`${form_style.formControl} ${form_style.inputEmailIcon}`} 
        />
        {errors.email && <span className={form_style.errorMessage}>{errors.email.message}</span>}
      </div>
      <div className={form_style.formInput}>
        <input 
          {...register('password', { required: 'Password is required' })} 
          type="password"
          placeholder={t('Password')}
          className={`${form_style.formControl} ${form_style.inputPasswordIcon}`} 
        />
        {errors.password && <span className={form_style.errorMessage}>{errors.password.message}</span>}
      </div>
      <div className={form_style.buttonWrapper}>
        <button type="submit" className={form_style.submitButton}>{t('Login')}</button>
      </div>
      <div className={form_style.oauth}>
        <div className={form_style.oauthTextContainer}>
          <p className={form_style.oauthText}><strong>{t('Login')}</strong> {t('with others')}:</p>
        </div>
        <button 
          type="button" 
          onClick={() => handleOAuthClick('google')} 
          className={`${form_style.oauthButton} ${form_style.googleOAuthButton}`}
        >
          <p> {t('Login with')} <strong> google</strong> </p>
        </button>
        <button 
          type="button" 
          onClick={() => handleOAuthClick('facebook')} 
          className={`${form_style.oauthButton} ${form_style.facebookOAuthButton}`}
        >
          <p> {t('Login with')} <strong> facebook</strong> </p>
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
