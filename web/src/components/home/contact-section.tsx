import type { Form as ContactForm } from '@payloadcms/plugin-form-builder/types';
import { useTranslations } from 'next-intl';

import { FormBlock } from '~/blocks/form/component';

import styles from '~/components/home/home.module.css';

type ContactSectionProps = {
  contactForm: ContactForm | null;
};

export function ContactSection({ contactForm }: ContactSectionProps) {
  const t = useTranslations('UI');
  return (
    <section className={styles.contact} id="contact">
      <div className={styles.contactTop}>
        <h2 className={styles.sectionTitle}>{t('contactHeading')}</h2>
      </div>
      <div className={styles.contactBody}>
        <div className={styles.contactMain}>
          {contactForm && (
            <div className={styles.contactHeading}>
              <p>{t('leaveMessage')}</p>
            </div>
          )}
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
