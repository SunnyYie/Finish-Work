import React from 'react';
import { Link, Card, Typography } from '@arco-design/web-react';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/docs.module.less';

const links = {
  react: 'http://www.kaoyanmiji.com/wendang/1130881.html',
  vue: 'https://arco.design/vue/docs/start',
  designLab: 'https://arco.design/themes',
  materialMarket: 'https://arco.design/material/',
};
function QuickOperation() {
  const t = useLocale(locale);

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Title heading={6}>{t['workplace.docs']}</Typography.Title>
        <Link>{t['workplace.seeMore']}</Link>
      </div>
      <div className={styles.docs}>
        {Object.entries(links).map(([key, value]) => (
          <Link className={styles.link} key={key} href={value} target="_blank">
            {'知识产权相关文档'}
          </Link>
        ))}
      </div>
    </Card>
  );
}

export default QuickOperation;
