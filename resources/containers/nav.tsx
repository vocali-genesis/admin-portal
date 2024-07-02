import React from "react";
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getStaticPropsWithTranslations } from '@/modules/lang/props';
import nav_styles from '@/styles/components/nav.module.css';

export const getStaticProps = getStaticPropsWithTranslations;

const Navbar: React.FC = () => {
  const t = useTranslations('common');

  return (
    <nav className={nav_styles.navbar}>
      <div className={nav_styles.dropdown}>
        <select>
          <option>{t('Organization')}</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <div className={nav_styles.navbarRight}>
        <button className={nav_styles.upgradeButton}>
          {t('Upgrade')}
        </button>
        <Image src="/Avatar.svg" alt="User" width={33} height={33} className={nav_styles.userIcon} />
      </div>
    </nav>
  );
};

export default Navbar;