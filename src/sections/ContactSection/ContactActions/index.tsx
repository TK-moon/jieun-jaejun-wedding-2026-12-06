import { useState, type FC } from 'react';
import kakaoPayLarge from '../../../assets/kakao-pay-large.png';
import kakaoPayMedium from '../../../assets/kakao-pay-medium.png';
import kakaoPaySmall from '../../../assets/kakao-pay-small.png';
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
      await navigator.clipboard.writeText(`${account.bank} ${account.number}`);
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

          {account.kakaoPayUrl ? (
            <div className={styles.kakaoPayBlock}>
              <p className={styles.kakaoPayHint}>또는 카카오페이로</p>
              <a
                className={styles.kakaoPayLink}
                href={account.kakaoPayUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${name}에게 카카오페이로 송금`}
              >
                <img
                  className={styles.kakaoPayIcon}
                  src={kakaoPayMedium}
                  srcSet={`${kakaoPaySmall} 97w, ${kakaoPayMedium} 121w, ${kakaoPayLarge} 241w`}
                  sizes="68px"
                  width={68}
                  height={28}
                  alt=""
                  decoding="async"
                />
              </a>
            </div>
          ) : null}
        </div>
      </Modal>
    </>
  );
};

export { ContactActions };
