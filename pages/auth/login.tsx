import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import RegisterForm from '@/resources/inputs/register-form';
import register_page_style from '@/styles/pages/register.module.css';
import { getStaticPropsWithTranslations } from '@/modules/lang/props';

export const getStaticProps = getStaticPropsWithTranslations;

const LoginPage: React.FC = () => {
  const t = useTranslations('common');
  const handleRegisterSuccess = (user: any, token: string) => {
    console.log('Login successful:', user, token);
  };

  return (
    <div className={register_page_style.container}>
      <div className={register_page_style.leftColumn}>
        <div className={register_page_style.logo}>
          <Image src="/login-register.svg" alt="Login and Register" width={400} height={60} />
        </div>
      </div>
      <div className={register_page_style.rightColumn}>
        <div className={register_page_style.rightColumnContent}>
          <Image src="/user.svg" alt="Login and Register" width={45} height={45} />
          <h1 className={register_page_style.title}>{t('Login')}</h1>
          <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
          <p className={register_page_style.login_text}>{t('Dont have an account?')} <strong> {t('Register')} </strong></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;