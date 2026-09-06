import { useState, type FC, type ReactElement } from 'react';
import { CopyIcon } from '../../../components/icons/CopyIcon/CopyIcon';
import { Modal } from '../../../components/Modal/Modal';
import { useToast } from '../../../hooks/useToast';
import { isClipboardAvailable } from '../../../lib/clipboard';
import type { Account } from '../_types';
import { getSmsHref, getTelHref } from '../_utils';
import { Divider } from './Divider';
import styles from './index.module.css';

interface Props {
  name: string;
  phone: string;
  account?: Account;
}

const ContactActions: FC<Props> = (props) => {
  const { name, phone, account } = props;
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const toast = useToast();

  const canCopy = isClipboardAvailable();

  const handleOpenAccount = () => {
    setIsAccountOpen(true);
  };

  const handleCloseAccount = () => {
    setIsAccountOpen(false);
  };

  const handleCopyAccount = async () => {
    if (!account) {
      return;
    }

    try {
      await navigator.clipboard.writeText(`${account.bank} ${account.number}`);
      handleCloseAccount();
      toast.show({ id: 'copy-account', content: '계좌번호를 복사했어요' });
    } catch {
      toast.show({ id: 'copy-account', content: '계좌번호 복사에 실패했어요' });
    }
  };

  const getActions = () => {
    const actions = [
      <a
        key="call"
        className={styles.link}
        href={getTelHref(phone)}
        aria-label={`${name}에게 전화`}
      >
        전화
      </a>,
      <a key="sms" className={styles.link} href={getSmsHref(phone)} aria-label={`${name}에게 문자`}>
        문자
      </a>,
      account ? (
        <button
          key="account"
          type="button"
          className={styles.link}
          onClick={handleOpenAccount}
          aria-label={`${name} 계좌 보기`}
        >
          계좌
        </button>
      ) : null,
    ]
      .filter((action): action is ReactElement => action !== null)
      .flatMap((action, index) =>
        index === 0 ? [action] : [<Divider key={`divider-${index}`} />, action],
      );

    return actions;
  };

  return (
    <>
      <div className={styles.actions}>{getActions()}</div>
      {account ? (
        <Modal open={isAccountOpen} onClose={handleCloseAccount} title="계좌 안내">
          <div className={styles.accountPanel}>
            <dl className={styles.holder}>
              <dt className={styles.holderLabel}>예금주</dt>
              <dd className={styles.holderName}>{account.holder}</dd>
            </dl>

            <div className={styles.accountDivider} aria-hidden="true" />

            <dl className={styles.transfer}>
              <div className={styles.bankRow}>
                <dt className={styles.srOnly}>은행</dt>
                <dd className={styles.bank}>{account.bank}</dd>
              </div>
              <div className={styles.numberRow}>
                <dt className={styles.srOnly}>계좌번호</dt>
                <dd className={styles.number}>{account.number}</dd>
              </div>
            </dl>

            {canCopy ? (
              <button type="button" className={styles.copyAction} onClick={handleCopyAccount}>
                <CopyIcon />
                <span>계좌번호 복사</span>
              </button>
            ) : null}
          </div>
        </Modal>
      ) : null}
    </>
  );
};

export { ContactActions };
