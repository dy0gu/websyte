import type { Form as ContactForm } from '@payloadcms/plugin-form-builder/types';
import { useTranslations } from 'next-intl';

import { FormBlock } from '~/blocks/form/component';

import styles from '~/components/home/home.module.css';

type ContactSectionProps = {
  contactEmail?: string;
  contactForm: ContactForm | null;
};

export function ContactSection({ contactEmail, contactForm }: ContactSectionProps) {
  const t = useTranslations('UI');
  return (
    <section className={styles.contact} id="contact">
      <div className={styles.contactTop}>
        <h2 className={styles.sectionTitle}>{t('contactHeading')}</h2>
      </div>
      <div className={styles.contactBody}>
        <div className={styles.contactMain}>
          <div className={styles.contactHeading}>
            {contactEmail && (
              <a className={styles.contactLink} href={`mailto:${contactEmail}`}>
                {t('sendEmail')} <span>↗</span>
              </a>
            )}
            {contactEmail && contactForm && <span className={styles.contactChoice}>{t('or')}</span>}
            {contactForm && <p>{t('leaveMessage')}</p>}
          </div>
          {contactForm && (
            <div>
              <FormBlock
                className={styles.contactForm}
                enableIntro={false}
                form={contactForm}
                submitButtonVariant="outline"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
