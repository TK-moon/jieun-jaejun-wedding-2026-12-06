import { useState, type FC } from 'react';
import { CopyIcon } from '../../../components/icons/CopyIcon/CopyIcon';
import { Modal } from '../../../components/Modal/Modal';
import { useToast } from '../../../hooks/useToast';
import { is_clipboard_available } from '../../../lib/clipboard';
import type { Account } from '../_types';
import { getSmsHref, getTelHref } from '../_utils';
import styles from './index.module.css';

interface Props {
  name: string;
  phone: string;
  account: Account;
}

const ContactActions: FC<Props> = (props) => {
  const { name, phone, account } = props;
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const toast = useToast();
  const canCopy = is_clipboard_available();

  const handleOpenAccount = () => {
    setIsAccountOpen(true);
  };

  const handleCloseAccount = () => {
    setIsAccountOpen(false);
  };

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(account.number);
      toast.show({ id: 'copy-account', content: '계좌번호를 복사했어요' });
    } catch {
      toast.show({ id: 'copy-account', content: '계좌번호 복사에 실패했어요' });
    }
  };

  return (
    <>
      <div className={styles.actions}>
        <a className={styles.link} href={getTelHref(phone)} aria-label={`${name}에게 전화`}>
          전화
        </a>
        <span className={styles.separator} aria-hidden="true">
          ·
        </span>
        <a className={styles.link} href={getSmsHref(phone)} aria-label={`${name}에게 문자`}>
          문자
        </a>
        <span className={styles.separator} aria-hidden="true">
          ·
        </span>
        <button
          type="button"
          className={styles.link}
          onClick={handleOpenAccount}
          aria-label={`${name} 계좌 보기`}
        >
          계좌
        </button>
      </div>

      <Modal open={isAccountOpen} onClose={handleCloseAccount} title={`${name} 계좌`}>
        <dl className={styles.account}>
          <div className={styles.accountRow}>
            <dt className={styles.accountLabel}>예금주</dt>
            <dd className={styles.accountValue}>{account.holder}</dd>
          </div>
          <div className={styles.accountRow}>
            <dt className={styles.accountLabel}>은행</dt>
            <dd className={styles.accountValue}>{account.bank}</dd>
          </div>
          <div className={styles.accountRow}>
            <dt className={styles.accountLabel}>계좌번호</dt>
            <dd className={styles.accountNumber}>
              <span>{account.number}</span>
              {canCopy ? (
                <button
                  type="button"
                  className={styles.copy}
                  onClick={handleCopyAccount}
                  aria-label="계좌번호 복사"
                >
                  <CopyIcon />
                </button>
              ) : null}
            </dd>
          </div>
        </dl>
      </Modal>
    </>
  );
};

export { ContactActions };
